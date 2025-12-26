import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().optional(),
});

// POST - Angebot ablehnen (Customer)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;
    const body = await req.json();
    const validatedData = rejectSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Bestellung existiert und dem Customer gehört
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, customer_id, status")
      .eq("id", id)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    if (order.customer_id !== user.id) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Nur OFFER_PENDING Aufträge können abgelehnt werden
    if (order.status !== "OFFER_PENDING") {
      return NextResponse.json(
        { error: "Kein Angebot zum Ablehnen vorhanden" },
        { status: 400 }
      );
    }

    // Bestellung zurück auf PENDING setzen
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "PENDING",
        offered_price: null,
        production_time: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Ablehnen des Angebots" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "PENDING",
      message: validatedData.reason
        ? `Angebot abgelehnt: ${validatedData.reason}`
        : "Angebot abgelehnt",
      changed_by: user.id,
    });

    // Chat-Nachricht
    const { data: chat } = await supabase
      .from("chats")
      .select("id")
      .eq("order_id", id)
      .single();

    if (chat) {
      await supabase.from("chat_messages").insert({
        chat_id: chat.id,
        sender_id: user.id,
        content: validatedData.reason
          ? `❌ Angebot abgelehnt: ${validatedData.reason}`
          : "❌ Angebot abgelehnt. Bitte ein neues Angebot erstellen.",
        is_system_message: true,
      });
    }

    // TODO: E-Mail an Director senden

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "Fehler beim Ablehnen des Angebots");
  }
}
