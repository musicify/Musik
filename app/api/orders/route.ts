import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createOrderSchema = z.object({
  title: z.string().min(5, "Titel muss mindestens 5 Zeichen haben"),
  description: z.string().min(20, "Beschreibung muss mindestens 20 Zeichen haben"),
  requirements: z.string(),
  references: z.string().optional(),
  notes: z.string().optional(),
  budget: z.number().optional(),
  genre: z.string().optional(),
  subgenre: z.string().optional(),
  style: z.string().optional(),
  era: z.string().optional(),
  culture: z.string().optional(),
  mood: z.string().optional(),
  useCase: z.string().optional(),
  structure: z.string().optional(),
  directorIds: z.array(z.string()).min(1, "Mindestens ein Komponist muss ausgewählt werden"),
  paymentModel: z.enum(["PAY_ON_COMPLETION", "PARTIAL_PAYMENT"]).default("PAY_ON_COMPLETION"),
});

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `ORD-${year}-${random}`;
}

// GET - Get user's orders
export async function GET(req: NextRequest) {
  try {
    // TODO: Get user from session
    const customerId = req.headers.get("x-user-id"); // Placeholder

    if (!customerId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const orders = await db.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        director: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        chat: {
          include: {
            messages: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(req: NextRequest) {
  try {
    // TODO: Get user from session
    const customerId = req.headers.get("x-user-id"); // Placeholder

    if (!customerId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    // Create order for each selected director
    const orders = await Promise.all(
      validatedData.directorIds.map(async (directorId) => {
        const order = await db.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customerId,
            directorId,
            status: "PENDING",
            title: validatedData.title,
            description: validatedData.description,
            requirements: validatedData.requirements,
            references: validatedData.references,
            notes: validatedData.notes,
            budget: validatedData.budget,
            genre: validatedData.genre,
            subgenre: validatedData.subgenre,
            style: validatedData.style,
            era: validatedData.era,
            culture: validatedData.culture,
            mood: validatedData.mood,
            useCase: validatedData.useCase,
            structure: validatedData.structure,
            paymentModel: validatedData.paymentModel,
          },
        });

        // Create chat for order
        await db.chat.create({
          data: {
            orderId: order.id,
            participants: {
              createMany: {
                data: [
                  { userId: customerId },
                  { userId: (await db.directorProfile.findUnique({ where: { id: directorId } }))?.userId || "" },
                ],
              },
            },
          },
        });

        // Create order history entry
        await db.orderHistory.create({
          data: {
            orderId: order.id,
            status: "PENDING",
            message: "Auftrag erstellt",
            changedBy: customerId,
          },
        });

        return order;
      })
    );

    // TODO: Send email notifications to directors

    return NextResponse.json(orders, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

