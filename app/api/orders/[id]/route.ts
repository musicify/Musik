import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get single order by ID
export async function GET(
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
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        director: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        chat: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        orderHistory: {
          orderBy: { createdAt: "desc" },
        },
        invoices: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Auftrag nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if user has access to this order
    const isCustomer = order.customerId === userId;
    const isDirector = order.director?.userId === userId;

    if (!isCustomer && !isDirector) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

const updateOrderSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  references: z.string().optional(),
  notes: z.string().optional(),
  budget: z.number().positive().optional(),
});

// PUT - Update order (Customer only, before offer accepted)
export async function PUT(
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
    const validatedData = updateOrderSchema.parse(body);

    const order = await db.order.findUnique({
      where: { id },
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

    // Only allow updates before offer is accepted
    if (!["PENDING", "OFFER_PENDING"].includes(order.status)) {
      return NextResponse.json(
        { error: "Auftrag kann nach Annahme des Angebots nicht mehr bearbeitet werden" },
        { status: 400 }
      );
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: validatedData,
    });

    // Log history
    await db.orderHistory.create({
      data: {
        orderId: id,
        status: order.status,
        message: "Auftragsdetails aktualisiert",
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

    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

