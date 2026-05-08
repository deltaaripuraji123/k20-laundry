import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// GET a single order by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        orderItems: {
          include: {
            service: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return new NextResponse(
      JSON.stringify(order, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GET_ORDER_BY_ID]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH to update order status or other fields
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId } = await params;
    const body = await req.json();
    const { status, paymentStatus, paymentMethod } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    
    if (paymentStatus) {
      updateData.payment = {
        upsert: {
          update: {
            status: paymentStatus,
            method: paymentMethod || "TUNAI",
            paidAt: paymentStatus === "LUNAS" ? new Date() : null,
          },
          create: {
            status: paymentStatus,
            method: paymentMethod || "TUNAI",
            paidAt: paymentStatus === "LUNAS" ? new Date() : null,
          },
        },
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        payment: true,
      },
    });

    return new NextResponse(
      JSON.stringify(updatedOrder, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[PATCH_ORDER]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE an order
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "Only ADMIN can delete orders" }, { status: 403 });
  }

  try {
    const { orderId } = await params;

    await prisma.order.delete({
      where: { id: orderId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_ORDER]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
