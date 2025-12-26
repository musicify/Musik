import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";

// GET - Ausstehende Musik-Freigaben
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) {
      return authResult.error;
    }

    const supabase = await createClient();

    const { data: pendingMusic, error } = await supabase
      .from("music_approvals")
      .select(`
        id,
        status,
        review_note,
        created_at,
        music:music (
          id,
          title,
          description,
          duration,
          price,
          audio_url,
          preview_url,
          cover_image,
          genre,
          mood,
          created_at,
          director:director_profiles (
            id,
            badges,
            user:users (
              name,
              email,
              image
            )
          )
        )
      `)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Pending Music Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden" },
        { status: 500 }
      );
    }

    return NextResponse.json(pendingMusic || []);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der ausstehenden Musik");
  }
}
