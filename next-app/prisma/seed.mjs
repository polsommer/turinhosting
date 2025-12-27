import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();

const seedData = JSON.parse(
  await readFile(new URL("./seed-data.json", import.meta.url), "utf-8")
);

const users = Array.isArray(seedData.users) ? seedData.users : [];

for (const user of users) {
  if (!user.email) {
    continue;
  }

  await prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name ?? undefined,
      image: user.image ?? undefined
    },
    create: {
      name: user.name ?? null,
      email: user.email,
      image: user.image ?? null
    }
  });
}

await prisma.$disconnect();
