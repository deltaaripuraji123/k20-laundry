import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole, ServiceType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({});
  }
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.KASIR)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { serviceId } = await params;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    return new NextResponse(
      JSON.stringify(service, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GET_SERVICE_BY_ID]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { serviceId } = await params;
    const body = await req.json();
    const { name, price, type, description } = body;

    if (!name || !price || !type) {
      return NextResponse.json({ message: "Nama, harga, dan tipe wajib diisi." }, { status: 400 });
    }

    const existingService = await prisma.service.findFirst({
      where: {
        name,
        NOT: { id: serviceId }
      },
    });

    if (existingService) {
      return NextResponse.json({ message: "Nama layanan sudah digunakan." }, { status: 409 });
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        price: parseFloat(price),
        type: type as ServiceType,
        description,
      },
    });

    return new NextResponse(
      JSON.stringify(updatedService, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[PUT_SERVICE]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { serviceId } = await params;

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_SERVICE]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
