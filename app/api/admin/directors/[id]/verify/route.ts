import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const verifySchema = z.object({
  approved: z.boolean(),
  reviewNote: z.string().optional(),
});

// POST - Verify or reject director (Admin only)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: directorId } = await params;
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
    const { approved, reviewNote } = verifySchema.parse(body);

    // Update verification record
    const verification = await db.directorVerification.update({
      where: { directorId },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        reviewedBy: userId,
        reviewNote,
      },
    });

    // Update director profile
    await db.directorProfile.update({
      where: { id: directorId },
      data: {
        isVerified: approved,
        badges: approved ? { push: "VERIFIED" } : undefined,
      },
    });

    // TODO: Send email notification to director

    return NextResponse.json(verification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error verifying director:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

