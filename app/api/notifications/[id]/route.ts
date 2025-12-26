import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";

// PUT - Benachrichtigung als gelesen markieren
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;
    const body = await req.json();
    const { isRead } = body;

    const supabase = await createClient();

    // Prüfe ob Benachrichtigung dem User gehört
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !notification) {
      return NextResponse.json(
        { error: "Benachrichtigung nicht gefunden" },
        { status: 404 }
      );
    }

    // Update
    const updateData: any = {};
    if (isRead !== undefined) {
      updateData.is_read = isRead;
      if (isRead) {
        updateData.read_at = new Date().toISOString();
      } else {
        updateData.read_at = null;
      }
    }

    const { data: updatedNotification, error: updateError } = await supabase
      .from("notifications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Update Notification Error:", updateError);
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren der Benachrichtigung" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedNotification);
  } catch (error) {
    return handleApiError(error, "Fehler beim Aktualisieren der Benachrichtigung");
  }
}

// DELETE - Benachrichtigung löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;

    const supabase = await createClient();

    // Prüfe ob Benachrichtigung dem User gehört
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !notification) {
      return NextResponse.json(
        { error: "Benachrichtigung nicht gefunden" },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete Notification Error:", deleteError);
      return NextResponse.json(
        { error: "Fehler beim Löschen der Benachrichtigung" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Fehler beim Löschen der Benachrichtigung");
  }
}

