import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";

// GET - Ausstehende Director-Verifizierungen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) {
      return authResult.error;
    }

    const supabase = await createClient();

    const { data: pendingVerifications, error } = await supabase
      .from("director_verifications")
      .select(`
        id,
        status,
        portfolio_review,
        review_note,
        created_at,
        director:director_profiles (
          id,
          bio,
          specialization,
          portfolio_tracks,
          experience,
          user:users (
            id,
            name,
            email,
            image
          )
        )
      `)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Pending Directors Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden" },
        { status: 500 }
      );
    }

    return NextResponse.json(pendingVerifications || []);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der ausstehenden Verifizierungen");
  }
}
