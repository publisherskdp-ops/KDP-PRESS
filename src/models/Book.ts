import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  genre: string;
  rating: number;
  reviews: number;
  pricePaperback: number;
  priceKindle?: number;
  priceHardcover?: number;
  image: string;
  descriptionHtml: string;
  status: string;
  language?: string;
  published?: string;
  imprint?: string;
  isbn?: string;
  trimSize?: string;
  pageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema = new Schema(
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

// Prevent model recompilation in development
export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
