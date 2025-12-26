import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          customerProfile: {
            select: {
              id: true,
            },
          },
          directorProfile: {
            select: {
              badges: true,
              rating: true,
              totalProjects: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - Update user (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, role, isBlocked } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (role) {
      updateData.role = role;
    }

    // Note: isBlocked would need to be added to the User model
    // For now, we'll just update the role

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USERS_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

