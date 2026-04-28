'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ChevronDown, Rocket, Sparkles, BookMarked } from 'lucide-react';
import BookCard from '@/components/bookstore/BookCard';
import QuickViewModal from '@/components/bookstore/QuickViewModal';
import { getBooksAction } from './actions';

const ALL_BOOKS = [
  { id: '1', title: 'Echoes of Eternity', author: 'Elena Rivers', genre: 'Mystery & Crime', price: 19.99, rating: 4.8, reviews: 1240, image: '/book_cover_mystery_v2_1775078752710.png', format: 'Paperback' },
  { id: '2', title: 'Digital Heartbeat', author: 'Marcus J. Volt', genre: 'Science Fiction', price: 14.99, rating: 4.5, reviews: 840, image: '/book_cover_scifi_v2_1775078971012.png', format: 'Kindle Edition' },
  { id: '3', title: 'The Crimson Chapter', author: 'S.H. Black', genre: 'Modern Fiction', price: 16.99, rating: 4.7, reviews: 950, image: '/book_cover_thriller_v2_1775078995981.png', format: 'Hardcover' },
  { id: '4', title: 'Midnight Musings', author: 'Lily Thorne', genre: 'Poetry', price: 12.99, rating: 4.6, reviews: 720, image: '/book_cover_romance_v2_1775079015999.png', format: 'Paperback' },
];

const GENRES = ['All Literature', 'Modern Fiction', 'Non-Fiction', 'Mystery & Crime', 'Science Fiction', 'Poetry', 'Business & Growth'];

export default function Bookstore() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All Literature');
  const [sortBy, setSortBy] = useState('Featured');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadBooks() {
      const data = await getBooksAction();
      setBooks(data);
      setLoading(false);
    }
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...books];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (activeGenre !== 'All Literature') {
      result = result.filter(b => b.genre === activeGenre);
    }
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Customer Review') result.sort((a, b) => b.rating - a.rating);
    
    return result;
  }, [query, activeGenre, sortBy]);

  const handleQuickView = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-sky-600 transition-colors">
                <BookMarked size={22} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">KDP <span className="text-sky-600">Press</span></span>
          </Link>

          <div className="flex-1 max-w-2xl relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, author, or genre..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all outline-none text-sm font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <nav className="flex items-center gap-6">
            <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Sign In</button>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                Publish Work
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-20 overflow-hidden hero-gradient">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/50 border border-amber-200 rounded-full text-amber-700 text-xs font-black uppercase tracking-widest">
                    <Sparkles size={14} />
                    Editor's Choice
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                   Unlock a World of <br />
                    <span className="gradient-text">Hidden Stories</span>.
                </h1>
                <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                    Enjoy access to unlimited indie masterpieces. Read and support the hidden gems of the publishing world!
                </p>
                <div className="flex gap-4 pt-4">
                    <button className="px-8 py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-xl shadow-sky-600/20 hover:bg-sky-700 hover:-translate-y-1 transition-all">
                        Browse Top Charts
                    </button>
                    <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold transition-all hover:bg-slate-50">
                        View Deals
                    </button>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                    <Rocket size={16} />
                    <span>Free shipping on orders over $50</span>
                </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
                <div className="absolute inset-0 bg-sky-400/10 blur-[120px] rounded-full" />
                <div className="relative flex justify-center items-end gap-6 h-[500px]">
                    {/* Visual representative of books */}
                    <div className="w-56 aspect-[2/3] bg-white rounded-2xl shadow-2xl rotate-[-12deg] translate-y-12 border border-white/50 animate-float opacity-80 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600')" }} />
                    <div className="w-64 aspect-[2/3] bg-white rounded-2xl shadow-2xl relative z-10 border border-white/50 animate-float bg-cover bg-center overflow-hidden" style={{ animationDelay: '1s', backgroundImage: "url('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400&h=600')" }} />
                    <div className="w-56 aspect-[2/3] bg-white rounded-2xl shadow-2xl rotate-[12deg] translate-y-12 border border-white/50 animate-float opacity-80 bg-cover bg-center overflow-hidden" style={{ animationDelay: '2s', backgroundImage: "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600')" }} />
                </div>
            </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-6 py-12 space-y-10">
        
        {/* Filtering Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
                {GENRES.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                            activeGenre === genre 
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group">
                    <select 
                        className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none cursor-pointer"
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option>Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Customer Review</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
                    <SlidersHorizontal size={20} />
                </button>
            </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-sm">
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                Showing <span className="text-slate-900 italic">{filteredBooks.length} titles</span> for {activeGenre}
            </p>
            {query && (
                <button onClick={() => setQuery('')} className="text-sky-600 font-bold hover:underline">Clear Search</button>
            )}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="py-32 text-center">
            <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Browsing Library...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredBooks.map((book, idx) => (
              <div key={book.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                <BookCard book={{...book, price: book.price.paperback}} onQuickView={handleQuickView} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900">No books found</h3>
             <p className="text-slate-500">We couldn't find any books matching your current filters.</p>
             <button 
                onClick={() => { setActiveGenre('All Literature'); setQuery(''); }} 
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold"
             >
                Reset All Filters
             </button>
          </div>
        )}
      </main>

      {/* Footer Decoration */}
      <footer className="bg-slate-900 text-white py-20 mt-20">
         <div className="max-w-[1600px] mx-auto px-6 text-center space-y-8">
            <h2 className="text-4xl font-black italic tracking-tighter">Stay Inspired.</h2>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">Join 50,000+ authors and readers receiving our curated weekly digests.</p>
            <div className="max-w-md mx-auto flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium" />
                <button className="px-8 py-4 bg-sky-600 rounded-2xl font-bold hover:bg-sky-700 transition-colors">Subscribe</button>
            </div>
         </div>
      </footer>

      {/* Modal */}
      <QuickViewModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
