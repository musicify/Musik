import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const querySchema = z.object({
  role: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

// GET - Alle User abrufen (Admin)
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedParams = querySchema.parse(params);

    const supabase = await createClient();

    let query = supabase
      .from("users")
      .select(`
        id,
        clerk_id,
        email,
        name,
        image,
        role,
        email_verified,
        created_at,
        director_profile:director_profiles (
          id,
          is_verified,
          badges,
          total_projects
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false });

    // Filter
    if (validatedParams.role) {
      query = query.eq("role", validatedParams.role);
    }

    if (validatedParams.search) {
      query = query.or(`email.ilike.%${validatedParams.search}%,name.ilike.%${validatedParams.search}%`);
    }

    // Pagination
    const offset = (validatedParams.page - 1) * validatedParams.limit;
    query = query.range(offset, offset + validatedParams.limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error("Users Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der User" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: users || [],
      total: count || 0,
      page: validatedParams.page,
      limit: validatedParams.limit,
      totalPages: Math.ceil((count || 0) / validatedParams.limit),
    });
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der User");
  }
}
