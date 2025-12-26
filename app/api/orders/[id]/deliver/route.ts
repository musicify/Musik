import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const deliverSchema = z.object({
  musicUrl: z.string().url("Ungültige URL"),
  message: z.string().optional(),
});

// POST - Deliver final music (Director only)
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
    const validatedData = deliverSchema.parse(body);

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

    if (order.director?.userId !== userId) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    if (!["OFFER_ACCEPTED", "IN_PROGRESS", "REVISION_REQUESTED"].includes(order.status)) {
      return NextResponse.json(
        { error: "Auftrag kann in diesem Status nicht geliefert werden" },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: "READY_FOR_PAYMENT",
        finalMusicUrl: validatedData.musicUrl,
      },
    });

    // Add system message to chat
    if (order.chat) {
      await db.chatMessage.create({
        data: {
          chatId: order.chat.id,
          senderId: userId,
          content: `🎵 Finale Musik geliefert!${validatedData.message ? `\n\n${validatedData.message}` : ""}\n\n[Musik abspielen]`,
          fileUrl: validatedData.musicUrl,
          fileType: "audio",
          isSystemMessage: true,
        },
      });
    }

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: "READY_FOR_PAYMENT",
        message: "Finale Musik geliefert",
        changedBy: userId,
      },
    });

    // Add to customer's cart automatically
    await db.cartItem.create({
      data: {
        userId: order.customerId,
        orderId: id,
        licenseType: "COMMERCIAL", // Default, can be changed
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error delivering music:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

