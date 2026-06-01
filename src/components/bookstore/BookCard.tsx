'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, BookOpen, Clock, Heart, Check } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function BookCard({ book, onQuickView }: { book: any, onQuickView: (b: any) => void }) {
  const { addToCart } = useCart();

  // Determine available formats
  const hasEbook = !!book.price.ebook;
  const hasPaperback = !!book.price.paperback;
  const hasHardcover = !!book.price.hardcover;

  // State for selected format on the card
  const [selectedFormat, setSelectedFormat] = useState<'ebook' | 'paperback' | 'hardcover'>(
    hasEbook ? 'ebook' : (hasPaperback ? 'paperback' : 'hardcover')
  );

  const displayPrice = book.price[selectedFormat] || 0;

  const handleAddToCart = () => {
    addToCart({
      id: `${book.id}-${selectedFormat}`,
      title: book.title,
      price: displayPrice,
      quantity: 1,
      image: book.image,
      format: selectedFormat
    });
  };

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 border border-slate-100 dark:border-slate-800">
      {/* Action Buttons Overlay - Floating */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        <button
          className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 rounded-full shadow-lg hover:bg-sky-500 hover:text-white transition-all transform hover:scale-110"
          title="Wishlist"
        >
          <Heart size={18} />
        </button>
        <button
          onClick={() => onQuickView(book)}
          className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 rounded-full shadow-lg hover:bg-sky-500 hover:text-white transition-all transform hover:scale-110"
          title="Quick View"
        >
          <Eye size={18} />
        </button>
      </div>

      {/* Book Cover Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden group-hover:brightness-95 transition-all duration-500"
         style={{ backgroundImage: `url("${book.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute bottom-6 left-6 z-20">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-white shadow-lg rounded-full">
            {book.genre || 'Literature'}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={handleAddToCart}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col">

        <Link href={`/bookstore/${book.id}`} className="block group/title">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2 group-hover/title:text-sky-600 transition-colors">
            {book.title}
          </h2>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium italic">by {book.author}</p>

        {/* Format Selector Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hasEbook && (
            <button
              onClick={() => setSelectedFormat('ebook')}
              className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all flex items-center gap-1 border ${selectedFormat === 'ebook'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
            >
              {selectedFormat === 'ebook' && <Check size={8} />}
              eBook
            </button>
          )}
          {hasPaperback && (
            <button
              onClick={() => setSelectedFormat('paperback')}
              className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all flex items-center gap-1 border ${selectedFormat === 'paperback'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
            >
              {selectedFormat === 'paperback' && <Check size={8} />}
              Paperback
            </button>
          )}
          {hasHardcover && (
            <button
              onClick={() => setSelectedFormat('hardcover')}
              className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all flex items-center gap-1 border ${selectedFormat === 'hardcover'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
            >
              {selectedFormat === 'hardcover' && <Check size={8} />}
              Hardcover
            </button>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {selectedFormat === 'ebook' ? 'eBook' : (selectedFormat === 'hardcover' ? 'Hardcover' : 'Paperback')} Price
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">$</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{Math.floor(displayPrice)}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">.{(displayPrice % 1).toFixed(2).substring(2)}</span>
            </div>
          </div>

          <Link
            href={`/bookstore/${book.id}`}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl transition-colors group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20"
          >
            <BookOpen size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

