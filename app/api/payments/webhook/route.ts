import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/payments/webhook - Handle Stripe webhook events
export async function POST(request: Request) {
  try {
    const body = await request.text();
    
    // In production, verify the webhook signature
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const sig = request.headers.get('stripe-signature')!;
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Simulated webhook handling
    const event = JSON.parse(body);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await db.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
            }
          });

          // Create order history entry
          await db.orderHistory.create({
            data: {
              orderId,
              status: 'PAID',
              message: 'Payment received successfully',
              changedBy: 'system'
            }
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await db.orderHistory.create({
            data: {
              orderId,
              status: 'PENDING',
              message: 'Payment failed',
              changedBy: 'system'
            }
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const orderId = charge.metadata?.orderId;

        if (orderId) {
          await db.order.update({
            where: { id: orderId },
            data: {
              status: 'CANCELLED'
            }
          });

          await db.orderHistory.create({
            data: {
              orderId,
              status: 'CANCELLED',
              message: 'Payment refunded',
              changedBy: 'system'
            }
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PAYMENTS_WEBHOOK]", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
