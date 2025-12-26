import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get director profile by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const director = await db.directorProfile.findUnique({
      where: { id },
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
        { error: "Regisseur nicht gefunden" },
        { status: 404 }
      );
    }

    // Get director's public music
    const music = await db.music.findMany({
      where: {
        directorId: id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Calculate stats
    const completedOrders = await db.order.count({
      where: {
        directorId: id,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({
      ...director,
      music,
      stats: {
        completedOrders,
        totalTracks: music.length,
      },
    });
  } catch (error) {
    console.error("Error fetching director:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

