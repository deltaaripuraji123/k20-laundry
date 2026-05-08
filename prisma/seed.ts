import { UserRole, ServiceType } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@k20laundry.com" },
    update: {},
    create: {
      email: "admin@k20laundry.com",
      name: "Admin K20Laundry",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const services = [
    { name: "Cuci Kiloan", price: 7000, type: ServiceType.KILOAN },
    { name: "Cuci + Setrika", price: 9000, type: ServiceType.KILOAN },
    { name: "Dry Clean", price: 15000, type: ServiceType.SATUAN },
    { name: "Setrika Saja", price: 5000, type: ServiceType.KILOAN },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  console.log("Database has been seeded 🌱");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
