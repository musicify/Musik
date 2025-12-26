import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";
import { createNotification } from "@/lib/api/notifications";
import { z } from "zod";

const sendMessageSchema = z.object({
  content: z.string().min(1, "Nachricht darf nicht leer sein"),
  fileUrl: z.string().url().optional(),
  fileType: z.string().optional(),
});

// GET - Nachrichten abrufen
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { chatId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = await createClient();

    // Prüfe ob User Teilnehmer des Chats ist
    const { data: participant, error: participantError } = await supabase
      .from("chat_participants")
      .select("id")
      .eq("chat_id", chatId)
      .eq("user_id", user.id)
      .single();

    if ((participantError || !participant) && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Nachrichten laden
    const offset = (page - 1) * limit;
    const { data: messages, error, count } = await supabase
      .from("chat_messages")
      .select(`
        id,
        content,
        file_url,
        file_type,
        is_system_message,
        created_at,
        sender:users!chat_messages_sender_id_fkey (
          id,
          name,
          image
        )
      `, { count: "exact" })
      .eq("chat_id", chatId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Messages Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Nachrichten" },
        { status: 500 }
      );
    }

    // Transformiere und kehre Reihenfolge um (neueste zuletzt)
    const transformedMessages = (messages || []).reverse().map((msg: any) => ({
      id: msg.id,
      chatId: chatId,
      senderId: msg.sender?.id,
      content: msg.content,
      fileUrl: msg.file_url,
      fileType: msg.file_type,
      isSystemMessage: msg.is_system_message,
      createdAt: msg.created_at,
      sender: msg.sender ? {
        id: msg.sender.id,
        name: msg.sender.name,
        image: msg.sender.image,
      } : null,
    }));

    return NextResponse.json({
      messages: transformedMessages,
      hasMore: (count || 0) > offset + limit,
      total: count || 0,
    });
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Nachrichten");
  }
}

// POST - Nachricht senden
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { chatId } = await params;
    const body = await req.json();
    const validatedData = sendMessageSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob User Teilnehmer des Chats ist
    const { data: participant, error: participantError } = await supabase
      .from("chat_participants")
      .select("id")
      .eq("chat_id", chatId)
      .eq("user_id", user.id)
      .single();

    if (participantError || !participant) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Nachricht erstellen
    const { data: message, error: createError } = await supabase
      .from("chat_messages")
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content: validatedData.content,
        file_url: validatedData.fileUrl,
        file_type: validatedData.fileType,
        is_system_message: false,
      })
      .select(`
        id,
        content,
        file_url,
        file_type,
        is_system_message,
        created_at,
        sender:users!chat_messages_sender_id_fkey (
          id,
          name,
          image
        )
      `)
      .single();

    if (createError || !message) {
      console.error("Create Message Error:", createError);
      return NextResponse.json(
        { error: "Fehler beim Senden der Nachricht" },
        { status: 500 }
      );
    }

    // Chat aktualisieren für "zuletzt geändert"
    await supabase
      .from("chats")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", chatId);

    // Finde den anderen Teilnehmer für Benachrichtigung
    const { data: participants } = await supabase
      .from("chat_participants")
      .select("user_id")
      .eq("chat_id", chatId)
      .neq("user_id", user.id);

    // Sende Benachrichtigung an den anderen Teilnehmer
    if (participants && participants.length > 0) {
      const otherParticipantId = participants[0].user_id;
      
      // Hole Chat-Info für Link
      const { data: chatData } = await supabase
        .from("chats")
        .select("order_id")
        .eq("id", chatId)
        .single();

      await createNotification({
        userId: otherParticipantId,
        type: "message",
        title: "Neue Nachricht",
        message: `${user.name || "Jemand"} hat dir eine Nachricht gesendet`,
        link: chatData?.order_id ? `/orders/${chatData.order_id}` : undefined,
        metadata: {
          chatId: chatId,
          senderId: user.id,
          senderName: user.name,
        },
      });
    }

    // Transformiere
    const transformedMessage = {
      id: message.id,
      chatId: chatId,
      senderId: user.id,
      content: message.content,
      fileUrl: message.file_url,
      fileType: message.file_type,
      isSystemMessage: message.is_system_message,
      createdAt: message.created_at,
      sender: message.sender ? {
        id: (message.sender as any).id,
        name: (message.sender as any).name,
        image: (message.sender as any).image,
      } : null,
    };

    return NextResponse.json(transformedMessage, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Senden der Nachricht");
  }
}
