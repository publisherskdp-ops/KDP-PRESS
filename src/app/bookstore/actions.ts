'use server';

import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export async function getBooksAction() {
  try {
    await dbConnect();
    const books = await Book.find({ status: 'LIVE' }).lean();
    
    // Map DB fields back to the expected format for the frontend
    return books.map((book: any) => ({
      id: book.slug,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      genre: book.genre,
      rating: book.rating,
      reviews: book.reviews,
      price: {
        paperback: book.pricePaperback,
        kindle: book.priceKindle,
        hardcover: book.priceHardcover
      },
      image: book.image,
      descriptionHtml: book.descriptionHtml,
      status: book.status,
      language: book.language,
      published: book.published,
      imprint: book.imprint,
      isbn: book.isbn,
      trimSize: book.trimSize,
      pageCount: book.pageCount
    }));
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

export async function getBookAction(id: string) {
  try {
    await dbConnect();
    const book = await Book.findOne({ slug: id }).lean() as any;

    if (!book) return undefined;

    return {
      id: book.slug,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      genre: book.genre,
      rating: book.rating,
      reviews: book.reviews,
      price: {
        paperback: book.pricePaperback,
        kindle: book.priceKindle,
        hardcover: book.priceHardcover
      },
      image: book.image,
      descriptionHtml: book.descriptionHtml,
      status: book.status,
      language: book.language,
      published: book.published,
      imprint: book.imprint,
      isbn: book.isbn,
      trimSize: book.trimSize,
      pageCount: book.pageCount
    };
  } catch (error) {
    console.error(`Failed to fetch book with id ${id}:`, error);
    return undefined;
  }
}

export async function publishBookAction(formData: {
  fullName: string;
  email: string;
  title: string;
  genre: string;
}) {
  const slug = formData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  try {
    await dbConnect();
    const book = await Book.create({
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      title: formData.title,
      author: formData.fullName,
      genre: formData.genre,
      status: 'LIVE', // Setting to LIVE so it shows up in bookstore immediately
    });
    return { success: true, book: JSON.parse(JSON.stringify(book)) };
  } catch (error) {
    console.error('Failed to publish book:', error);
    return { success: false, error: 'Failed to save to database' };
  }
}
