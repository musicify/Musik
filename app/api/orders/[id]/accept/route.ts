import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";
import { createNotification } from "@/lib/api/notifications";

// POST - Angebot annehmen (Customer)
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
    const supabase = await createClient();

    // Prüfe ob Bestellung existiert und dem Customer gehört
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, customer_id, status, offered_price, director_id, title")
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

    // Nur OFFER_PENDING Aufträge können angenommen werden
    if (order.status !== "OFFER_PENDING") {
      return NextResponse.json(
        { error: "Kein Angebot zum Annehmen vorhanden" },
        { status: 400 }
      );
    }

    // Bestellung aktualisieren
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "OFFER_ACCEPTED",
        offer_accepted_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Annehmen des Angebots" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "OFFER_ACCEPTED",
      message: `Angebot über €${order.offered_price} angenommen`,
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
        content: "✅ Angebot angenommen! Die Produktion kann beginnen.",
        is_system_message: true,
      });
    }

    // Benachrichtigung an Director senden
    if (order.director_id) {
      // Hole Director user_id
      const { data: director } = await supabase
        .from("director_profiles")
        .select("user_id")
        .eq("id", order.director_id)
        .single();

      if (director?.user_id) {
        await createNotification({
          userId: director.user_id,
          type: "offer",
          title: "Angebot angenommen",
          message: `Dein Angebot für "${order.title || "Auftrag"}" wurde angenommen`,
          link: `/director/orders`,
          metadata: {
            orderId: id,
          },
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "Fehler beim Annehmen des Angebots");
  }
}
