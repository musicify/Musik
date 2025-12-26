import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const revisionSchema = z.object({
  feedback: z.string().min(10, "Feedback muss mindestens 10 Zeichen haben"),
});

// POST - Revision anfordern (Customer)
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
    const validatedData = revisionSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Bestellung existiert und dem Customer gehört
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, customer_id, status, included_revisions, used_revisions, max_revisions")
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

    // Nur IN_PROGRESS oder READY_FOR_PAYMENT Aufträge können eine Revision erhalten
    if (!["IN_PROGRESS", "READY_FOR_PAYMENT"].includes(order.status)) {
      return NextResponse.json(
        { error: "Eine Revision kann in diesem Status nicht angefordert werden" },
        { status: 400 }
      );
    }

    // Prüfe ob noch Revisionen verfügbar
    const remainingRevisions = order.included_revisions - order.used_revisions;
    if (remainingRevisions <= 0 && order.used_revisions >= order.max_revisions) {
      return NextResponse.json(
        { error: "Maximale Anzahl an Revisionen erreicht. Bitte kontaktiere den Support." },
        { status: 400 }
      );
    }

    const isPaidRevision = remainingRevisions <= 0;

    // Bestellung aktualisieren
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "REVISION_REQUESTED",
        used_revisions: order.used_revisions + 1,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Anfordern der Revision" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "REVISION_REQUESTED",
      message: isPaidRevision
        ? `Kostenpflichtige Revision angefordert: ${validatedData.feedback}`
        : `Revision angefordert (${order.used_revisions + 1}/${order.included_revisions}): ${validatedData.feedback}`,
      changed_by: user.id,
    });

    // Chat-Nachricht
    const { data: chat } = await supabase
      .from("chats")
      .select("id")
      .eq("order_id", id)
      .single();

    if (chat) {
      const revisionInfo = isPaidRevision
        ? "⚠️ Kostenpflichtige Revision angefordert"
        : `🔄 Revision angefordert (${order.used_revisions + 1}/${order.included_revisions} inkludiert)`;

      await supabase.from("chat_messages").insert({
        chat_id: chat.id,
        sender_id: user.id,
        content: revisionInfo,
        is_system_message: true,
      });

      await supabase.from("chat_messages").insert({
        chat_id: chat.id,
        sender_id: user.id,
        content: validatedData.feedback,
        is_system_message: false,
      });
    }

    // Entferne aus Warenkorb falls vorhanden
    await supabase
      .from("cart_items")
      .delete()
      .eq("order_id", id);

    // TODO: E-Mail an Director senden

    return NextResponse.json({
      ...updated,
      isPaidRevision,
      remainingFreeRevisions: Math.max(0, order.included_revisions - order.used_revisions - 1),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Anfordern der Revision");
  }
}
