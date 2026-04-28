const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('Using URL:', process.env.DATABASE_URL);
  try {
    const author = await prisma.user.upsert({
      where: { email: 'admin@kdppress.com' },
      update: {},
      create: {
        email: 'admin@kdppress.com',
        name: 'J. Andre Weisbrod',
        role: 'AUTHOR',
      },
    });

    const book = await prisma.book.upsert({
      where: { isbn: 'nvr6v7q' },
      update: {
        status: "LIVE",
        luluPrintAssetId: "nvr6v7q",
        luluPodPackageId: "0600X0900BWSTDPB060UW444GXX",
        price: 14.99,
      },
      create: {
        title: "HELP MY UNBELIEF",
        authorId: author.id,
        category: "Christianity",
        price: 14.99,
        status: "LIVE",
        pageCount: 66,
        trimSize: "6 x 9 in",
        luluPrintAssetId: "nvr6v7q",
        luluPodPackageId: "0600X0900BWSTDPB060UW444GXX",
        descriptionHtml: "<p>A powerful exploration of faith and doubt by J. Andre Weisbrod.</p>",
        coverUrl: "https://placehold.co/400x600?text=HELP+MY+UNBELIEF"
      },
    });

    console.log(`Successfully listed: ${book.title}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
