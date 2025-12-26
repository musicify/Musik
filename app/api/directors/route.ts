import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const querySchema = z.object({
  specialization: z.string().optional(),
  verified: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["rating", "projects", "responseTime", "newest"]).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

// GET - Liste aller verifizierten Directors (öffentlich)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedParams = querySchema.parse(params);

    const supabase = createAdminClient();

    let query = supabase
      .from("director_profiles")
      .select(`
        id,
        bio,
        specialization,
        price_range_min,
        price_range_max,
        badges,
        is_verified,
        portfolio_tracks,
        website,
        social_links,
        experience,
        languages,
        avg_response_time,
        completion_rate,
        total_projects,
        rating,
        review_count,
        created_at,
        user:users (
          id,
          name,
          image,
          email
        )
      `, { count: "exact" })
      .eq("is_active", true);

    // Nur verifizierte Directors zeigen (wenn nicht explizit anders)
    if (validatedParams.verified !== "false") {
      query = query.eq("is_verified", true);
    }

    // Filter
    if (validatedParams.specialization) {
      query = query.contains("specialization", [validatedParams.specialization]);
    }

    if (validatedParams.search) {
      query = query.or(`bio.ilike.%${validatedParams.search}%,user.name.ilike.%${validatedParams.search}%`);
    }

    // Sortierung
    switch (validatedParams.sortBy) {
      case "rating":
        query = query.order("rating", { ascending: false, nullsFirst: false });
        break;
      case "projects":
        query = query.order("total_projects", { ascending: false });
        break;
      case "responseTime":
        query = query.order("avg_response_time", { ascending: true, nullsFirst: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
    }

    // Pagination
    const offset = (validatedParams.page - 1) * validatedParams.limit;
    query = query.range(offset, offset + validatedParams.limit - 1);

    const { data: directors, error, count } = await query;

    if (error) {
      console.error("Directors Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Komponisten" },
        { status: 500 }
      );
    }

    // Transformiere Daten
    const transformedDirectors = (directors || []).map((director: any) => ({
      id: director.id,
      bio: director.bio,
      specialization: director.specialization || [],
      priceRangeMin: director.price_range_min,
      priceRangeMax: director.price_range_max,
      badges: director.badges || [],
      isVerified: director.is_verified,
      portfolioTracks: director.portfolio_tracks || [],
      website: director.website,
      socialLinks: director.social_links || [],
      experience: director.experience,
      languages: director.languages || [],
      avgResponseTime: director.avg_response_time,
      completionRate: director.completion_rate,
      totalProjects: director.total_projects,
      rating: director.rating,
      reviewCount: director.review_count,
      createdAt: director.created_at,
      user: director.user ? {
        id: director.user.id,
        name: director.user.name,
        image: director.user.image,
        email: director.user.email,
      } : null,
    }));

    return NextResponse.json({
      data: transformedDirectors,
      total: count || 0,
      page: validatedParams.page,
      limit: validatedParams.limit,
      totalPages: Math.ceil((count || 0) / validatedParams.limit),
    });
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Komponisten");
  }
}
