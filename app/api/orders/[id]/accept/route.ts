import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Accept offer (Customer only)
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

    const order = await db.order.findUnique({
      where: { id },
      include: {
        chat: true,
        director: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Auftrag nicht gefunden" },
        { status: 404 }
      );
    }

    if (order.customerId !== userId) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    if (order.status !== "OFFER_PENDING") {
      return NextResponse.json(
        { error: "Kein Angebot zum Annehmen vorhanden" },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: "OFFER_ACCEPTED",
        offerAcceptedAt: new Date(),
      },
    });

    // Add system message to chat
    if (order.chat) {
      await db.chatMessage.create({
        data: {
          chatId: order.chat.id,
          senderId: userId,
          content: "✅ Angebot angenommen! Die Produktion kann beginnen.",
          isSystemMessage: true,
        },
      });
    }

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: "OFFER_ACCEPTED",
        message: "Angebot angenommen",
        changedBy: userId,
      },
    });

    // TODO: Send email notification to director

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error accepting offer:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

