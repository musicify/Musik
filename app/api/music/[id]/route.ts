import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get single track by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const track = await db.music.findUnique({
      where: { id },
      include: {
        director: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        approval: true,
      },
    });

    if (!track) {
      return NextResponse.json(
        { error: "Track nicht gefunden" },
        { status: 404 }
      );
    }

    // Increment play count
    await db.music.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error("Error fetching track:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

const updateTrackSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  genre: z.string().optional(),
  subgenre: z.string().optional(),
  mood: z.string().optional(),
  useCase: z.string().optional(),
  era: z.string().optional(),
  structure: z.string().optional(),
  tags: z.array(z.string()).optional(),
  pricePersonal: z.number().positive().optional(),
  priceCommercial: z.number().positive().optional(),
  priceEnterprise: z.number().positive().optional(),
  priceExclusive: z.number().positive().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

// PUT - Update track (Director only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Verify user is the director who owns this track
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updateTrackSchema.parse(body);

    // Check if track exists and user owns it
    const existingTrack = await db.music.findUnique({
      where: { id },
      include: {
        director: true,
      },
    });

    if (!existingTrack) {
      return NextResponse.json(
        { error: "Track nicht gefunden" },
        { status: 404 }
      );
    }

    if (existingTrack.director?.userId !== userId) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const updatedTrack = await db.music.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedTrack);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating track:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// DELETE - Delete track (Director only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    // Check if track exists and user owns it
    const existingTrack = await db.music.findUnique({
      where: { id },
      include: {
        director: true,
      },
    });

    if (!existingTrack) {
      return NextResponse.json(
        { error: "Track nicht gefunden" },
        { status: 404 }
      );
    }

    if (existingTrack.director?.userId !== userId) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Soft delete by setting status to INACTIVE
    await db.music.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting track:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

