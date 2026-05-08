import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET store settings
export async function GET() {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.storeSettings.create({
        data: { id: "default" },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[GET_SETTINGS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// UPDATE store settings
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { name, phone, address, website, tax } = body;

    const updatedSettings = await prisma.storeSettings.update({
      where: { id: "default" },
      data: {
        name,
        phone,
        address,
        website,
        tax: parseFloat(tax),
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("[PATCH_SETTINGS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
