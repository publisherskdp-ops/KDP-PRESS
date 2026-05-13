import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  email?: string;
  genre: string;
  rating: number;
  reviews: number;
  pricePaperback: number;
  priceEbook?: number;
  priceHardcover?: number;
  image: string; // Storefront Display Image
  coverPdf?: string; // Print-ready Book Cover PDF
  manuscriptUrl?: string; // Interior PDF
  luluPaperbackId?: string; // Lulu POD ID for Paperback
  luluHardcoverId?: string; // Lulu POD ID for Hardcover
  descriptionHtml: string;
  status: string;
  language?: string;
  published?: string;
  imprint?: string;
  isbn?: string;
  pageCount?: number;
  specification?: 'ebook' | 'paperback' | 'hardcover' | 'all';
  
  // Format-Specific Physical Specifications
  paperbackTrimSize?: string;
  paperbackCoverFinish?: string;
  paperbackInteriorColor?: string;
  
  hardcoverTrimSize?: string;
  hardcoverCoverFinish?: string;
  hardcoverInteriorColor?: string;

  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    author: { type: String, required: true },
    email: { type: String },
    genre: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    pricePaperback: { type: Number, default: 0 },
    priceEbook: { type: Number },
    priceHardcover: { type: Number },
    image: { type: String, default: '/assets/images/placeholder-book.png' },
    coverPdf: { type: String },
    manuscriptUrl: { type: String },
    luluPaperbackId: { type: String },
    luluHardcoverId: { type: String },
    descriptionHtml: { type: String, default: '<p>No description provided yet.</p>' },
    status: { type: String, default: 'LIVE', index: true },
    language: { type: String },
    published: { type: String },
    imprint: { type: String },
    isbn: { type: String },
  pageCount: { type: Number },
    specification: { type: String, enum: ['ebook', 'paperback', 'hardcover', 'all'], default: 'ebook' },

    // Format-Specific Customizations
    paperbackTrimSize: { type: String, default: '6 x 9' },
    paperbackCoverFinish: { type: String, default: 'Gloss' },
    paperbackInteriorColor: { type: String, default: 'Black & White Standard' },

    hardcoverTrimSize: { type: String, default: '6 x 9' },
    hardcoverCoverFinish: { type: String, default: 'Gloss' },
    hardcoverInteriorColor: { type: String, default: 'Black & White Standard' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);