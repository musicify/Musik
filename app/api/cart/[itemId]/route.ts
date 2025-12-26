import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const updateSchema = z.object({
  licenseType: z.enum(["PERSONAL", "COMMERCIAL", "ENTERPRISE", "EXCLUSIVE"]),
});

// PUT - Lizenztyp aktualisieren
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { itemId } = await params;
    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    const supabase = await createClient();

    // Prüfe ob Item dem User gehört
    const { data: existingItem, error: findError } = await supabase
      .from("cart_items")
      .select("id, music_id")
      .eq("id", itemId)
      .eq("user_id", user.id)
      .single();

    if (findError || !existingItem) {
      return NextResponse.json(
        { error: "Artikel nicht gefunden" },
        { status: 404 }
      );
    }

    // Prüfe ob Exclusive bereits vergeben
    if (validatedData.licenseType === "EXCLUSIVE" && existingItem.music_id) {
      const { data: purchases } = await supabase
        .from("downloads")
        .select("id")
        .eq("music_id", existingItem.music_id)
        .eq("license_type", "EXCLUSIVE");

      if (purchases && purchases.length > 0) {
        return NextResponse.json(
          { error: "Diese Musik wurde bereits exklusiv verkauft" },
          { status: 400 }
        );
      }
    }

    // Update
    const { data: updated, error: updateError } = await supabase
      .from("cart_items")
      .update({ license_type: validatedData.licenseType })
      .eq("id", itemId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren" },
        { status: 500 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Aktualisieren");
  }
}

// DELETE - Einzelnen Artikel entfernen
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { itemId } = await params;
    const supabase = await createClient();

    // Prüfe ob Item dem User gehört
    const { data: existingItem, error: findError } = await supabase
      .from("cart_items")
      .select("id")
      .eq("id", itemId)
      .eq("user_id", user.id)
      .single();

    if (findError || !existingItem) {
      return NextResponse.json(
        { error: "Artikel nicht gefunden" },
        { status: 404 }
      );
    }

    // Löschen
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Fehler beim Entfernen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Artikel entfernt" });
  } catch (error) {
    return handleApiError(error, "Fehler beim Entfernen");
  }
}

