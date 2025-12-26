import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const offerSchema = z.object({
  price: z.number().positive("Preis muss positiv sein"),
  productionTime: z.number().int().positive("Produktionszeit muss positiv sein"),
  includedRevisions: z.number().int().min(1).max(5).default(2),
  message: z.string().optional(),
});

// POST - Submit offer (Director only)
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
    const validatedData = offerSchema.parse(body);

    // Get order and verify director
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

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Angebot kann nur für neue Aufträge abgegeben werden" },
        { status: 400 }
      );
    }

    // Update order with offer
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        offeredPrice: validatedData.price,
        productionTime: validatedData.productionTime,
        includedRevisions: validatedData.includedRevisions,
        status: "OFFER_PENDING",
      },
    });

    // Add system message to chat
    if (order.chat) {
      await db.chatMessage.create({
        data: {
          chatId: order.chat.id,
          senderId: userId,
          content: `📋 Angebot abgegeben:\n• Preis: €${validatedData.price}\n• Lieferzeit: ${validatedData.productionTime} Tage\n• Inkl. ${validatedData.includedRevisions} Revisionen${validatedData.message ? `\n\n${validatedData.message}` : ""}`,
          isSystemMessage: true,
        },
      });
    }

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: "OFFER_PENDING",
        message: `Angebot: €${validatedData.price}, ${validatedData.productionTime} Tage`,
        changedBy: userId,
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

    console.error("Error submitting offer:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

