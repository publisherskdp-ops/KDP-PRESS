'use client';
import React, { useState } from 'react';
import { X, Star, ShoppingCart, Info, BookOpen, Clock, Heart, Book as BookIcon, Tablet, Bookmark, Sparkles } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function QuickViewModal({ book, isOpen, onClose }: { book: any | null, isOpen: boolean, onClose: () => void }) {
  const { addToCart } = useCart();
  const [selectedFormat, setSelectedFormat] = useState<'paperback' | 'ebook' | 'hardcover'>('paperback');

  if (!isOpen || !book) return null;

  const price = book.price[selectedFormat] || book.price.paperback || book.price.ebook || book.price.hardcover || 0;

  const formats = [
    { id: 'paperback', label: 'Paperback', icon: <BookIcon size={16} />, price: book.price.paperback },
    { id: 'ebook', label: 'eBook', icon: <Tablet size={16} />, price: book.price.ebook },
    { id: 'hardcover', label: 'Hardcover', icon: <Bookmark size={16} />, price: book.price.hardcover },
  ].filter(f => f.price !== undefined);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/40 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full transition-all z-20 active:scale-90"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Cover Display */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <div
                style={{ backgroundImage: `url(${book.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Pages</p>
                <p className="text-sm font-bold text-slate-900">{book.pageCount || '---'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Language</p>
                <p className="text-sm font-bold text-slate-900">{book.language || 'English'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Rating</p>
                <p className="text-sm font-bold text-slate-900">{book.rating}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full">
            <div className="space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
                <Sparkles size={12} />
                {book.genre}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tight">{book.title}</h2>
              {book.subtitle && <p className="text-xl text-slate-400 font-medium italic">{book.subtitle}</p>}
              <p className="text-xl text-slate-500 font-medium">By <span className="text-slate-900 font-black underline decoration-sky-500/30 underline-offset-4">{book.author}</span></p>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Info size={12} /> Synopsis
              </h4>
              <div
                className="text-slate-600 leading-relaxed text-lg prose prose-sky max-w-none"
                dangerouslySetInnerHTML={{ __html: book.descriptionHtml || "<p>Explore a new journey in literature...</p>" }}
              />
            </div>

            {/* Format Selection */}
            <div className="space-y-4 mb-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Format</h4>
              <div className="flex flex-wrap gap-3">
                {formats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id as any)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-bold ${selectedFormat === f.id
                        ? 'border-sky-600 bg-sky-50 text-sky-600'
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                    <span className="ml-2 opacity-60">${f.price?.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-8 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start">
                  <span className="text-xl font-bold text-sky-600 mt-[6px]">$</span>
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">{Math.floor(price)}</span>
                  <span className="text-2xl font-bold text-slate-900 mt-[6px]">{(price % 1).toFixed(2).substring(2)}</span>
                </div>

                <div className="flex gap-3">
                  <button className="p-5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm active:scale-95">
                    <Heart size={24} />
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: `${book.id}-${selectedFormat}`,
                        title: `${book.title} (${selectedFormat})`,
                        price: price,
                        quantity: 1,
                        image: book.image
                      });
                      onClose();
                    }}
                    className="flex-1 sm:min-w-[240px] py-5 bg-slate-900 text-white rounded-2xl hover:bg-sky-600 transition-all duration-300 font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:shadow-sky-500/20 active:scale-[0.98]"
                  >
                    <ShoppingCart size={22} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
