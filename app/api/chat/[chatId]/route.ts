import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";

// GET - Chat mit Nachrichten abrufen
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
    const supabase = await createClient();

    // Prüfe ob User Teilnehmer des Chats ist
    const { data: participant, error: participantError } = await supabase
      .from("chat_participants")
      .select("id")
      .eq("chat_id", chatId)
      .eq("user_id", user.id)
      .single();

    // Admins haben immer Zugriff
    if ((participantError || !participant) && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Chat mit Nachrichten und Teilnehmern laden
    const { data: chat, error } = await supabase
      .from("chats")
      .select(`
        id,
        order_id,
        created_at,
        order:orders (
          id,
          order_number,
          title,
          status
        ),
        participants:chat_participants (
          user_id,
          joined_at,
          user:users (
            id,
            name,
            image,
            role
          )
        )
      `)
      .eq("id", chatId)
      .single();

    if (error || !chat) {
      return NextResponse.json(
        { error: "Chat nicht gefunden" },
        { status: 404 }
      );
    }

    // Transformiere Daten
    const transformedChat = {
      id: chat.id,
      orderId: chat.order_id,
      createdAt: chat.created_at,
      order: chat.order ? {
        id: chat.order.id,
        orderNumber: chat.order.order_number,
        title: chat.order.title,
        status: chat.order.status,
      } : null,
      participants: (chat.participants || []).map((p: any) => ({
        userId: p.user_id,
        joinedAt: p.joined_at,
        user: p.user ? {
          id: p.user.id,
          name: p.user.name,
          image: p.user.image,
          role: p.user.role,
        } : null,
      })),
    };

    return NextResponse.json(transformedChat);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden des Chats");
  }
}

