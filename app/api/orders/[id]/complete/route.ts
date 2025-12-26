import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";

// POST - Auftrag abschließen (nach Zahlung)
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

    // Prüfe ob Bestellung existiert
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, customer_id, director_id, status, final_music_url, offered_price")
      .eq("id", id)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    // Prüfe Berechtigung (Customer oder Admin)
    const isCustomer = order.customer_id === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isCustomer && !isAdmin) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Nur PAID Aufträge können abgeschlossen werden
    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: "Bestellung muss bezahlt sein" },
        { status: 400 }
      );
    }

    // Bestellung aktualisieren
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "COMPLETED",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Abschließen" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "COMPLETED",
      message: "Auftrag erfolgreich abgeschlossen",
      changed_by: user.id,
    });

    // Download-Eintrag erstellen
    if (order.final_music_url) {
      await supabase.from("downloads").insert({
        user_id: order.customer_id,
        order_id: id,
        license_type: "COMMERCIAL",
        download_url: order.final_music_url,
      });
    }

    // Director-Statistiken aktualisieren
    if (order.director_id) {
      const { data: directorProfile } = await supabase
        .from("director_profiles")
        .select("total_projects, total_earnings")
        .eq("id", order.director_id)
        .single();

      if (directorProfile) {
        await supabase
          .from("director_profiles")
          .update({
            total_projects: (directorProfile.total_projects || 0) + 1,
            total_earnings: (directorProfile.total_earnings || 0) + (order.offered_price || 0),
          })
          .eq("id", order.director_id);
      }
    }

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
        content: "🎉 Auftrag erfolgreich abgeschlossen! Vielen Dank für die Zusammenarbeit.",
        is_system_message: true,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "Fehler beim Abschließen");
  }
}
