'use client';
import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, BookOpen, Clock, Heart } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function BookCard({ book, onQuickView }: { book: any, onQuickView: (b: any) => void }) {
  const { addToCart } = useCart();
  
  // Default price to show is ebook, then paperback, then hardcover
  const displayPrice = book.price.ebook || book.price.paperback || book.price.hardcover || 0;
  const isEbook = !!book.price.ebook;
  
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

      {/* Book Cover Container - "Short" Aspect Ratio */}
      <div className="relative w-full aspect-[4/5] overflow-hidden group-hover:brightness-95 transition-all duration-500">
        {/* Background Blur Effect */}
        <div 
          className="absolute inset-0 scale-110 blur-xl opacity-20 transition-transform duration-700 group-hover:scale-125"
          style={{ backgroundImage: `url(${book.image})`, backgroundSize: 'cover' }}
        />
        
        {/* Main Image */}
        <div 
          style={{ backgroundImage: `url(${book.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
          className="absolute inset-4 rounded-xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 ease-out z-10"
        />

        {/* Badge */}
        <div className="absolute bottom-6 left-6 z-20">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-white shadow-lg rounded-full">
            Featured
          </span>
        </div>
        
        {/* Add to Cart Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={() => addToCart({
              id: book.id,
              title: `${book.title}${isEbook ? ' (eBook)' : ''}`,
              price: displayPrice,
              quantity: 1,
              image: book.image,
              type: isEbook ? 'ebook' : 'paperback' // Assuming the cart handles types or just for metadata
            })}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black uppercase tracking-tighter text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-0.5 rounded">
            {book.genre || 'Literature'}
          </span>
        </div>
        <Link href={`/bookstore/${book.id}`} className="block group/title">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2 group-hover/title:text-sky-600 transition-colors">
            {book.title}
          </h2>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium italic">by {book.author}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
            <BookOpen size={12} className="text-slate-400" />
            <span>{book.pageCount || 280} Pages</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
            <Clock size={12} className="text-slate-400" />
            <span>{new Date().getFullYear()} Edition</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{isEbook ? 'eBook' : 'Paperback'} Price</span>
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

