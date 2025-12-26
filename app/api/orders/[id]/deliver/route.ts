import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireDirector, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";
import { createNotification } from "@/lib/api/notifications";
import { z } from "zod";

const deliverSchema = z.object({
  musicUrl: z.string().url("Ungültige Musik-URL"),
  message: z.string().optional(),
});

// POST - Musik liefern (Director)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireDirector();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;
    const body = await req.json();
    const validatedData = deliverSchema.parse(body);

    const supabase = await createClient();

    // Hole Director-Profil
    const directorProfile = await getDirectorProfile(user.id);
    if (!directorProfile) {
      return NextResponse.json(
        { error: "Director-Profil nicht gefunden" },
        { status: 404 }
      );
    }

    // Prüfe ob Bestellung existiert und dem Director zugewiesen ist
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, director_id, status, customer_id, title")
      .eq("id", id)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    if (order.director_id !== directorProfile.id) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Nur IN_PROGRESS, OFFER_ACCEPTED oder REVISION_REQUESTED Aufträge können geliefert werden
    const allowedStatuses = ["IN_PROGRESS", "OFFER_ACCEPTED", "REVISION_REQUESTED"];
    if (!allowedStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: "Bestellung ist nicht im richtigen Status für eine Lieferung" },
        { status: 400 }
      );
    }

    // Bestellung aktualisieren
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "READY_FOR_PAYMENT",
        final_music_url: validatedData.musicUrl,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Liefern" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "READY_FOR_PAYMENT",
      message: "Finale Musik geliefert",
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
        content: "🎵 Finale Musik wurde geliefert! Die Musik ist bereit zur Zahlung.",
        is_system_message: true,
      });

      // Musik-Datei als Nachricht
      await supabase.from("chat_messages").insert({
        chat_id: chat.id,
        sender_id: user.id,
        content: validatedData.message || "Hier ist die finale Version!",
        file_url: validatedData.musicUrl,
        file_type: "audio",
        is_system_message: false,
      });
    }

    // Füge Musik zum Warenkorb hinzu
    await supabase.from("cart_items").insert({
      user_id: order.customer_id,
      order_id: id,
      license_type: "COMMERCIAL",
    });

    // Benachrichtigung an Customer senden
    await createNotification({
      userId: order.customer_id,
      type: "completion",
      title: "Musik ist fertig!",
      message: `Die finale Musik für "${order.title || "deinen Auftrag"}" ist bereit zur Zahlung`,
      link: `/orders/${id}`,
      metadata: {
        orderId: id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Liefern");
  }
}
