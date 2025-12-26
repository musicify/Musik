import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/invoices - Get all invoices for the current user
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where = { userId: session.user.id };

    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        include: {
          items: true,
          order: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.invoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[INVOICES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create an invoice for an order
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, items } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get the order
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Generate invoice number
    const invoiceCount = await db.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`;

    // Calculate totals
    const invoiceItems = items || [{
      description: order.title,
      quantity: 1,
      price: order.offeredPrice || order.budget || 0,
      total: order.offeredPrice || order.budget || 0,
      licenseType: "COMMERCIAL",
    }];

    const subtotal = invoiceItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const tax = subtotal * 0.19; // 19% German VAT
    const total = subtotal + tax;

    // Create invoice
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        userId: session.user.id,
        amount: subtotal,
        tax,
        total,
        status: 'PENDING',
        items: {
          create: invoiceItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            licenseType: item.licenseType || "COMMERCIAL",
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("[INVOICES_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
