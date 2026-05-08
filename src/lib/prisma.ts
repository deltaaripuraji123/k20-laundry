import { PrismaClient } from "@prisma/client";

// Polyfill for BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (process.env.NEXT_PHASE === "phase-production-build"
    ? ({} as any)
    : new PrismaClient({
        log: ["error"],
      }));

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
