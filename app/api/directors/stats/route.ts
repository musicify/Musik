import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireDirector, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";

// GET - Director-Statistiken abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireDirector();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const supabase = await createClient();

    // Director-Profil holen
    const directorProfile = await getDirectorProfile(user.id);
    if (!directorProfile) {
      return NextResponse.json(
        { error: "Director-Profil nicht gefunden" },
        { status: 404 }
      );
    }

    // Statistiken berechnen
    
    // Tracks zählen
    const { count: totalTracks } = await supabase
      .from("music")
      .select("*", { count: "exact", head: true })
      .eq("director_id", directorProfile.id);

    // Track-Verkäufe (Downloads) zählen
    const { data: musicIds } = await supabase
      .from("music")
      .select("id")
      .eq("director_id", directorProfile.id);

    let trackSales = 0;
    if (musicIds && musicIds.length > 0) {
      const { count } = await supabase
        .from("downloads")
        .select("*", { count: "exact", head: true })
        .in("music_id", musicIds.map(m => m.id));
      trackSales = count || 0;
    }

    // Aufträge zählen
    const { data: orders } = await supabase
      .from("orders")
      .select("status, offered_price")
      .eq("director_id", directorProfile.id);

    const totalOrders = orders?.length || 0;
    const activeOrders = orders?.filter(o => 
      !["COMPLETED", "CANCELLED"].includes(o.status)
    ).length || 0;
    const completedOrders = orders?.filter(o => o.status === "COMPLETED").length || 0;

    // Monatliche Einnahmen berechnen (letzten 30 Tage)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentOrders } = await supabase
      .from("orders")
      .select("offered_price, updated_at")
      .eq("director_id", directorProfile.id)
      .eq("status", "COMPLETED")
      .gte("updated_at", thirtyDaysAgo.toISOString());

    const monthlyEarnings = recentOrders?.reduce((sum, o) => sum + (o.offered_price || 0), 0) || 0;

    return NextResponse.json({
      totalEarnings: directorProfile.total_earnings || 0,
      monthlyEarnings,
      totalOrders,
      activeOrders,
      completedOrders,
      avgRating: directorProfile.rating || 0,
      totalTracks: totalTracks || 0,
      trackSales,
      avgResponseTime: directorProfile.avg_response_time,
      completionRate: directorProfile.completion_rate,
    });
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Statistiken");
  }
}
