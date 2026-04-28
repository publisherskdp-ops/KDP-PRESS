import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function test() {
  try {
    console.log('Testing connection...');
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
