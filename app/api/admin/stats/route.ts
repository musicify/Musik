import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";

// GET - Admin-Statistiken abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) {
      return authResult.error;
    }

    const supabase = await createClient();

    // Parallele Abfragen für Statistiken
    const [
      usersResult,
      directorsResult,
      ordersResult,
      pendingDirectorsResult,
      pendingMusicResult,
      disputesResult,
      invoicesResult,
    ] = await Promise.all([
      // Gesamtzahl User
      supabase.from("users").select("*", { count: "exact", head: true }),
      
      // Verifizierte Directors
      supabase
        .from("director_profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true),
      
      // Gesamtzahl Orders
      supabase.from("orders").select("*", { count: "exact", head: true }),
      
      // Ausstehende Director-Verifizierungen
      supabase
        .from("director_verifications")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING"),
      
      // Ausstehende Musik-Freigaben
      supabase
        .from("music_approvals")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING"),
      
      // Offene Disputes
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "DISPUTED"),
      
      // Gesamtumsatz
      supabase
        .from("invoices")
        .select("total")
        .eq("status", "COMPLETED"),
    ]);

    // Umsatz berechnen
    const totalRevenue = invoicesResult.data?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

    // Monatlicher Umsatz (letzte 30 Tage)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: monthlyInvoices } = await supabase
      .from("invoices")
      .select("total")
      .eq("status", "COMPLETED")
      .gte("created_at", thirtyDaysAgo.toISOString());

    const monthlyRevenue = monthlyInvoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

    return NextResponse.json({
      totalUsers: usersResult.count || 0,
      totalDirectors: directorsResult.count || 0,
      totalOrders: ordersResult.count || 0,
      totalRevenue,
      monthlyRevenue,
      pendingVerifications: pendingDirectorsResult.count || 0,
      pendingMusicApprovals: pendingMusicResult.count || 0,
      openDisputes: disputesResult.count || 0,
    });
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Statistiken");
  }
}
