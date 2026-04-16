import { create } from 'zustand'

export type FormatStatus = 'NONE' | 'DRAFT' | 'IN_REVIEW' | 'LIVE'

export interface FormatData {
  status: FormatStatus
  price?: number
  updatedAt?: string
}

export interface BookState {
  id: string
  title: string
  subtitle?: string
  author: string
  coverUrl?: string
  
  kindle: FormatData
  paperback: FormatData
  hardcover: FormatData
}

interface BookshelfStore {
  books: BookState[]
  addBook: (book: BookState) => void
  updateFormatStatus: (bookId: string, format: 'kindle' | 'paperback' | 'hardcover', data: FormatData) => void
}

export const useBookshelfStore = create<BookshelfStore>((set) => ({
  books: [
    {
       id: 'mock-1',
       title: 'Sunflower Reflections',
       author: 'A. D. Morse',
       coverUrl: '/book_cover_mystery_v2_1775078752710.png',
       kindle: { status: 'NONE' },
       paperback: { status: 'IN_REVIEW', price: 15.00, updatedAt: 'April 8, 2026' },
       hardcover: { status: 'IN_REVIEW', price: 30.00, updatedAt: 'April 8, 2026' }
    },
    {
       id: 'mock-2',
       title: 'Sunflower Reflections: A journal for hope and healing',
       author: 'A. D. Morse',
       coverUrl: '/book_cover_scifi_v2_1775078971012.png',
       kindle: { status: 'NONE' },
       paperback: { status: 'DRAFT', updatedAt: 'October 9, 2025' },
       hardcover: { status: 'NONE' }
    }
  ],
  addBook: (book) => set((state) => ({ books: [book, ...state.books] })),
  updateFormatStatus: (bookId, format, data) => set((state) => ({
    books: state.books.map(b => b.id === bookId ? { ...b, [format]: data } : b)
  }))
}))
