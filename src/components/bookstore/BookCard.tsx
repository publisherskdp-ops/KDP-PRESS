'use client';
import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye } from 'lucide-react';

interface BookProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  format: string;
}

export default function BookCard({ book, onQuickView }: { book: BookProps, onQuickView: (b: BookProps) => void }) {
  return (
    <div className="group relative flex flex-col h-full glass-card rounded-2xl overflow-hidden hover-perspective p-4 border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500">
      {/* Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 backdrop-blur-md border border-amber-500/20 rounded-full">
          Featured
        </span>
      </div>

      {/* Book Cover Container */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-slate-100 to-slate-200">
        <div 
          style={{ backgroundImage: `url(${book.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
          className="absolute inset-0 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Quick Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/40 backdrop-blur-[2px]">
          <button 
            onClick={() => onQuickView(book)}
            className="p-3 bg-white text-slate-900 rounded-full hover:bg-sky-500 hover:text-white transition-colors shadow-lg"
            title="Quick View"
          >
            <Eye size={20} />
          </button>
          <button 
            className="p-3 bg-white text-slate-900 rounded-full hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col">
        <Link href={`/bookstore/${book.id}`} className="hover:text-sky-600 transition-colors">
          <h2 className="text-lg font-bold text-slate-900 leading-snug mb-1 line-clamp-2 font-display">{book.title}</h2>
        </Link>
        <p className="text-sm text-slate-500 mb-3 font-medium">{book.author}</p>
        
        {/* Review & Stats */}
        <div className="flex items-center gap-2 mb-4 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center text-amber-500">
            <Star size={14} fill="currentColor" strokeWidth={0} />
            <span className="ml-1 text-sm font-bold text-slate-800">{book.rating}</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <span className="text-xs text-slate-500 font-semibold uppercase">{book.format}</span>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-start">
            <span className="text-sm font-bold text-sky-600 mt-[2px]">$</span>
            <span className="text-2xl font-black text-slate-900">{Math.floor(book.price)}</span>
            <span className="text-sm font-bold text-slate-900 mt-[2px]">{(book.price % 1).toFixed(2).substring(2)}</span>
          </div>
          <button className="text-xs font-bold uppercase tracking-wider text-sky-600 hover:underline">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
