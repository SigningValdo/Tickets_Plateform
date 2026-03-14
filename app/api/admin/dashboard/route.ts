import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRevenue,
      lastMonthRevenue,
      ticketsSold,
      lastMonthTicketsSold,
      activeEvents,
      lastMonthActiveEvents,
      totalUsers,
      lastMonthUsers,
      dailySales,
      categoryBreakdown,
    ] = await Promise.all([
      // Total revenue this month (completed orders)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: "COMPLETED",
          createdAt: { gte: startOfMonth },
        },
      }),
      // Total revenue last month
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: "COMPLETED",
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      // Tickets sold this month
      prisma.ticket.count({
        where: {
          status: { in: ["VALID", "USED"] },
          createdAt: { gte: startOfMonth },
        },
      }),
      // Tickets sold last month
      prisma.ticket.count({
        where: {
          status: { in: ["VALID", "USED"] },
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      // Active events
      prisma.event.count({
        where: { status: { in: ["UPCOMING", "ACTIVE"] } },
      }),
      // Active events last month
      prisma.event.count({
        where: {
          status: { in: ["UPCOMING", "ACTIVE"] },
          createdAt: { lte: endOfLastMonth },
        },
      }),
      // Total users
      prisma.user.count(),
      // Users last month
      prisma.user.count({
        where: { createdAt: { lte: endOfLastMonth } },
      }),
      // Daily sales for last 30 days
      prisma.$queryRaw<{ date: Date; total: number }[]>`
        SELECT DATE("createdAt") as date, COALESCE(SUM("totalAmount"), 0)::float as total
        FROM "Order"
        WHERE status = 'COMPLETED' AND "createdAt" >= ${thirtyDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      // Sales by category
      prisma.$queryRaw<{ name: string; total: number }[]>`
        SELECT ec.name, COALESCE(SUM(o."totalAmount"), 0)::float as total
        FROM "EventCategory" ec
        LEFT JOIN "Event" e ON e."categoryId" = ec.id
        LEFT JOIN "Ticket" t ON t."eventId" = e.id
        LEFT JOIN "Order" o ON o.id = t."orderId" AND o.status = 'COMPLETED'
        GROUP BY ec.id, ec.name
        ORDER BY total DESC
      `,
    ]);

    const currentRevenue = totalRevenue._sum.totalAmount || 0;
    const prevRevenue = lastMonthRevenue._sum.totalAmount || 0;
    const revenueChange = prevRevenue > 0
      ? (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
      : currentRevenue > 0 ? "100" : "0";

    const ticketsChange = lastMonthTicketsSold > 0
      ? (((ticketsSold - lastMonthTicketsSold) / lastMonthTicketsSold) * 100).toFixed(1)
      : ticketsSold > 0 ? "100" : "0";

    const eventsChange = activeEvents - lastMonthActiveEvents;

    const usersChange = lastMonthUsers > 0
      ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
      : totalUsers > 0 ? "100" : "0";

    // Build daily sales array for the last 30 days
    const salesMap = new Map(
      dailySales.map((s) => [new Date(s.date).toISOString().split("T")[0], s.total])
    );
    const dailySalesData: { date: string; total: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailySalesData.push({ date: key, total: salesMap.get(key) || 0 });
    }

    // Build category breakdown with percentages (only categories with sales)
    const totalCategorySales = categoryBreakdown.reduce((sum, c) => sum + c.total, 0);
    const categories = categoryBreakdown
      .filter((c) => c.total > 0)
      .map((c) => ({
        name: c.name,
        total: c.total,
        percentage: totalCategorySales > 0
          ? Math.round((c.total / totalCategorySales) * 100)
          : 0,
      }));

    return NextResponse.json({
      stats: {
        revenue: {
          value: currentRevenue,
          change: `${Number(revenueChange) >= 0 ? "+" : ""}${revenueChange}%`,
          trend: Number(revenueChange) >= 0 ? "up" : "down",
        },
        ticketsSold: {
          value: ticketsSold,
          change: `${Number(ticketsChange) >= 0 ? "+" : ""}${ticketsChange}%`,
          trend: Number(ticketsChange) >= 0 ? "up" : "down",
        },
        activeEvents: {
          value: activeEvents,
          change: `${eventsChange >= 0 ? "+" : ""}${eventsChange}`,
          trend: eventsChange >= 0 ? "up" : "down",
        },
        users: {
          value: totalUsers,
          change: `${Number(usersChange) >= 0 ? "+" : ""}${usersChange}%`,
          trend: Number(usersChange) >= 0 ? "up" : "down",
        },
      },
      dailySales: dailySalesData,
      categories,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
