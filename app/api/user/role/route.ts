import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    if (!role || !["CUSTOMER", "DIRECTOR"].includes(role)) {
      return NextResponse.json(
        { error: "Ungültige Rolle. Muss CUSTOMER oder DIRECTOR sein." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Aktualisiere die Rolle des Benutzers
    const { data, error } = await supabase
      .from("users")
      .update({ role: role as UserRole })
      .eq("clerk_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Fehler beim Aktualisieren der Rolle:", error);
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren der Rolle" },
        { status: 500 }
      );
    }

    // Wenn die Rolle DIRECTOR ist, erstelle ein Director-Profil falls noch nicht vorhanden
    if (role === "DIRECTOR") {
      const { error: profileError } = await supabase.rpc(
        "create_director_profile",
        {
          p_user_id: data.id,
        }
      );

      if (profileError && profileError.code !== "P0001") {
        // P0001 = unique_violation, bedeutet Profil existiert bereits
        console.error("Fehler beim Erstellen des Director-Profils:", profileError);
      }
    }

    // Wenn die Rolle CUSTOMER ist, erstelle ein Customer-Profil falls noch nicht vorhanden
    if (role === "CUSTOMER") {
      const { error: profileError } = await supabase.rpc(
        "create_customer_profile",
        {
          p_user_id: data.id,
        }
      );

      if (profileError && profileError.code !== "P0001") {
        console.error("Fehler beim Erstellen des Customer-Profils:", profileError);
      }
    }

    return NextResponse.json({
      success: true,
      role: data.role,
      message: "Rolle erfolgreich aktualisiert",
    });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

