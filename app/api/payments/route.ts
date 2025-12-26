import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/payments - Create a payment intent
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, amount, paymentMethod } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Order ID and amount are required" },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        customerId: user.id
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // In production, you would create a Stripe payment intent here
    // For now, we'll simulate the payment process
    
    // Example Stripe integration:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100),
    //   currency: 'eur',
    //   metadata: { orderId },
    // });

    // Simulated response
    return NextResponse.json({
      clientSecret: `pi_simulated_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      amount
    });
  } catch (error) {
    console.error("[PAYMENTS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
