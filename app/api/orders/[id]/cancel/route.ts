import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";
import { z } from "zod";

const cancelSchema = z.object({
  reason: z.string().optional(),
});

// POST - Auftrag stornieren
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
    const validatedData = cancelSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Bestellung existiert
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, customer_id, director_id, status")
      .eq("id", id)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    // Prüfe Berechtigung (Customer, Director oder Admin)
    const directorProfile = user.role === "DIRECTOR" ? await getDirectorProfile(user.id) : null;
    const isCustomer = order.customer_id === user.id;
    const isDirector = directorProfile && order.director_id === directorProfile.id;
    const isAdmin = user.role === "ADMIN";

    if (!isCustomer && !isDirector && !isAdmin) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Stornierungsregeln je nach Status
    const cancelableStatuses = ["PENDING", "OFFER_PENDING"];
    const cancelableWithPenalty = ["OFFER_ACCEPTED", "IN_PROGRESS"];

    if (!cancelableStatuses.includes(order.status) && !cancelableWithPenalty.includes(order.status) && !isAdmin) {
      return NextResponse.json(
        { error: "Diese Bestellung kann nicht mehr storniert werden" },
        { status: 400 }
      );
    }

    // Bestimme ob Rückerstattung/Gebühr anfällt
    let cancelMessage = validatedData.reason || "Storniert";
    let refundNote = "";

    if (cancelableWithPenalty.includes(order.status)) {
      if (isCustomer) {
        refundNote = " (Anzahlung kann einbehalten werden)";
      } else if (isDirector) {
        refundNote = " (Vollständige Rückerstattung an Kunden)";
      }
    }

    // Bestellung aktualisieren
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "CANCELLED",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Stornieren" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "CANCELLED",
      message: cancelMessage + refundNote,
      changed_by: user.id,
    });

    // Aus Warenkorb entfernen
    await supabase
      .from("cart_items")
      .delete()
      .eq("order_id", id);

    // Chat-Nachricht
    const { data: chat } = await supabase
      .from("chats")
      .select("id")
      .eq("order_id", id)
      .single();

    if (chat) {
      const cancelledBy = isCustomer ? "Kunde" : isDirector ? "Komponist" : "Admin";
      await supabase.from("chat_messages").insert({
        chat_id: chat.id,
        sender_id: user.id,
        content: `❌ Auftrag wurde storniert von ${cancelledBy}.${validatedData.reason ? `\nGrund: ${validatedData.reason}` : ""}${refundNote}`,
        is_system_message: true,
      });
    }

    // TODO: E-Mail-Benachrichtigungen senden
    // TODO: Rückerstattung verarbeiten wenn nötig

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "Fehler beim Stornieren");
  }
}
