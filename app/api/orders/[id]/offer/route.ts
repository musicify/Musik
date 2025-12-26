import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireDirector, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";
import { createNotification } from "@/lib/api/notifications";
import { z } from "zod";

const offerSchema = z.object({
  price: z.number().min(1, "Preis muss mindestens €1 sein"),
  productionTime: z.number().min(1, "Produktionszeit muss mindestens 1 Tag sein"),
  message: z.string().optional(),
  includedRevisions: z.number().min(1).max(5).default(2),
});

// POST - Angebot abgeben (Director)
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
    const validatedData = offerSchema.parse(body);

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

    // Nur PENDING Aufträge können ein Angebot erhalten
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Ein Angebot wurde bereits abgegeben" },
        { status: 400 }
      );
    }

    // Bestellung aktualisieren
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "OFFER_PENDING",
        offered_price: validatedData.price,
        production_time: validatedData.productionTime,
        included_revisions: validatedData.includedRevisions,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Erstellen des Angebots" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "OFFER_PENDING",
      message: `Angebot: €${validatedData.price}, ${validatedData.productionTime} Tage, ${validatedData.includedRevisions} Revisionen`,
      changed_by: user.id,
    });

    // Chat-Nachricht wenn vorhanden
    const { data: chat } = await supabase
      .from("chats")
      .select("id")
      .eq("order_id", id)
      .single();

    if (chat) {
      // System-Nachricht für Angebot
      await supabase.from("chat_messages").insert({
        chat_id: chat.id,
        sender_id: user.id,
        content: `📋 Angebot abgegeben:\n• Preis: €${validatedData.price}\n• Lieferzeit: ${validatedData.productionTime} Tage\n• Inkl. Revisionen: ${validatedData.includedRevisions}`,
        is_system_message: true,
      });

      // Optionale persönliche Nachricht
      if (validatedData.message) {
        await supabase.from("chat_messages").insert({
          chat_id: chat.id,
          sender_id: user.id,
          content: validatedData.message,
          is_system_message: false,
        });
      }
    }

    // Benachrichtigung an Customer senden
    await createNotification({
      userId: order.customer_id,
      type: "offer",
      title: "Neues Angebot erhalten",
      message: `Du hast ein Angebot für "${order.title || "deinen Auftrag"}" erhalten`,
      link: `/orders/${id}`,
      metadata: {
        orderId: id,
        price: validatedData.price,
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
    return handleApiError(error, "Fehler beim Erstellen des Angebots");
  }
}
