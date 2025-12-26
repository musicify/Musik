import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const verifySchema = z.object({
  approved: z.boolean(),
  note: z.string().optional(),
  badges: z.array(z.enum(["VERIFIED", "TOP_SELLER", "PREMIUM"])).optional(),
});

// POST - Director verifizieren/ablehnen
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
    const validatedData = verifySchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Director-Profil existiert
    const { data: directorProfile, error: findError } = await supabase
      .from("director_profiles")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (findError || !directorProfile) {
      return NextResponse.json(
        { error: "Director nicht gefunden" },
        { status: 404 }
      );
    }

    // Verification-Status aktualisieren
    await supabase
      .from("director_verifications")
      .upsert({
        director_id: id,
        status: validatedData.approved ? "APPROVED" : "REJECTED",
        reviewed_by: user.id,
        review_note: validatedData.note,
        updated_at: new Date().toISOString(),
      });

    // Director-Profil aktualisieren
    const updateData: any = {
      is_verified: validatedData.approved,
    };

    if (validatedData.approved && validatedData.badges) {
      updateData.badges = validatedData.badges;
    } else if (validatedData.approved) {
      updateData.badges = ["VERIFIED"];
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("director_profiles")
      .update(updateData)
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
      message: validatedData.approved ? "Director verifiziert" : "Verifizierung abgelehnt",
      profile: updatedProfile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler bei der Verifizierung");
  }
}
