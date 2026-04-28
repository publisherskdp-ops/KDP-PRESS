// Prisma is currently disabled due to local environment configuration issues with Prisma 7 + MongoDB.
// Using local file-based database (src/lib/books.ts) instead for now.

/*
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
*/

export const prisma = null as any;
