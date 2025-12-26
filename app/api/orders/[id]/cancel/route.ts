import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const cancelSchema = z.object({
  reason: z.string().min(5, "Bitte gib einen Grund für die Stornierung an"),
});

// POST - Cancel order
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = cancelSchema.parse(body);

    const order = await db.order.findUnique({
      where: { id },
      include: {
        director: true,
        chat: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Auftrag nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if user is customer or director
    const isCustomer = order.customerId === userId;
    const isDirector = order.director?.userId === userId;

    if (!isCustomer && !isDirector) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = ["COMPLETED", "CANCELLED", "PAID"];
    if (nonCancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: "Dieser Auftrag kann nicht mehr storniert werden" },
        { status: 400 }
      );
    }

    // Determine cancellation policy
    let refundInfo = "";
    if (order.status === "PENDING" || order.status === "OFFER_PENDING") {
      refundInfo = "Keine Kosten entstanden.";
    } else if (order.status === "OFFER_ACCEPTED" || order.status === "IN_PROGRESS") {
      if (isCustomer) {
        refundInfo = "Eine Anzahlung kann je nach Fortschritt einbehalten werden.";
      } else {
        refundInfo = "Der Kunde erhält eine vollständige Rückerstattung.";
      }
    }

    // Update order
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    // Add system message to chat
    if (order.chat) {
      const cancelledBy = isCustomer ? "Kunde" : "Regisseur";
      await db.chatMessage.create({
        data: {
          chatId: order.chat.id,
          senderId: userId,
          content: `❌ Auftrag storniert von ${cancelledBy}\n\nGrund: ${validatedData.reason}\n\n${refundInfo}`,
          isSystemMessage: true,
        },
      });
    }

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: "CANCELLED",
        message: `Storniert: ${validatedData.reason}`,
        changedBy: userId,
      },
    });

    // Remove from cart if present
    await db.cartItem.deleteMany({
      where: { orderId: id },
    });

    return NextResponse.json({
      ...updatedOrder,
      refundInfo,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

