import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client"; // Import UserRole from Prisma client

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole; // Add role to the Session user
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole; // Add role to the User type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole; // Add role to the JWT type
  }
}
