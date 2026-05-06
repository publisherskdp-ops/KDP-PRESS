import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

// Book Schema definition (duplicated here for the script to be self-contained or we can import if ts-node supports it)
const BookSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    pricePaperback: { type: Number, default: 0 },
    priceKindle: { type: Number },
    priceHardcover: { type: Number },
    image: { type: String, default: '/assets/images/placeholder-book.png' },
    descriptionHtml: { type: String, default: '<p>No description provided yet.</p>' },
    status: { type: String, default: 'LIVE', index: true },
    language: { type: String },
    published: { type: String },
    imprint: { type: String },
    isbn: { type: String },
    trimSize: { type: String },
    pageCount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB.');

    const booksPath = path.join(process.cwd(), 'data', 'books.json');
    const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

    console.log(`Found ${booksData.length} books to seed.`);

    for (const book of booksData) {
      console.log(`Seeding: ${book.title}`);
      
      const bookData = {
        slug: book.id,
        title: book.title,
        subtitle: book.subtitle,
        author: book.author,
        genre: book.genre,
        rating: book.rating || 0,
        reviews: book.reviews || 0,
        pricePaperback: book.price?.paperback || 0,
        priceKindle: book.price?.kindle,
        priceHardcover: book.price?.hardcover,
        image: book.image,
        descriptionHtml: book.descriptionHtml,
        status: book.status || 'LIVE',
        language: book.language,
        published: book.published,
        imprint: book.imprint,
        isbn: book.isbn,
        trimSize: book.trimSize,
        pageCount: book.pageCount,
      };

      await Book.findOneAndUpdate(
        { slug: bookData.slug },
        bookData,
        { upsert: true, new: true }
      );
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
