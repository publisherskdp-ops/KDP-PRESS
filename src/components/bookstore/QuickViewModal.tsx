'use client';
import React from 'react';
import { X, Star, ShoppingCart, Info, BookOpen, Clock, Heart } from 'lucide-react';
import { useCart } from '@/components/CartContext';

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

export default function QuickViewModal({ book, isOpen, onClose }: { book: BookProps | null, isOpen: boolean, onClose: () => void }) {
  const { addToCart } = useCart();
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-8 border border-white/40 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full transition-colors z-20"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Cover Display */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl animate-float">
            <div 
              style={{ backgroundImage: `url(${book.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
              className="absolute inset-0"
            />
            {/* Glass decoration */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
          </div>

          {/* Details Section */}
          <div className="flex flex-col h-full">
            <p className="text-sm font-bold text-sky-600 uppercase tracking-widest mb-2 font-display">{book.genre}</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight mb-2">{book.title}</h2>
            <p className="text-xl text-slate-600 mb-6 font-medium">By <span className="text-slate-900 font-bold">{book.author}</span></p>
            
            <div className="flex items-center gap-6 mb-8 text-sm">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center text-amber-500 font-bold border border-amber-500/20 px-2 py-1 bg-amber-500/5 rounded-lg">
                        <Star size={16} fill="currentColor" strokeWidth={0} className="mr-1" />
                        <span>{book.rating}</span>
                    </div>
                    <span className="text-[10px] text-center text-slate-400 font-bold">{book.reviews.toLocaleString()} reviews</span>
                </div>
                
                <div className="h-10 w-[1px] bg-slate-200" />
                
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-800 text-sm">{book.format}</span>
                    <span className="text-[10px] text-center text-slate-400 font-bold uppercase">Format</span>
                </div>

                <div className="h-10 w-[1px] bg-slate-200" />

                <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-800 text-sm">Digital & Print</span>
                    <span className="text-[10px] text-center text-slate-400 font-bold uppercase">Availability</span>
                </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8 flex-1 border-l-4 border-sky-400 pl-4 py-2 italic font-medium bg-sky-50/30 rounded-r-lg">
                "Experience a tale of unimaginable depth and emotion. Digital Heartbeat explores the intersection of humanity and technology in a world that never sleeps..."
            </p>

            {/* Actions */}
             <div className="mt-auto space-y-4">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-start">
                    <span className="text-xl font-bold text-sky-600 mt-[4px]">$</span>
                    <span className="text-5xl font-black text-slate-900">{Math.floor(book.price)}</span>
                    <span className="text-[1.5rem] font-bold text-slate-900 mt-[4px]">{(book.price % 1).toFixed(2).substring(2)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600 font-bold flex items-center justify-end"><Clock size={12} className="mr-1" /> In Stock</p>
                    <p className="text-xs text-slate-400 font-semibold tracking-tighter">VAT included where applicable</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      addToCart({
                        id: book.id,
                        title: book.title,
                        price: book.price,
                        quantity: 1,
                        image: book.image
                      });
                      onClose();
                    }}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl hover:bg-sky-600 transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-sky-500/20"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button className="p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-sm">
                    <Heart size={20} />
                  </button>
               </div>

               <a href={`/bookstore/${book.id}`} className="block text-center text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest pt-2">
                 View Full Product Details
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
