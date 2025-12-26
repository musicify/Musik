import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/chat - Get all chats for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const chats = await db.chat.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        },
        order: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("[CHAT_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/chat - Create a new chat
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
    const { orderId, participantIds, initialMessage } = body;

    if (!orderId || !participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: "Order ID and participant IDs are required" },
        { status: 400 }
      );
    }

    // Ensure the current user is included in participants
    const allParticipantIds = Array.from(new Set([session.user.id, ...participantIds]));

    // Create the chat
    const chat = await db.chat.create({
      data: {
        orderId,
        participants: {
          create: allParticipantIds.map(userId => ({
            userId,
          }))
        },
        messages: initialMessage ? {
          create: {
            senderId: session.user.id,
            content: initialMessage,
          }
        } : undefined
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        messages: true,
        order: true
      }
    });

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error("[CHAT_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
