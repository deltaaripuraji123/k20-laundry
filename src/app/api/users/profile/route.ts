import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { name, email, oldPassword, newPassword } = body;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Handle password change if both old and new passwords are provided
    if (oldPassword && newPassword) {
      const passwordMatch = await bcrypt.compare(oldPassword, currentUser.password);
      if (!passwordMatch) {
        return new NextResponse("Invalid old password", { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PATCH_PROFILE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
