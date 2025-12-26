import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const querySchema = z.object({
  specialization: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  verified: z.coerce.boolean().optional(),
  badge: z.enum(["VERIFIED", "TOP_SELLER", "PREMIUM"]).optional(),
  sortBy: z.enum(["rating", "projects", "price_asc", "price_desc", "newest"]).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

// GET - Get all directors (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedParams = querySchema.parse(params);

    const where: any = {
      isVerified: true,
      isActive: true,
    };

    // Apply filters
    if (validatedParams.specialization) {
      where.specialization = {
        has: validatedParams.specialization,
      };
    }
    if (validatedParams.priceMin || validatedParams.priceMax) {
      where.priceRangeMin = {
        ...(validatedParams.priceMin && { gte: validatedParams.priceMin }),
      };
      where.priceRangeMax = {
        ...(validatedParams.priceMax && { lte: validatedParams.priceMax }),
      };
    }
    if (validatedParams.badge) {
      where.badges = {
        has: validatedParams.badge,
      };
    }

    // Sort order
    let orderBy: any = { rating: "desc" };
    switch (validatedParams.sortBy) {
      case "projects":
        orderBy = { totalProjects: "desc" };
        break;
      case "price_asc":
        orderBy = { priceRangeMin: "asc" };
        break;
      case "price_desc":
        orderBy = { priceRangeMin: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
    }

    // Pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;

    const [directors, total] = await Promise.all([
      db.directorProfile.findMany({
        where,
        orderBy,
        skip,
        take: validatedParams.limit,
        include: {
          user: {
            select: {
              name: true,
              image: true,
              email: true,
            },
          },
        },
      }),
      db.directorProfile.count({ where }),
    ]);

    return NextResponse.json({
      data: directors,
      total,
      page: validatedParams.page,
      limit: validatedParams.limit,
      totalPages: Math.ceil(total / validatedParams.limit),
    });
  } catch (error) {
    console.error("Error fetching directors:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

