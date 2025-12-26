import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireDirector, handleApiError, getAuthenticatedUser } from "@/lib/api/auth-helper";
import { z } from "zod";

const querySchema = z.object({
  genre: z.string().optional(),
  mood: z.string().optional(),
  useCase: z.string().optional(),
  era: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  durationMin: z.coerce.number().optional(),
  durationMax: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["newest", "oldest", "price_asc", "price_desc", "popular"]).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const createMusicSchema = z.object({
  title: z.string().min(2, "Titel muss mindestens 2 Zeichen haben"),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen haben"),
  duration: z.number().min(1),
  price: z.number().min(0),
  audioUrl: z.string().url("Ungültige Audio-URL"),
  previewUrl: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  genre: z.string(),
  subgenre: z.string().optional(),
  mood: z.string().optional(),
  useCase: z.string().optional(),
  era: z.string().optional(),
  structure: z.string().optional(),
  bpm: z.number().optional(),
  key: z.string().optional(),
  tags: z.array(z.string()).optional(),
  pricePersonal: z.number().optional(),
  priceCommercial: z.number().optional(),
  priceEnterprise: z.number().optional(),
  priceExclusive: z.number().optional(),
});

// GET - Liste aller Tracks mit Filtern (öffentlich)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedParams = querySchema.parse(params);

    const supabase = createAdminClient();

    // Basis-Query für aktive Musik
    let query = supabase
      .from("music")
      .select(`
        *,
        director:director_profiles (
          id,
          badges,
          user:users (
            name,
            image
          )
        )
      `, { count: "exact" })
      .eq("status", "ACTIVE");

    // Filter anwenden
    if (validatedParams.genre) {
      query = query.eq("genre", validatedParams.genre);
    }
    if (validatedParams.mood) {
      query = query.eq("mood", validatedParams.mood);
    }
    if (validatedParams.useCase) {
      query = query.eq("use_case", validatedParams.useCase);
    }
    if (validatedParams.era) {
      query = query.eq("era", validatedParams.era);
    }
    if (validatedParams.priceMin) {
      query = query.gte("price", validatedParams.priceMin);
    }
    if (validatedParams.priceMax) {
      query = query.lte("price", validatedParams.priceMax);
    }
    if (validatedParams.durationMin) {
      query = query.gte("duration", validatedParams.durationMin);
    }
    if (validatedParams.durationMax) {
      query = query.lte("duration", validatedParams.durationMax);
    }
    if (validatedParams.search) {
      query = query.or(`title.ilike.%${validatedParams.search}%,description.ilike.%${validatedParams.search}%,genre.ilike.%${validatedParams.search}%`);
    }

    // Sortierung
    switch (validatedParams.sortBy) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "popular":
        query = query.order("play_count", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
    }

    // Pagination
    const offset = (validatedParams.page - 1) * validatedParams.limit;
    query = query.range(offset, offset + validatedParams.limit - 1);

    const { data: music, error, count } = await query;

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Musik" },
        { status: 500 }
      );
    }

    // Transformiere Daten für Frontend
    const transformedMusic = (music || []).map((track: any) => ({
      id: track.id,
      title: track.title,
      description: track.description,
      duration: track.duration,
      bpm: track.bpm,
      key: track.key,
      price: track.price,
      audioUrl: track.audio_url,
      previewUrl: track.preview_url,
      coverImage: track.cover_image,
      genre: track.genre,
      subgenre: track.subgenre,
      mood: track.mood,
      useCase: track.use_case,
      era: track.era,
      structure: track.structure,
      tags: track.tags || [],
      pricePersonal: track.price_personal,
      priceCommercial: track.price_commercial,
      priceEnterprise: track.price_enterprise,
      priceExclusive: track.price_exclusive,
      playCount: track.play_count,
      purchaseCount: track.purchase_count,
      status: track.status,
      createdAt: track.created_at,
      director: track.director ? {
        id: track.director.id,
        badges: track.director.badges || [],
        user: track.director.user,
      } : null,
    }));

    return NextResponse.json({
      data: transformedMusic,
      total: count || 0,
      page: validatedParams.page,
      limit: validatedParams.limit,
      totalPages: Math.ceil((count || 0) / validatedParams.limit),
    });
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Musik");
  }
}

// POST - Neuen Track erstellen (nur für Directors)
export async function POST(req: NextRequest) {
  try {
    // Auth-Check für Director
    const authResult = await requireDirector();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const body = await req.json();
    const validatedData = createMusicSchema.parse(body);

    const supabase = await createClient();

    // Director-Profil holen
    const { data: directorProfile, error: profileError } = await supabase
      .from("director_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !directorProfile) {
      return NextResponse.json(
        { error: "Director-Profil nicht gefunden" },
        { status: 404 }
      );
    }

    // Track erstellen
    const { data: track, error: createError } = await supabase
      .from("music")
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        price: validatedData.price,
        audio_url: validatedData.audioUrl,
        preview_url: validatedData.previewUrl,
        cover_image: validatedData.coverImage,
        genre: validatedData.genre,
        subgenre: validatedData.subgenre,
        mood: validatedData.mood,
        use_case: validatedData.useCase,
        era: validatedData.era,
        structure: validatedData.structure,
        bpm: validatedData.bpm,
        key: validatedData.key,
        tags: validatedData.tags || [],
        price_personal: validatedData.pricePersonal,
        price_commercial: validatedData.priceCommercial,
        price_enterprise: validatedData.priceEnterprise,
        price_exclusive: validatedData.priceExclusive,
        director_id: directorProfile.id,
        status: "INACTIVE", // Wartet auf Admin-Freigabe
      })
      .select()
      .single();

    if (createError) {
      console.error("Create Error:", createError);
      return NextResponse.json(
        { error: "Fehler beim Erstellen des Tracks" },
        { status: 500 }
      );
    }

    // Approval-Eintrag erstellen
    await supabase.from("music_approvals").insert({
      music_id: track.id,
      status: "PENDING",
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Erstellen des Tracks");
  }
}
