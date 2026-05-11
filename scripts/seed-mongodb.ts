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

// Book Schema definition
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
    priceEbook: { type: Number },
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

const SAMPLE_BOOKS = [
  {
    slug: 'atomic-habits-demo',
    title: 'Atomic Habits',
    subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    genre: 'Business & Growth',
    rating: 4.8,
    reviews: 125400,
    pricePaperback: 11.98,
    priceEbook: 12.99,
    priceHardcover: 27.00,
    image: 'https://m.media-amazon.com/images/I/81YkqygElKW._AC_UF1000,1000_QL80_.jpg',
    descriptionHtml: '<p>Atomic Habits will reshape the way you think about progress and success, and give you the tools and strategies you need to transform your habits—whether you are a team looking to win a championship, an organization hoping to redefine an industry, or simply an individual who wishes to quit smoking, lose weight, reduce stress, or achieve any other goal.</p>',
    status: 'LIVE',
    language: 'English',
    pageCount: 320
  },
  {
    slug: 'the-psychology-of-money-demo',
    title: 'The Psychology of Money',
    subtitle: 'Timeless lessons on wealth, greed, and happiness',
    author: 'Morgan Housel',
    genre: 'Business & Growth',
    rating: 4.7,
    reviews: 54200,
    pricePaperback: 14.39,
    priceEbook: 9.99,
    priceHardcover: 24.99,
    image: 'https://m.media-amazon.com/images/I/71TRu7NoS6L._AC_UF1000,1000_QL80_.jpg',
    descriptionHtml: '<p>Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.</p>',
    status: 'LIVE',
    language: 'English',
    pageCount: 256
  },
  {
    slug: 'deep-work-demo',
    title: 'Deep Work',
    subtitle: 'Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    genre: 'Business & Growth',
    rating: 4.6,
    reviews: 28900,
    pricePaperback: 15.99,
    priceEbook: 11.99,
    priceHardcover: 28.00,
    image: 'https://m.media-amazon.com/images/I/417yjF+E5zL._SY445_SX342_.jpg',
    descriptionHtml: '<p>Deep work is the ability to focus without distraction on a cognitively demanding task. It is a skill that allows you to quickly master complicated information and produce better results in less time.</p>',
    status: 'LIVE',
    language: 'English',
    pageCount: 304
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB.');

    // Seed from books.json if exists
    const booksPath = path.join(process.cwd(), 'data', 'books.json');
    if (fs.existsSync(booksPath)) {
      const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
      console.log(`Found ${booksData.length} books in books.json to seed.`);
      for (const book of booksData) {
        const bookData = {
          slug: book.id,
          title: book.title,
          subtitle: book.subtitle,
          author: book.author,
          genre: book.genre,
          rating: book.rating || 0,
          reviews: book.reviews || 0,
          pricePaperback: book.price?.paperback || 0,
          priceEbook: book.price?.kindle || book.price?.ebook || 0,
          priceHardcover: book.price?.hardcover || 0,
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
        await Book.findOneAndUpdate({ slug: bookData.slug }, bookData, { upsert: true });
      }
    }

    // Seed Sample Books
    console.log(`Seeding ${SAMPLE_BOOKS.length} Amazon-style sample books...`);
    for (const book of SAMPLE_BOOKS) {
      await Book.findOneAndUpdate({ slug: book.slug }, book, { upsert: true });
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
