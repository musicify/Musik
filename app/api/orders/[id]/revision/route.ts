import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const revisionSchema = z.object({
  feedback: z.string().min(10, "Bitte beschreibe deine Änderungswünsche genauer"),
});

// POST - Request revision (Customer only)
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
    const validatedData = revisionSchema.parse(body);

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

    if (!["IN_PROGRESS", "READY_FOR_PAYMENT"].includes(order.status)) {
      return NextResponse.json(
        { error: "Revision kann in diesem Status nicht angefragt werden" },
        { status: 400 }
      );
    }

    // Check if revisions are available
    if (order.usedRevisions >= order.includedRevisions) {
      return NextResponse.json(
        { 
          error: "Alle inkludierten Revisionen wurden aufgebraucht. Kontaktiere den Regisseur für zusätzliche Revisionen.",
          remainingRevisions: 0,
        },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: "REVISION_REQUESTED",
        usedRevisions: { increment: 1 },
      },
    });

    const remainingRevisions = order.includedRevisions - order.usedRevisions - 1;

    // Add system message to chat
    if (order.chat) {
      await db.chatMessage.create({
        data: {
          chatId: order.chat.id,
          senderId: userId,
          content: `🔄 Revision angefragt (${remainingRevisions} verbleibend)\n\nFeedback:\n${validatedData.feedback}`,
          isSystemMessage: true,
        },
      });
    }

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: "REVISION_REQUESTED",
        message: `Revision ${order.usedRevisions + 1}/${order.includedRevisions}: ${validatedData.feedback.substring(0, 100)}...`,
        changedBy: userId,
      },
    });

    return NextResponse.json({
      ...updatedOrder,
      remainingRevisions,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error requesting revision:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

