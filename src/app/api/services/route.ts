import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole, ServiceType } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });
    
    // Manually stringify to handle BigInt
    return new NextResponse(
      JSON.stringify(services, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GET_SERVICES]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "Unauthorized. Only ADMIN can manage services." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, price, type, description } = body;

    if (!name || !price || !type) {
      return NextResponse.json({ message: "Nama, harga, dan tipe wajib diisi." }, { status: 400 });
    }

    const existingService = await prisma.service.findUnique({
      where: { name },
    });

    if (existingService) {
      return NextResponse.json({ message: "Nama layanan sudah ada." }, { status: 409 });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        price: parseFloat(price),
        type: type as ServiceType,
        description,
      },
    });

    return new NextResponse(
      JSON.stringify(newService, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[POST_SERVICE]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
