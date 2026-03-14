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
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [monthlyEvents, monthlySales, monthlyUsers, categoryBreakdown, userStatusBreakdown] =
      await Promise.all([
        // Events and tickets per month (last 6 months)
        prisma.$queryRaw<{ month: string; events: number; tickets: number }[]>`
          SELECT
            TO_CHAR(DATE_TRUNC('month', e."createdAt"), 'YYYY-MM') as month,
            COUNT(DISTINCT e.id)::int as events,
            COUNT(DISTINCT t.id)::int as tickets
          FROM "Event" e
          LEFT JOIN "Ticket" t ON t."eventId" = e.id AND t.status IN ('VALID', 'USED')
          WHERE e."createdAt" >= ${sixMonthsAgo}
          GROUP BY DATE_TRUNC('month', e."createdAt")
          ORDER BY month ASC
        `,

        // Sales per month (last 6 months)
        prisma.$queryRaw<{ month: string; sales: number; tickets: number }[]>`
          SELECT
            TO_CHAR(DATE_TRUNC('month', o."createdAt"), 'YYYY-MM') as month,
            COALESCE(SUM(o."totalAmount"), 0)::float as sales,
            COUNT(DISTINCT t.id)::int as tickets
          FROM "Order" o
          LEFT JOIN "Ticket" t ON t."orderId" = o.id
          WHERE o.status = 'COMPLETED' AND o."createdAt" >= ${sixMonthsAgo}
          GROUP BY DATE_TRUNC('month', o."createdAt")
          ORDER BY month ASC
        `,

        // New users per month (last 6 months)
        prisma.$queryRaw<{ month: string; users: number }[]>`
          SELECT
            TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
            COUNT(*)::int as users
          FROM "User"
          WHERE "createdAt" >= ${sixMonthsAgo}
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month ASC
        `,

        // Event category breakdown
        prisma.$queryRaw<{ name: string; value: number }[]>`
          SELECT ec.name, COUNT(e.id)::int as value
          FROM "EventCategory" ec
          LEFT JOIN "Event" e ON e."categoryId" = ec.id
          GROUP BY ec.id, ec.name
          ORDER BY value DESC
        `,

        // User status breakdown
        prisma.$queryRaw<{ status: string; value: number }[]>`
          SELECT status, COUNT(*)::int as value
          FROM "User"
          GROUP BY status
        `,
      ]);

    // Build month labels for the last 6 months
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const eventsMap = new Map(monthlyEvents.map((e) => [e.month, e]));
    const salesMap = new Map(monthlySales.map((s) => [s.month, s]));
    const usersMap = new Map(monthlyUsers.map((u) => [u.month, u]));

    const eventData = months.map((m) => {
      const d = new Date(m + "-01");
      const label = monthNames[d.getMonth()];
      const data = eventsMap.get(m);
      return { name: label, events: data?.events || 0, tickets: data?.tickets || 0 };
    });

    const salesData = months.map((m) => {
      const d = new Date(m + "-01");
      const label = monthNames[d.getMonth()];
      const data = salesMap.get(m);
      return { name: label, sales: data?.sales || 0, tickets: data?.tickets || 0 };
    });

    const userData = months.map((m) => {
      const d = new Date(m + "-01");
      const label = monthNames[d.getMonth()];
      const data = usersMap.get(m);
      return { name: label, users: data?.users || 0 };
    });

    // Map user statuses to French labels
    const statusLabels: Record<string, string> = {
      ACTIVE: "Actifs",
      INACTIVE: "Inactifs",
      BANNED: "Bannis",
    };
    const userStatus = userStatusBreakdown.map((u) => ({
      name: statusLabels[u.status] || u.status,
      value: u.value,
    }));

    return NextResponse.json({
      eventData,
      salesData,
      userData,
      categoryBreakdown: categoryBreakdown.filter((c) => c.value > 0),
      userStatus,
    });
  } catch (error) {
    console.error("Error fetching report stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
