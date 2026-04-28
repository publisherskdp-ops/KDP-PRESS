const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not found in .env.local');
    return;
  }
  
  const client = new MongoClient(url);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db();
    
    const usersCollection = db.collection('User');
    const booksCollection = db.collection('Book');

    console.log('Finding or creating author...');
    let author = await usersCollection.findOne({ email: 'admin@kdppress.com' });
    
    if (!author) {
      const result = await usersCollection.insertOne({
        email: 'admin@kdppress.com',
        name: 'J. Andre Weisbrod',
        role: 'AUTHOR',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      author = { _id: result.insertedId };
    }

    console.log('Upserting book: HELP MY UNBELIEF...');
    const bookData = {
      title: "HELP MY UNBELIEF",
      isbn: "nvr6v7q",
      authorId: author._id,
      category: "Christianity",
      price: 14.99,
      status: "LIVE",
      pageCount: 66,
      trimSize: "6 x 9 in",
      luluPrintAssetId: "nvr6v7q",
      luluPodPackageId: "0600X0900BWSTDPB060UW444GXX",
      descriptionHtml: "<p><b>A powerful exploration of faith and doubt</b>. J. Andre Weisbrod takes readers on a profound journey through the complexities of belief in the modern world.</p>",
      coverUrl: "https://placehold.co/400x600?text=HELP+MY+UNBELIEF",
      language: "English",
      imprint: "Independently Published",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await booksCollection.updateOne(
      { isbn: "nvr6v7q" },
      { $set: bookData },
      { upsert: true }
    );

    console.log('Successfully listed "HELP MY UNBELIEF" in the database!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seed();
