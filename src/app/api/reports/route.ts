import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

  try {
    const startDate = startDateStr ? new Date(startDateStr) : new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: {
          select: { name: true }
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      totalRevenue: orders.reduce((acc, order) => acc + order.totalPrice, 0),
      totalOrders: orders.length,
      paidOrders: orders.filter(o => o.payment?.status === "LUNAS").length,
      pendingOrders: orders.filter(o => o.payment?.status !== "LUNAS").length,
    };

    return new NextResponse(
      JSON.stringify({ stats, orders }, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GET_REPORTS]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
