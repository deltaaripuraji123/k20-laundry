import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
          }
        },
        orderItems: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Manually stringify to handle BigInt
    return new NextResponse(
      JSON.stringify(orders, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GET_ORDERS]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { customerId, pickupDate, items, note, totalPrice } = body;

    // Generate Order Number (Contoh: INV-20240313-001)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
        }
      }
    });
    const orderNumber = `INV-${dateStr}-${(count + 1).toString().padStart(3, "0")}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        pickupDate: new Date(pickupDate),
        totalPrice,
        note,
        status: "DITERIMA",
        orderItems: {
          create: items.map((item: any) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
    });

    return new NextResponse(
      JSON.stringify(newOrder, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[POST_ORDER]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
