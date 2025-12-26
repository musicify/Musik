import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get single ticket
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

    const ticket = await db.supportTicket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    // Check access - either admin or ticket owner
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "ADMIN" && ticket.userId !== userId) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Get user info
    const ticketUser = await db.user.findUnique({
      where: { id: ticket.userId },
      select: { name: true, email: true, image: true },
    });

    // Get order info if applicable
    let order = null;
    if (ticket.orderId) {
      order = await db.order.findUnique({
        where: { id: ticket.orderId },
        include: {
          customer: { select: { name: true, email: true } },
          director: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
      });
    }

    return NextResponse.json({
      ...ticket,
      user: ticketUser,
      order,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

const updateTicketSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  assignedTo: z.string().optional(),
});

// PUT - Update ticket status (Admin only)
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

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateTicketSchema.parse(body);

    const updateData: any = { ...validatedData };
    if (validatedData.status === "RESOLVED") {
      updateData.resolvedAt = new Date();
    }

    const ticket = await db.supportTicket.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

const messageSchema = z.object({
  content: z.string().min(1),
});

// POST - Add message to ticket
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const ticket = await db.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    // Check access
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    const isAdmin = user?.role === "ADMIN";
    if (!isAdmin && ticket.userId !== userId) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { content } = messageSchema.parse(body);

    const message = await db.ticketMessage.create({
      data: {
        ticketId,
        senderId: userId,
        content,
        isAdmin,
      },
    });

    // Update ticket status if admin responds
    if (isAdmin && ticket.status === "OPEN") {
      await db.supportTicket.update({
        where: { id: ticketId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

