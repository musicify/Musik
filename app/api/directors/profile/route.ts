import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireDirector, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";
import { z } from "zod";

const updateProfileSchema = z.object({
  bio: z.string().max(2000).optional(),
  specialization: z.array(z.string()).optional(),
  priceRangeMin: z.number().min(0).optional(),
  priceRangeMax: z.number().min(0).optional(),
  website: z.string().url().optional().nullable(),
  socialLinks: z.array(z.string().url()).optional(),
  experience: z.string().max(2000).optional(),
  equipment: z.string().max(1000).optional(),
  languages: z.array(z.string()).optional(),
  portfolioTracks: z.array(z.string().url()).optional(),
});

// GET - Eigenes Director-Profil abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireDirector();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("director_profiles")
      .select(`
        *,
        user:users (
          id,
          name,
          email,
          image
        )
      `)
      .eq("user_id", user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: "Profil nicht gefunden" },
        { status: 404 }
      );
    }

    // Transformiere Daten
    const transformedProfile = {
      id: profile.id,
      userId: profile.user_id,
      bio: profile.bio,
      specialization: profile.specialization || [],
      priceRangeMin: profile.price_range_min,
      priceRangeMax: profile.price_range_max,
      badges: profile.badges || [],
      isVerified: profile.is_verified,
      isActive: profile.is_active,
      portfolioTracks: profile.portfolio_tracks || [],
      website: profile.website,
      socialLinks: profile.social_links || [],
      experience: profile.experience,
      equipment: profile.equipment,
      languages: profile.languages || [],
      avgResponseTime: profile.avg_response_time,
      completionRate: profile.completion_rate,
      avgDeliveryTime: profile.avg_delivery_time,
      revisionRate: profile.revision_rate,
      totalProjects: profile.total_projects,
      totalEarnings: profile.total_earnings,
      rating: profile.rating,
      reviewCount: profile.review_count,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      user: profile.user,
    };

    return NextResponse.json(transformedProfile);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden des Profils");
  }
}

// PUT - Director-Profil aktualisieren
export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireDirector();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Profil existiert
    const existingProfile = await getDirectorProfile(user.id);
    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profil nicht gefunden" },
        { status: 404 }
      );
    }

    // Update-Daten vorbereiten (snake_case für Supabase)
    const updateData: Record<string, any> = {};
    
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.specialization !== undefined) updateData.specialization = validatedData.specialization;
    if (validatedData.priceRangeMin !== undefined) updateData.price_range_min = validatedData.priceRangeMin;
    if (validatedData.priceRangeMax !== undefined) updateData.price_range_max = validatedData.priceRangeMax;
    if (validatedData.website !== undefined) updateData.website = validatedData.website;
    if (validatedData.socialLinks !== undefined) updateData.social_links = validatedData.socialLinks;
    if (validatedData.experience !== undefined) updateData.experience = validatedData.experience;
    if (validatedData.equipment !== undefined) updateData.equipment = validatedData.equipment;
    if (validatedData.languages !== undefined) updateData.languages = validatedData.languages;
    if (validatedData.portfolioTracks !== undefined) updateData.portfolio_tracks = validatedData.portfolioTracks;

    const { data: profile, error } = await supabase
      .from("director_profiles")
      .update(updateData)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Update Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren des Profils" },
        { status: 500 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Aktualisieren des Profils");
  }
}
