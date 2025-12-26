import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET() {
  try {
    await requireAdmin();

    // Get date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel queries for statistics
    const [
      totalUsers,
      totalDirectors,
      totalCustomers,
      totalMusic,
      totalOrders,
      completedOrders,
      newUsersThisMonth,
      newUsersLastMonth,
      ordersThisMonth,
      ordersLastMonth,
    ] = await Promise.all([
      // User counts
      db.user.count(),
      db.user.count({ where: { role: "DIRECTOR" } }),
      db.user.count({ where: { role: "CUSTOMER" } }),

      // Music counts
      db.music.count(),

      // Order counts
      db.order.count(),
      db.order.count({ where: { status: "COMPLETED" } }),

      // New users this month
      db.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // New users last month
      db.user.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),

      // Orders this month
      db.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // Orders last month
      db.order.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
    ]);

    // Calculate growth percentages
    const userGrowth = newUsersLastMonth > 0
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
      : newUsersThisMonth > 0 ? 100 : 0;

    const orderGrowth = ordersLastMonth > 0
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100
      : ordersThisMonth > 0 ? 100 : 0;

    // Get recent activity
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        customer: {
          select: { name: true },
        },
      },
    });

    const recentUsers = await db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalDirectors,
        totalCustomers,
        totalMusic,
        totalOrders,
        completedOrders,
        conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      },
      growth: {
        users: {
          current: newUsersThisMonth,
          previous: newUsersLastMonth,
          percentage: Math.round(userGrowth * 10) / 10,
        },
        orders: {
          current: ordersThisMonth,
          previous: ordersLastMonth,
          percentage: Math.round(orderGrowth * 10) / 10,
        },
      },
      recentActivity: {
        orders: recentOrders,
        users: recentUsers,
      },
    });
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
