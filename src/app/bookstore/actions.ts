'use server';

import { getAllBooks, getBookById } from '@/lib/books';

export async function getBooksAction() {
  return getAllBooks();
}

export async function getBookAction(id: string) {
  return getBookById(id);
}
