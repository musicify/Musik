import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, handleApiError } from "@/lib/api/auth-helper";

// GET - Alle offenen Disputes abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) {
      return authResult.error;
    }

    const supabase = await createClient();

    const { data: disputes, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        title,
        description,
        status,
        offered_price,
        created_at,
        updated_at,
        customer:users!orders_customer_id_fkey (
          id,
          name,
          email
        ),
        director:director_profiles (
          id,
          user:users (
            name,
            email
          )
        ),
        history:order_history (
          id,
          status,
          message,
          created_at
        )
      `)
      .eq("status", "DISPUTED")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Disputes Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden" },
        { status: 500 }
      );
    }

    return NextResponse.json(disputes || []);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Disputes");
  }
}
