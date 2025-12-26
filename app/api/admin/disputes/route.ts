import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// GET - Get all disputes/support tickets (Admin only)
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const tickets = await db.supportTicket.findMany({
      where,
      orderBy: [
        { status: "asc" }, // Open tickets first
        { createdAt: "desc" },
      ],
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Get related user and order info
    const ticketsWithDetails = await Promise.all(
      tickets.map(async (ticket) => {
        const ticketUser = await db.user.findUnique({
          where: { id: ticket.userId },
          select: { name: true, email: true, image: true },
        });

        let order = null;
        if (ticket.orderId) {
          order = await db.order.findUnique({
            where: { id: ticket.orderId },
            select: { orderNumber: true, title: true, status: true },
          });
        }

        return {
          ...ticket,
          user: ticketUser,
          order,
        };
      })
    );

    return NextResponse.json(ticketsWithDetails);
  } catch (error) {
    console.error("Error fetching disputes:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

const createTicketSchema = z.object({
  userId: z.string(),
  orderId: z.string().optional(),
  type: z.enum(["GENERAL", "DISPUTE", "REFUND", "TECHNICAL", "OTHER"]),
  subject: z.string().min(5),
  description: z.string().min(20),
});

// POST - Create support ticket (can be called by any user)
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = createTicketSchema.parse({ ...body, userId });

    // Generate ticket number
    const ticketCount = await db.supportTicket.count();
    const ticketNumber = `TKT-${new Date().getFullYear()}-${(ticketCount + 1).toString().padStart(4, "0")}`;

    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        userId: validatedData.userId,
        orderId: validatedData.orderId,
        type: validatedData.type,
        subject: validatedData.subject,
        description: validatedData.description,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

