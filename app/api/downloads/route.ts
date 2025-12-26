import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";

// GET - Downloads des Users abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const supabase = await createClient();

    const { data: downloads, error } = await supabase
      .from("downloads")
      .select(`
        id,
        license_type,
        download_url,
        download_count,
        expires_at,
        created_at,
        music:music_id (
          id,
          title,
          duration,
          audio_url,
          cover_image,
          genre,
          director:director_profiles (
            id,
            user:users (
              name
            )
          )
        ),
        order:order_id (
          id,
          order_number,
          title,
          final_music_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Downloads Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Downloads" },
        { status: 500 }
      );
    }

    // Transformiere Daten
    const transformedDownloads = (downloads || []).map((download: any) => ({
      id: download.id,
      licenseType: download.license_type,
      downloadUrl: download.download_url,
      downloadCount: download.download_count,
      expiresAt: download.expires_at,
      createdAt: download.created_at,
      music: download.music ? {
        id: download.music.id,
        title: download.music.title,
        duration: download.music.duration,
        audioUrl: download.music.audio_url,
        coverImage: download.music.cover_image,
        genre: download.music.genre,
        artist: download.music.director?.user?.name || "Unbekannt",
      } : null,
      order: download.order ? {
        id: download.order.id,
        orderNumber: download.order.order_number,
        title: download.order.title,
        musicUrl: download.order.final_music_url,
      } : null,
    }));

    return NextResponse.json(transformedDownloads);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Downloads");
  }
}
