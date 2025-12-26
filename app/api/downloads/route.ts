import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/downloads - Get all downloads for the current user
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const downloads = await db.download.findMany({
      where: {
        userId: user.id,
      },
      include: {
        music: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            audioUrl: true,
            director: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(downloads);
  } catch (error) {
    console.error("[DOWNLOADS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/downloads - Create a download record and get download URL
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { musicId, orderId, licenseType } = body;

    if (!musicId && !orderId) {
      return NextResponse.json(
        { error: "Music ID or Order ID is required" },
        { status: 400 }
      );
    }

    let downloadUrl = "";

    // Verify user has access to download
    if (orderId) {
      const order = await db.order.findFirst({
        where: {
          id: orderId,
          customerId: user.id,
          status: "COMPLETED",
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: "Order not found or not completed" },
          { status: 404 }
        );
      }
      
      downloadUrl = order.finalMusicUrl || "";
    }

    if (musicId) {
      const music = await db.music.findUnique({
        where: { id: musicId },
      });

      if (!music) {
        return NextResponse.json(
          { error: "Music not found" },
          { status: 404 }
        );
      }
      
      downloadUrl = music.audioUrl;
    }

    // Create download record
    const download = await db.download.create({
      data: {
        userId: user.id,
        musicId,
        orderId,
        licenseType: licenseType || "PERSONAL",
        downloadUrl,
      },
      include: {
        music: {
          select: {
            id: true,
            title: true,
            audioUrl: true,
          },
        },
        order: {
          select: {
            id: true,
            title: true,
            finalMusicUrl: true,
          },
        },
      },
    });

    // In production, generate a presigned URL for secure downloads
    // const presignedUrl = await generatePresignedUrl(downloadUrl);

    return NextResponse.json({
      download,
      url: downloadUrl,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    });
  } catch (error) {
    console.error("[DOWNLOADS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
