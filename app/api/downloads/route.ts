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
    const transformedDownloads = (downloads || []).map((download: any) => {
      // Supabase gibt order und music als Array zurück, auch bei one-to-one Beziehungen
      const orderData = Array.isArray(download.order) ? download.order[0] : download.order;
      const musicData = Array.isArray(download.music) ? download.music[0] : download.music;
      
      return {
        id: download.id,
        licenseType: download.license_type,
        downloadUrl: download.download_url,
        downloadCount: download.download_count,
        expiresAt: download.expires_at,
        createdAt: download.created_at,
        music: musicData ? {
          id: musicData.id,
          title: musicData.title,
          duration: musicData.duration,
          audioUrl: musicData.audio_url,
          coverImage: musicData.cover_image,
          genre: musicData.genre,
          artist: musicData.director?.user?.name || "Unbekannt",
        } : null,
        order: orderData ? {
          id: orderData.id,
          orderNumber: orderData.order_number,
          title: orderData.title,
          musicUrl: orderData.final_music_url,
        } : null,
      };
    });

    return NextResponse.json(transformedDownloads);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Downloads");
  }
}
