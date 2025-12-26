import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/directors - Get all directors (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const badge = searchParams.get("badge");
    const search = searchParams.get("search");

    const where: any = {};

    if (badge) {
      where.badges = { has: badge };
    }

    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [directors, total] = await Promise.all([
      db.directorProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              music: true,
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.directorProfile.count({ where }),
    ]);

    return NextResponse.json({
      directors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ADMIN_DIRECTORS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/directors - Update director profile (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { directorId, badges, verified } = body;

    if (!directorId) {
      return NextResponse.json(
        { error: "Director ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (badges) {
      updateData.badges = badges;
    }

    if (typeof verified === "boolean") {
      updateData.isVerified = verified;
      // If verifying, ensure badge includes VERIFIED
      if (verified) {
        const currentProfile = await db.directorProfile.findUnique({
          where: { id: directorId },
          select: { badges: true }
        });
        if (currentProfile && !currentProfile.badges.includes("VERIFIED")) {
          updateData.badges = [...(currentProfile.badges || []), "VERIFIED"];
        }
      }
    }

    const director = await db.directorProfile.update({
      where: { id: directorId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(director);
  } catch (error) {
    console.error("[ADMIN_DIRECTORS_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
