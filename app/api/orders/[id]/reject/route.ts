import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().optional(),
});

// POST - Reject offer (Customer only)
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

    const body = await req.json().catch(() => ({}));
    const { reason } = rejectSchema.parse(body);

    const order = await db.order.findUnique({
      where: { id },
      include: {
        chat: true,
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
        { error: "Kein Angebot zum Ablehnen vorhanden" },
        { status: 400 }
      );
    }

    // Reset order to pending state
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: "PENDING",
        offeredPrice: null,
        productionTime: null,
      },
    });

    // Add system message to chat
    if (order.chat) {
      await db.chatMessage.create({
        data: {
          chatId: order.chat.id,
          senderId: userId,
          content: `❌ Angebot abgelehnt${reason ? `\nGrund: ${reason}` : ""}`,
          isSystemMessage: true,
        },
      });
    }

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: "PENDING",
        message: `Angebot abgelehnt${reason ? `: ${reason}` : ""}`,
        changedBy: userId,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error rejecting offer:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

