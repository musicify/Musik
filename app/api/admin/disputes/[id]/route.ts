import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const resolveSchema = z.object({
  resolution: z.enum(["COMPLETE", "CANCEL", "PARTIAL_REFUND"]),
  refundAmount: z.number().min(0).optional(),
  note: z.string().optional(),
});

// PUT - Dispute lösen
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;
    const body = await req.json();
    const validatedData = resolveSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Order existiert und DISPUTED ist
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, status, offered_price, customer_id, director_id")
      .eq("id", id)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    if (order.status !== "DISPUTED") {
      return NextResponse.json(
        { error: "Diese Bestellung ist kein Streitfall" },
        { status: 400 }
      );
    }

    let newStatus: string;
    let message: string;

    switch (validatedData.resolution) {
      case "COMPLETE":
        newStatus = "COMPLETED";
        message = `Streitfall gelöst: Auftrag als abgeschlossen markiert.${validatedData.note ? ` Notiz: ${validatedData.note}` : ""}`;
        break;
      case "CANCEL":
        newStatus = "CANCELLED";
        message = `Streitfall gelöst: Auftrag storniert.${validatedData.note ? ` Notiz: ${validatedData.note}` : ""}`;
        break;
      case "PARTIAL_REFUND":
        newStatus = "CANCELLED";
        message = `Streitfall gelöst: Teilrückerstattung von €${validatedData.refundAmount}.${validatedData.note ? ` Notiz: ${validatedData.note}` : ""}`;
        break;
      default:
        newStatus = "CANCELLED";
        message = "Streitfall gelöst durch Admin";
    }

    // Order aktualisieren
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: newStatus,
      message: message,
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
        content: `⚖️ Admin-Entscheidung: ${message}`,
        is_system_message: true,
      });
    }

    // TODO: E-Mails an beide Parteien senden
    // TODO: Rückerstattung über Stripe verarbeiten

    return NextResponse.json({
      message: "Streitfall gelöst",
      order: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Lösen des Streitfalls");
  }
}
