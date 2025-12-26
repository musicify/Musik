import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Complete order (After payment)
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

    if (order.customerId !== userId) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: "Auftrag muss erst bezahlt werden" },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: "COMPLETED",
      },
    });

    // Add system message to chat
    if (order.chat) {
      await db.chatMessage.create({
        data: {
          chatId: order.chat.id,
          senderId: userId,
          content: "✅ Auftrag abgeschlossen! Vielen Dank für die Zusammenarbeit.",
          isSystemMessage: true,
        },
      });
    }

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: "COMPLETED",
        message: "Auftrag erfolgreich abgeschlossen",
        changedBy: userId,
      },
    });

    // Update director stats
    if (order.directorId && order.offeredPrice) {
      await db.directorProfile.update({
        where: { id: order.directorId },
        data: {
          totalProjects: { increment: 1 },
          totalEarnings: { increment: order.offeredPrice },
        },
      });
    }

    // Create download record
    if (order.finalMusicUrl) {
      await db.download.create({
        data: {
          userId: order.customerId,
          orderId: id,
          licenseType: "COMMERCIAL",
          downloadUrl: order.finalMusicUrl,
        },
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error completing order:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

