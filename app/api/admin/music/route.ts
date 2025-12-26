import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/music - Get all music tracks (admin only)
export async function GET(request: Request) {
  try {
    const user = await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tracks, total] = await Promise.all([
      db.music.findMany({
        where,
        include: {
          director: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          approval: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.music.count({ where }),
    ]);

    return NextResponse.json({
      tracks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ADMIN_MUSIC_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/music - Update music status (approve/reject)
export async function PATCH(request: Request) {
  try {
    const user = await requireAdmin();

    const body = await request.json();
    const { musicId, status, rejectionReason } = body;

    if (!musicId || !status) {
      return NextResponse.json(
        { error: "Music ID and status are required" },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "INACTIVE", "EXCLUSIVE_SOLD"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update music status
    const music = await db.music.update({
      where: { id: musicId },
      data: { status },
    });

    // Create or update approval record
    await db.musicApproval.upsert({
      where: { musicId },
      create: {
        musicId,
        reviewedBy: user.id,
        status: status === "ACTIVE" ? "APPROVED" : status === "INACTIVE" ? "REJECTED" : "PENDING",
        reviewNote: rejectionReason,
      },
      update: {
        reviewedBy: user.id,
        status: status === "ACTIVE" ? "APPROVED" : status === "INACTIVE" ? "REJECTED" : "PENDING",
        reviewNote: rejectionReason,
      },
    });

    return NextResponse.json(music);
  } catch (error) {
    console.error("[ADMIN_MUSIC_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
