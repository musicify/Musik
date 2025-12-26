import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert" },
      { status: 500 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Keine Signatur" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Ungültige Signatur" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const userId = metadata.userId;

        if (!userId) {
          console.error("No userId in metadata");
          break;
        }

        // Rechnungsnummer generieren
        const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Rechnung erstellen
        const { data: invoice, error: invoiceError } = await supabase
          .from("invoices")
          .insert({
            invoice_number: invoiceNumber,
            user_id: userId,
            amount: (session.amount_subtotal || 0) / 100,
            tax: ((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100,
            total: (session.amount_total || 0) / 100,
            status: "COMPLETED",
            payment_method: "CREDIT_CARD",
            stripe_payment_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (invoiceError) {
          console.error("Invoice creation error:", invoiceError);
        }

        // Warenkorb-Items verarbeiten
        if (metadata.cartItemIds) {
          const cartItemIds = metadata.cartItemIds.split(",");

          // Cart-Items holen
          const { data: cartItems } = await supabase
            .from("cart_items")
            .select(`
              id,
              license_type,
              music_id,
              order_id,
              music:music_id (
                id,
                title,
                price,
                audio_url,
                status
              ),
              order:order_id (
                id,
                title,
                offered_price,
                final_music_url
              )
            `)
            .in("id", cartItemIds);

          if (cartItems) {
            for (const item of cartItems) {
              // Download-Eintrag erstellen
              if (item.music_id && item.music) {
                const music = item.music as any;
                
                await supabase.from("downloads").insert({
                  user_id: userId,
                  music_id: item.music_id,
                  license_type: item.license_type,
                  download_url: music.audio_url,
                });

                // Invoice Item
                if (invoice) {
                  const price = music.price; // Vereinfacht
                  await supabase.from("invoice_items").insert({
                    invoice_id: invoice.id,
                    music_id: item.music_id,
                    description: `${music.title} - ${item.license_type} Lizenz`,
                    price: price,
                    total: price,
                    license_type: item.license_type,
                  });
                }

                // Musik-Statistik aktualisieren
                await supabase.rpc("increment_purchase_count", {
                  music_id: item.music_id,
                });

                // Bei EXCLUSIVE: Musik als verkauft markieren
                if (item.license_type === "EXCLUSIVE") {
                  await supabase
                    .from("music")
                    .update({ status: "EXCLUSIVE_SOLD" })
                    .eq("id", item.music_id);
                }
              }

              // Order verarbeiten
              if (item.order_id && item.order) {
                const order = item.order as any;

                await supabase
                  .from("orders")
                  .update({ status: "PAID" })
                  .eq("id", item.order_id);

                await supabase.from("order_history").insert({
                  order_id: item.order_id,
                  status: "PAID",
                  message: `Zahlung von €${order.offered_price} erhalten`,
                  changed_by: userId,
                });

                // Download erstellen
                if (order.final_music_url) {
                  await supabase.from("downloads").insert({
                    user_id: userId,
                    order_id: item.order_id,
                    license_type: "COMMERCIAL",
                    download_url: order.final_music_url,
                  });
                }

                // Invoice Item
                if (invoice) {
                  await supabase.from("invoice_items").insert({
                    invoice_id: invoice.id,
                    order_id: item.order_id,
                    description: `Custom Music: ${order.title}`,
                    price: order.offered_price,
                    total: order.offered_price,
                    license_type: "COMMERCIAL",
                  });
                }
              }
            }

            // Warenkorb leeren
            await supabase
              .from("cart_items")
              .delete()
              .in("id", cartItemIds);
          }
        }

        // Einzelne Bestellung verarbeiten
        if (metadata.orderId) {
          const { data: order } = await supabase
            .from("orders")
            .select("id, title, offered_price, final_music_url")
            .eq("id", metadata.orderId)
            .single();

          if (order) {
            await supabase
              .from("orders")
              .update({ status: "PAID" })
              .eq("id", metadata.orderId);

            await supabase.from("order_history").insert({
              order_id: metadata.orderId,
              status: "PAID",
              message: `Zahlung von €${order.offered_price} erhalten`,
              changed_by: userId,
            });

            // Download erstellen
            if (order.final_music_url) {
              await supabase.from("downloads").insert({
                user_id: userId,
                order_id: metadata.orderId,
                license_type: "COMMERCIAL",
                download_url: order.final_music_url,
              });
            }

            // Invoice aktualisieren mit Order
            if (invoice) {
              await supabase
                .from("invoices")
                .update({ order_id: metadata.orderId })
                .eq("id", invoice.id);

              await supabase.from("invoice_items").insert({
                invoice_id: invoice.id,
                order_id: metadata.orderId,
                description: `Custom Music: ${order.title}`,
                price: order.offered_price,
                total: order.offered_price,
                license_type: "COMMERCIAL",
              });
            }
          }
        }

        // TODO: E-Mail mit Rechnung und Download-Links senden

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("Payment failed:", paymentIntent.id);
        // TODO: Benachrichtigung an User senden
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook-Verarbeitung fehlgeschlagen" },
      { status: 500 }
    );
  }
}
