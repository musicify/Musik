import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const approveSchema = z.object({
  approved: z.boolean(),
  reviewNote: z.string().optional(),
});

// POST - Approve or reject music (Admin only)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: musicId } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { approved, reviewNote } = approveSchema.parse(body);

    // Update approval record
    const approval = await db.musicApproval.update({
      where: { musicId },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        reviewedBy: userId,
        reviewNote,
      },
    });

    // Update music status
    await db.music.update({
      where: { id: musicId },
      data: {
        status: approved ? "ACTIVE" : "INACTIVE",
      },
    });

    // TODO: Send email notification to director

    return NextResponse.json(approval);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error approving music:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

