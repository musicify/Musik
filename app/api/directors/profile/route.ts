import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get own director profile
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const director = await db.directorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        verification: true,
      },
    });

    if (!director) {
      return NextResponse.json(
        { error: "Kein Regisseur-Profil gefunden" },
        { status: 404 }
      );
    }

    // Get recent orders
    const recentOrders = await db.order.findMany({
      where: { directorId: director.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Get music
    const music = await db.music.findMany({
      where: { directorId: director.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ...director,
      recentOrders,
      music,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

const updateProfileSchema = z.object({
  bio: z.string().optional(),
  specialization: z.array(z.string()).optional(),
  priceRangeMin: z.number().positive().optional(),
  priceRangeMax: z.number().positive().optional(),
  website: z.string().url().optional().nullable(),
  socialLinks: z.array(z.string()).optional(),
  experience: z.string().optional(),
  equipment: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

// PUT - Update own director profile
export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    const director = await db.directorProfile.findUnique({
      where: { userId },
    });

    if (!director) {
      return NextResponse.json(
        { error: "Kein Regisseur-Profil gefunden" },
        { status: 404 }
      );
    }

    const updatedDirector = await db.directorProfile.update({
      where: { userId },
      data: validatedData,
    });

    return NextResponse.json(updatedDirector);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

