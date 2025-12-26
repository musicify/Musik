import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";

const addToCartSchema = z.object({
  musicId: z.string().optional(),
  orderId: z.string().optional(),
  licenseType: z.enum(["PERSONAL", "COMMERCIAL", "ENTERPRISE", "EXCLUSIVE"]),
});

// Preismultiplikatoren für Lizenztypen
const LICENSE_MULTIPLIERS = {
  PERSONAL: 0.6,
  COMMERCIAL: 1,
  ENTERPRISE: 2.5,
  EXCLUSIVE: 10,
};

// GET - Warenkorb abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const supabase = await createClient();

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        license_type,
        created_at,
        music:music_id (
          id,
          title,
          description,
          duration,
          price,
          audio_url,
          preview_url,
          cover_image,
          genre,
          mood,
          price_personal,
          price_commercial,
          price_enterprise,
          price_exclusive,
          director:director_profiles (
            id,
            badges,
            user:users (
              name,
              image
            )
          )
        ),
        order:order_id (
          id,
          order_number,
          title,
          offered_price,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Cart Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden des Warenkorbs" },
        { status: 500 }
      );
    }

    // Preise berechnen
    const itemsWithPrices = (cartItems || []).map((item: any) => {
      let calculatedPrice = 0;

      // Supabase gibt order als Array zurück, auch bei one-to-one Beziehungen
      const orderData = Array.isArray(item.order) ? item.order[0] : item.order;
      // Supabase gibt music als Array zurück, auch bei one-to-one Beziehungen
      const musicData = Array.isArray(item.music) ? item.music[0] : item.music;

      if (musicData) {
        const licenseType = item.license_type as keyof typeof LICENSE_MULTIPLIERS;
        
        // Prüfe ob spezifischer Lizenzpreis existiert
        switch (licenseType) {
          case "PERSONAL":
            calculatedPrice = musicData.price_personal || musicData.price * LICENSE_MULTIPLIERS.PERSONAL;
            break;
          case "COMMERCIAL":
            calculatedPrice = musicData.price_commercial || musicData.price * LICENSE_MULTIPLIERS.COMMERCIAL;
            break;
          case "ENTERPRISE":
            calculatedPrice = musicData.price_enterprise || musicData.price * LICENSE_MULTIPLIERS.ENTERPRISE;
            break;
          case "EXCLUSIVE":
            calculatedPrice = musicData.price_exclusive || musicData.price * LICENSE_MULTIPLIERS.EXCLUSIVE;
            break;
        }
      } else if (orderData) {
        calculatedPrice = orderData.offered_price || 0;
      }

      return {
        id: item.id,
        musicId: musicData?.id,
        orderId: orderData?.id,
        licenseType: item.license_type,
        calculatedPrice: Math.round(calculatedPrice * 100) / 100,
        music: musicData ? {
          id: musicData.id,
          title: musicData.title,
          description: musicData.description,
          duration: musicData.duration,
          price: musicData.price,
          audioUrl: musicData.audio_url,
          previewUrl: musicData.preview_url,
          coverImage: musicData.cover_image,
          genre: musicData.genre,
          mood: musicData.mood,
          director: musicData.director ? {
            id: musicData.director.id,
            badges: musicData.director.badges || [],
            user: musicData.director.user,
          } : null,
        } : null,
        order: orderData ? {
          id: orderData.id,
          orderNumber: orderData.order_number,
          title: orderData.title,
          offeredPrice: orderData.offered_price,
          status: orderData.status,
        } : null,
        createdAt: item.created_at,
      };
    });

    const subtotal = itemsWithPrices.reduce(
      (sum: number, item: any) => sum + item.calculatedPrice,
      0
    );

    return NextResponse.json({
      items: itemsWithPrices,
      subtotal: Math.round(subtotal * 100) / 100,
      itemCount: cartItems?.length || 0,
    });
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden des Warenkorbs");
  }
}

// POST - Artikel zum Warenkorb hinzufügen
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const body = await req.json();
    const validatedData = addToCartSchema.parse(body);

    if (!validatedData.musicId && !validatedData.orderId) {
      return NextResponse.json(
        { error: "Entweder musicId oder orderId muss angegeben werden" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Prüfe ob Artikel bereits im Warenkorb
    let existingQuery = supabase
      .from("cart_items")
      .select("id, license_type")
      .eq("user_id", user.id);

    if (validatedData.musicId) {
      existingQuery = existingQuery.eq("music_id", validatedData.musicId);
    } else if (validatedData.orderId) {
      existingQuery = existingQuery.eq("order_id", validatedData.orderId);
    }

    const { data: existingItem } = await existingQuery.single();

    if (existingItem) {
      // Update Lizenztyp wenn anders
      if (existingItem.license_type !== validatedData.licenseType) {
        const { data: updated, error: updateError } = await supabase
          .from("cart_items")
          .update({ license_type: validatedData.licenseType })
          .eq("id", existingItem.id)
          .select()
          .single();

        if (updateError) {
          return NextResponse.json(
            { error: "Fehler beim Aktualisieren" },
            { status: 500 }
          );
        }
        return NextResponse.json(updated);
      }
      return NextResponse.json({ 
        message: "Artikel bereits im Warenkorb",
        id: existingItem.id 
      });
    }

    // Prüfe ob Musik existiert und aktiv ist
    if (validatedData.musicId) {
      const { data: music, error: musicError } = await supabase
        .from("music")
        .select("id, status")
        .eq("id", validatedData.musicId)
        .single();

      if (musicError || !music) {
        return NextResponse.json(
          { error: "Musik nicht gefunden" },
          { status: 404 }
        );
      }

      if (music.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Diese Musik ist nicht mehr verfügbar" },
          { status: 400 }
        );
      }

      // Prüfe ob Exclusive und bereits gekauft
      if (validatedData.licenseType === "EXCLUSIVE") {
        const { data: purchases } = await supabase
          .from("downloads")
          .select("id")
          .eq("music_id", validatedData.musicId)
          .eq("license_type", "EXCLUSIVE");

        if (purchases && purchases.length > 0) {
          return NextResponse.json(
            { error: "Diese Musik wurde bereits exklusiv verkauft" },
            { status: 400 }
          );
        }
      }
    }

    // Neuen Warenkorb-Eintrag erstellen
    const { data: cartItem, error: createError } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        music_id: validatedData.musicId || null,
        order_id: validatedData.orderId || null,
        license_type: validatedData.licenseType,
      })
      .select()
      .single();

    if (createError) {
      console.error("Create Error:", createError);
      return NextResponse.json(
        { error: "Fehler beim Hinzufügen zum Warenkorb" },
        { status: 500 }
      );
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Hinzufügen zum Warenkorb");
  }
}

// DELETE - Warenkorb leeren
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const supabase = await createClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Fehler beim Leeren des Warenkorbs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Warenkorb geleert" });
  } catch (error) {
    return handleApiError(error, "Fehler beim Leeren des Warenkorbs");
  }
}
