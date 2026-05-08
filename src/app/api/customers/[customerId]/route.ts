import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET a single customer by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({});
  }
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { customerId } = await params;

    if (!customerId) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return new NextResponse(
      JSON.stringify(customer, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GET_CUSTOMER_BY_ID]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT/PATCH an existing customer by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { customerId } = await params;
    const body = await req.json();
    const { name, phone, address } = body;

    if (!customerId) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }
    if (!name || !phone) {
      return NextResponse.json({ message: "Nama dan nomor telepon wajib diisi." }, { status: 400 });
    }

    // Check if phone number already exists for ANOTHER customer
    const existingCustomer = await prisma.customer.findFirst({
      where: { 
        phone,
        NOT: { id: customerId }
      },
    });

    if (existingCustomer) {
      return NextResponse.json({ message: "Nomor telepon sudah digunakan pelanggan lain." }, { status: 409 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: { name, phone, address },
    });

    return new NextResponse(
      JSON.stringify(updatedCustomer, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[PUT_CUSTOMER]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a customer by ID
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { customerId } = await params;

    if (!customerId) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    await prisma.customer.delete({
      where: { id: customerId },
    });

    return new NextResponse(null, { status: 204 }); 
  } catch (error) {
    console.error("[DELETE_CUSTOMER]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
