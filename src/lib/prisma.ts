import { PrismaClient } from "@prisma/client";

// PrismaClient är bunden till Node.js-processen, så vi vill återanvända den
// för att undvika att skapa flera instanser i utvecklingsmiljön
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 