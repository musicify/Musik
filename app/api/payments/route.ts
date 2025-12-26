import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";
import { z } from "zod";
import Stripe from "stripe";

// Stripe initialisieren (nur wenn Key vorhanden)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
  : null;

const checkoutSchema = z.object({
  cartItemIds: z.array(z.string()).optional(),
  orderId: z.string().optional(),
  promoCode: z.string().optional(),
});

// Preismultiplikatoren für Lizenztypen
const LICENSE_MULTIPLIERS: Record<string, number> = {
  PERSONAL: 0.6,
  COMMERCIAL: 1,
  ENTERPRISE: 2.5,
  EXCLUSIVE: 10,
};

// POST - Checkout-Session erstellen
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const body = await req.json();
    const validatedData = checkoutSchema.parse(body);

    if (!stripe) {
      return NextResponse.json(
        { error: "Zahlung nicht verfügbar. Stripe nicht konfiguriert." },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let totalAmount = 0;
    const metadata: Record<string, string> = {
      userId: user.id,
    };

    // Warenkorb-Items verarbeiten
    if (validatedData.cartItemIds && validatedData.cartItemIds.length > 0) {
      const { data: cartItems, error: cartError } = await supabase
        .from("cart_items")
        .select(`
          id,
          license_type,
          music:music_id (
            id,
            title,
            price,
            price_personal,
            price_commercial,
            price_enterprise,
            price_exclusive
          ),
          order:order_id (
            id,
            title,
            offered_price
          )
        `)
        .eq("user_id", user.id)
        .in("id", validatedData.cartItemIds);

      if (cartError || !cartItems || cartItems.length === 0) {
        return NextResponse.json(
          { error: "Keine gültigen Artikel im Warenkorb" },
          { status: 400 }
        );
      }

      metadata.cartItemIds = validatedData.cartItemIds.join(",");

      for (const item of cartItems) {
        let price = 0;
        let name = "";

        if (item.music) {
          const music = item.music as any;
          const licenseType = item.license_type as keyof typeof LICENSE_MULTIPLIERS;

          // Preis berechnen
          switch (licenseType) {
            case "PERSONAL":
              price = music.price_personal || music.price * LICENSE_MULTIPLIERS.PERSONAL;
              break;
            case "COMMERCIAL":
              price = music.price_commercial || music.price * LICENSE_MULTIPLIERS.COMMERCIAL;
              break;
            case "ENTERPRISE":
              price = music.price_enterprise || music.price * LICENSE_MULTIPLIERS.ENTERPRISE;
              break;
            case "EXCLUSIVE":
              price = music.price_exclusive || music.price * LICENSE_MULTIPLIERS.EXCLUSIVE;
              break;
            default:
              price = music.price;
          }

          name = `${music.title} (${item.license_type} Lizenz)`;
        } else if (item.order) {
          const order = item.order as any;
          price = order.offered_price || 0;
          name = `Custom Music: ${order.title}`;
        }

        if (price > 0) {
          lineItems.push({
            price_data: {
              currency: "eur",
              product_data: {
                name: name,
              },
              unit_amount: Math.round(price * 100), // Cents
            },
            quantity: 1,
          });
          totalAmount += price;
        }
      }
    }
    // Einzelne Bestellung verarbeiten
    else if (validatedData.orderId) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id, title, offered_price, customer_id, status")
        .eq("id", validatedData.orderId)
        .single();

      if (orderError || !order) {
        return NextResponse.json(
          { error: "Bestellung nicht gefunden" },
          { status: 404 }
        );
      }

      if (order.customer_id !== user.id) {
        return NextResponse.json(
          { error: "Keine Berechtigung" },
          { status: 403 }
        );
      }

      if (order.status !== "READY_FOR_PAYMENT") {
        return NextResponse.json(
          { error: "Bestellung ist nicht bereit zur Zahlung" },
          { status: 400 }
        );
      }

      metadata.orderId = order.id;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Custom Music: ${order.title}`,
          },
          unit_amount: Math.round((order.offered_price || 0) * 100),
        },
        quantity: 1,
      });
      totalAmount = order.offered_price || 0;
    } else {
      return NextResponse.json(
        { error: "Keine Artikel zum Bezahlen ausgewählt" },
        { status: 400 }
      );
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "Keine gültigen Artikel gefunden" },
        { status: 400 }
      );
    }

    // Promo-Code verarbeiten
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (validatedData.promoCode) {
      // Hier könnte man Stripe Coupon-Codes verwenden
      // Für Demo: einfacher 10% Rabatt
      if (validatedData.promoCode.toLowerCase() === "music10") {
        // Stripe Coupon erstellen oder verwenden
        try {
          const coupon = await stripe.coupons.retrieve("MUSIC10").catch(() => null);
          if (coupon) {
            discounts.push({ coupon: "MUSIC10" });
          }
        } catch {
          // Coupon existiert nicht, ignorieren
        }
      }
    }

    // Checkout-Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: user.email,
      metadata: metadata,
      discounts: discounts.length > 0 ? discounts : undefined,
      billing_address_collection: "required",
      invoice_creation: {
        enabled: true,
      },
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return handleApiError(error, "Fehler beim Erstellen der Checkout-Session");
  }
}
