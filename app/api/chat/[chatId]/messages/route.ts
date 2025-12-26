import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/chat/[chatId]/messages - Get all messages in a chat
export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { chatId } = params;

    // Check if user is a participant
    const participant = await db.chatParticipant.findFirst({
      where: {
        chatId,
        userId: session.user.id
      }
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not a participant of this chat" },
        { status: 403 }
      );
    }

    const messages = await db.chatMessage.findMany({
      where: {
        chatId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[CHAT_MESSAGES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/chat/[chatId]/messages - Send a message
export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { chatId } = params;
    const body = await request.json();
    const { content, fileUrl, fileType } = body;

    if (!content && !fileUrl) {
      return NextResponse.json(
        { error: "Content or file is required" },
        { status: 400 }
      );
    }

    // Check if user is a participant
    const participant = await db.chatParticipant.findFirst({
      where: {
        chatId,
        userId: session.user.id
      }
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not a participant of this chat" },
        { status: 403 }
      );
    }

    // Create the message
    const message = await db.chatMessage.create({
      data: {
        chatId,
        senderId: session.user.id,
        content: content || "",
        fileUrl,
        fileType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Update chat's updatedAt
    await db.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("[CHAT_MESSAGES_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
