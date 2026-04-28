import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'books.json');

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  contributors?: { name: string, role: string }[];
  price: { paperback: number, kindle?: number, hardcover?: number };
  genre: string;
  rating: number;
  reviews: number;
  language?: string;
  published?: string;
  imprint?: string;
  isbn?: string;
  trimSize?: string;
  pageCount?: number;
  image: string;
  descriptionHtml: string;
  luluPrintAssetId?: string;
  luluPodPackageId?: string;
  status: string;
}

export function getAllBooks(): Book[] {
  try {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books.json:', error);
    return [];
  }
}

export function getBookById(id: string): Book | undefined {
  const books = getAllBooks();
  return books.find(b => b.id === id);
}
