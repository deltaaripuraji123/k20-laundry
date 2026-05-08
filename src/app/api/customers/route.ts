import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// GET all customers
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Manually stringify to handle BigInt
    return new NextResponse(
      JSON.stringify(customers, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GET_CUSTOMERS]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new customer
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, address } = body;

    if (!name || !phone) {
      return NextResponse.json({ message: "Nama dan nomor telepon wajib diisi." }, { status: 400 });
    }

    // Check if customer with this phone number already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (existingCustomer) {
      return NextResponse.json({ message: "Nomor telepon sudah digunakan pelanggan lain." }, { status: 409 });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        name,
        phone,
        address,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("[POST_CUSTOMER]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
