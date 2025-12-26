import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const addToCartSchema = z.object({
  musicId: z.string().optional(),
  orderId: z.string().optional(),
  licenseType: z.enum(["PERSONAL", "COMMERCIAL", "ENTERPRISE", "EXCLUSIVE"]),
});

// GET - Get user's cart
export async function GET(req: NextRequest) {
  try {
    // TODO: Get user from session
    const userId = req.headers.get("x-user-id"); // Placeholder

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        music: {
          include: {
            director: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        order: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate prices based on license type
    const itemsWithPrices = cartItems.map((item) => {
      let price = 0;
      if (item.music) {
        switch (item.licenseType) {
          case "PERSONAL":
            price = item.music.pricePersonal || item.music.price;
            break;
          case "COMMERCIAL":
            price = item.music.priceCommercial || item.music.price;
            break;
          case "ENTERPRISE":
            price = item.music.priceEnterprise || item.music.price * 4;
            break;
          case "EXCLUSIVE":
            price = item.music.priceExclusive || item.music.price * 10;
            break;
          default:
            price = item.music.price;
        }
      } else if (item.order) {
        price = item.order.offeredPrice || 0;
      }

      return {
        ...item,
        calculatedPrice: price,
      };
    });

    const subtotal = itemsWithPrices.reduce(
      (sum, item) => sum + item.calculatedPrice,
      0
    );

    return NextResponse.json({
      items: itemsWithPrices,
      subtotal,
      itemCount: cartItems.length,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    // TODO: Get user from session
    const userId = req.headers.get("x-user-id"); // Placeholder

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = addToCartSchema.parse(body);

    if (!validatedData.musicId && !validatedData.orderId) {
      return NextResponse.json(
        { error: "Entweder musicId oder orderId muss angegeben werden" },
        { status: 400 }
      );
    }

    // Check if item already in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        userId,
        ...(validatedData.musicId && { musicId: validatedData.musicId }),
        ...(validatedData.orderId && { orderId: validatedData.orderId }),
      },
    });

    if (existingItem) {
      // Update license type if different
      if (existingItem.licenseType !== validatedData.licenseType) {
        const updated = await db.cartItem.update({
          where: { id: existingItem.id },
          data: { licenseType: validatedData.licenseType },
        });
        return NextResponse.json(updated);
      }
      return NextResponse.json(existingItem);
    }

    // Create new cart item
    const cartItem = await db.cartItem.create({
      data: {
        userId,
        musicId: validatedData.musicId,
        orderId: validatedData.orderId,
        licenseType: validatedData.licenseType,
      },
      include: {
        music: true,
        order: true,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// DELETE - Clear cart
export async function DELETE(req: NextRequest) {
  try {
    // TODO: Get user from session
    const userId = req.headers.get("x-user-id"); // Placeholder

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    await db.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ message: "Warenkorb geleert" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

