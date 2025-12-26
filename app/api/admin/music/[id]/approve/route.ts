import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const approveSchema = z.object({
  approved: z.boolean(),
  note: z.string().optional(),
});

// POST - Musik freigeben/ablehnen
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;
    const body = await req.json();
    const validatedData = approveSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Musik existiert
    const { data: music, error: findError } = await supabase
      .from("music")
      .select("id, title, director_id")
      .eq("id", id)
      .single();

    if (findError || !music) {
      return NextResponse.json(
        { error: "Musik nicht gefunden" },
        { status: 404 }
      );
    }

    // Approval-Status aktualisieren
    await supabase
      .from("music_approvals")
      .upsert({
        music_id: id,
        status: validatedData.approved ? "APPROVED" : "REJECTED",
        reviewed_by: user.id,
        review_note: validatedData.note,
        updated_at: new Date().toISOString(),
      });

    // Musik-Status aktualisieren
    const { data: updatedMusic, error: updateError } = await supabase
      .from("music")
      .update({
        status: validatedData.approved ? "ACTIVE" : "INACTIVE",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren" },
        { status: 500 }
      );
    }

    // TODO: E-Mail an Director senden

    return NextResponse.json({
      message: validatedData.approved ? "Musik freigegeben" : "Musik abgelehnt",
      music: updatedMusic,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler bei der Freigabe");
  }
}
