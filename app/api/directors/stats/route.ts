import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get director performance stats
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const director = await db.directorProfile.findUnique({
      where: { userId },
    });

    if (!director) {
      return NextResponse.json(
        { error: "Kein Regisseur-Profil gefunden" },
        { status: 404 }
      );
    }

    // Get order statistics
    const allOrders = await db.order.findMany({
      where: { directorId: director.id },
      select: {
        status: true,
        offeredPrice: true,
        createdAt: true,
        offerAcceptedAt: true,
        usedRevisions: true,
      },
    });

    const completedOrders = allOrders.filter(o => o.status === "COMPLETED");
    const cancelledOrders = allOrders.filter(o => o.status === "CANCELLED");
    const totalOrders = allOrders.length;

    // Calculate completion rate
    const completionRate = totalOrders > 0 
      ? (completedOrders.length / (completedOrders.length + cancelledOrders.length)) * 100 
      : 0;

    // Calculate total earnings
    const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.offeredPrice || 0), 0);

    // Calculate average response time (placeholder - would need more data)
    const avgResponseTime = 24; // hours

    // Calculate revision rate
    const totalRevisions = allOrders.reduce((sum, o) => sum + o.usedRevisions, 0);
    const revisionRate = totalOrders > 0 ? totalRevisions / totalOrders : 0;

    // Get music stats
    const musicStats = await db.music.aggregate({
      where: { directorId: director.id },
      _sum: {
        playCount: true,
        purchaseCount: true,
      },
      _count: true,
    });

    // Monthly earnings (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await db.order.findMany({
      where: {
        directorId: director.id,
        status: "COMPLETED",
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        offeredPrice: true,
        createdAt: true,
      },
    });

    // Group by month
    const monthlyEarnings: Record<string, number> = {};
    monthlyOrders.forEach(order => {
      const monthKey = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyEarnings[monthKey] = (monthlyEarnings[monthKey] || 0) + (order.offeredPrice || 0);
    });

    return NextResponse.json({
      overview: {
        totalOrders,
        completedOrders: completedOrders.length,
        activeOrders: allOrders.filter(o => !["COMPLETED", "CANCELLED"].includes(o.status)).length,
        totalEarnings,
        completionRate: Math.round(completionRate),
        avgResponseTime,
        revisionRate: Math.round(revisionRate * 100) / 100,
      },
      music: {
        totalTracks: musicStats._count,
        totalPlays: musicStats._sum.playCount || 0,
        totalPurchases: musicStats._sum.purchaseCount || 0,
      },
      monthlyEarnings,
      badges: director.badges,
      rating: director.rating,
      reviewCount: director.reviewCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

