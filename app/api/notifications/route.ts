import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";

// GET - Benachrichtigungen abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = await createClient();

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error("Notifications Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Benachrichtigungen" },
        { status: 500 }
      );
    }

    return NextResponse.json(notifications || []);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Benachrichtigungen");
  }
}

// POST - Benachrichtigung erstellen (nur für Service/Admin)
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    // Nur Admins können Benachrichtigungen manuell erstellen
    if (authResult.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, type, title, message, link, metadata } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "userId, type, title und message sind erforderlich" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        link,
        metadata: metadata || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Create Notification Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Erstellen der Benachrichtigung" },
        { status: 500 }
      );
    }

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Fehler beim Erstellen der Benachrichtigung");
  }
}

