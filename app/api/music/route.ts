import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedParams = querySchema.parse(params);

    const where: any = {
      status: "ACTIVE",
    };

    // Apply filters
    if (validatedParams.genre) {
      where.genre = validatedParams.genre;
    }
    if (validatedParams.mood) {
      where.mood = validatedParams.mood;
    }
    if (validatedParams.useCase) {
      where.useCase = validatedParams.useCase;
    }
    if (validatedParams.era) {
      where.era = validatedParams.era;
    }
    if (validatedParams.priceMin || validatedParams.priceMax) {
      where.price = {
        ...(validatedParams.priceMin && { gte: validatedParams.priceMin }),
        ...(validatedParams.priceMax && { lte: validatedParams.priceMax }),
      };
    }
    if (validatedParams.durationMin || validatedParams.durationMax) {
      where.duration = {
        ...(validatedParams.durationMin && { gte: validatedParams.durationMin }),
        ...(validatedParams.durationMax && { lte: validatedParams.durationMax }),
      };
    }
    if (validatedParams.search) {
      where.OR = [
        { title: { contains: validatedParams.search, mode: "insensitive" } },
        { description: { contains: validatedParams.search, mode: "insensitive" } },
        { genre: { contains: validatedParams.search, mode: "insensitive" } },
      ];
    }

    // Sort order
    let orderBy: any = { createdAt: "desc" };
    switch (validatedParams.sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "popular":
        orderBy = { playCount: "desc" };
        break;
    }

    // Pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;

    const [music, total] = await Promise.all([
      db.music.findMany({
        where,
        orderBy,
        skip,
        take: validatedParams.limit,
        include: {
          director: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
      db.music.count({ where }),
    ]);

    return NextResponse.json({
      data: music,
      total,
      page: validatedParams.page,
      limit: validatedParams.limit,
      totalPages: Math.ceil(total / validatedParams.limit),
    });
  } catch (error) {
    console.error("Error fetching music:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST - Create new track (Directors only)
export async function POST(req: NextRequest) {
  try {
    // TODO: Add auth check for director role
    const body = await req.json();

    const track = await db.music.create({
      data: {
        title: body.title,
        description: body.description,
        duration: body.duration,
        price: body.price,
        audioUrl: body.audioUrl,
        previewUrl: body.previewUrl,
        coverImage: body.coverImage,
        genre: body.genre,
        subgenre: body.subgenre,
        mood: body.mood,
        useCase: body.useCase,
        era: body.era,
        structure: body.structure,
        bpm: body.bpm,
        key: body.key,
        tags: body.tags || [],
        pricePersonal: body.pricePersonal,
        priceCommercial: body.priceCommercial,
        priceEnterprise: body.priceEnterprise,
        priceExclusive: body.priceExclusive,
        directorId: body.directorId,
      },
    });

    // Create approval record
    await db.musicApproval.create({
      data: {
        musicId: track.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error("Error creating track:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

