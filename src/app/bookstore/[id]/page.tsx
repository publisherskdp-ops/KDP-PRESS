'use client';
import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ShoppingCart, 
  Clock, 
  Heart, 
  ChevronLeft, 
  BookOpen, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookMarked
} from 'lucide-react';

// Expanded Mock Book matching the advanced metadata requirements
const mockBooks = [
  {
    id: '1',
    title: 'Echoes of Eternity',
    subtitle: 'The Final Frontier of Time',
    contributors: [
      { name: 'Elena Rivers', role: 'Author' },
      { name: 'Marcus J. Volt', role: 'Editor' },
      { name: 'Sarah Thorne', role: 'Illustrator' }
    ],
    price: { kindle: 9.99, paperback: 19.99, hardcover: 29.99 },
    rating: 4.8,
    reviews: 1240,
    language: 'English',
    published: 'March 12, 2026',
    imprint: 'KDP Press Select',
    isbn: '978-0-123456-47-2',
    trimSize: '6 x 9 inches',
    pageCount: 342,
    seriesTitle: 'The Chronos Saga',
    seriesSequence: 1,
    readingAgeRange: '13-18 years',
    image: '/book_cover_mystery_v2_1775078752710.png',
    genre: 'Mystery & Crime',
    descriptionHtml: "<p><b>A gripping journey into the unknown</b>, where time stands still and the echoes of the past hold the key to the future.</p><p>Elena Rivers crafts a masterpiece of suspense and philosophical exploration that will leave readers questioning reality itself. The answers are hidden in the silence.</p><ul><li>Expansive world-building</li><li>Twists you won't see coming</li><li>Award-nominated conceptual design</li></ul><h4>Praise for Echoes of Eternity</h4><p><i>\"A masterclass in tension...\"</i> - Daily Chronicle</p>"
  }
];

type FormatKey = 'kindle' | 'paperback' | 'hardcover';

export default function BookProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Default to mock data
  const book = mockBooks[0]; // Normally fetch via ID

  const [selectedFormat, setSelectedFormat] = useState<FormatKey>('paperback');
  const [quantity, setQuantity] = useState(1);

  const selectedPrice = book.price[selectedFormat];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-sky-100 selection:text-sky-900 pb-20">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-sky-600 transition-colors shadow-lg">
                <BookMarked size={22} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">KDP <span className="text-sky-600">Press</span></span>
          </Link>

          <nav className="flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <Link href="/bookstore" className="hover:text-sky-600 transition-colors flex items-center gap-1 group">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Store
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-slate-300">Product #S829-192</span>
          </nav>

          <button className="px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all">
             My Library
          </button>
        </div>
      </header>

      {/* Hero Breadcrumb / Background Blur */}
      <div className="relative overflow-hidden h-40 hero-gradient flex items-center">
         <div className="max-w-[1400px] mx-auto w-full px-6">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                <Link href="/bookstore" className="hover:text-sky-600">Store</Link>
                <ArrowRight size={14} />
                <Link href="/bookstore" className="hover:text-sky-600 uppercase tracking-tighter">{book.genre}</Link>
                <ArrowRight size={14} />
                <span className="text-slate-900 italic font-black">{book.title}</span>
            </div>
         </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 -mt-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Cover Display (Left) */}
          <div className="w-full lg:w-[450px] flex-shrink-0 animate-in fade-in slide-in-from-left-12 duration-700">
             <div className="relative group p-4 glass-card rounded-[2.5rem] shadow-2xl border border-white/60">
                <div className="aspect-[2/3] rounded-[2rem] overflow-hidden shadow-inner relative hover-perspective">
                   <div 
                    className="absolute inset-0 bg-slate-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url(${book.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                   />
                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                     Original Edition
                   </div>
                </div>
                
                {/* Look inside teaser */}
                <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-sky-300 hover:text-sky-600 transition-all flex items-center justify-center gap-2 group">
                   <BookOpen size={20} className="group-hover:rotate-12 transition-transform" />
                   Sample Look Inside
                </button>
             </div>

             <div className="mt-8 flex justify-center gap-4 text-slate-400">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:text-sky-600 hover:border-sky-100 transition-all">f</div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:text-sky-400 hover:border-sky-100 transition-all">𝕏</div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:text-pink-600 hover:border-pink-100 transition-all">in</div>
             </div>
          </div>

          {/* Core Content (Right/Center) */}
          <div className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="space-y-6">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-sky-100">
                     <Sparkles size={12} />
                     Bestseller in {book.genre}
                   </div>
                   <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.05] mb-2">{book.title}</h1>
                   {book.subtitle && <p className="text-2xl text-slate-500 font-medium italic mb-4">{book.subtitle}</p>}
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="flex text-amber-500">
                            {[1,2,3,4,5].map(s => (
                                <Star key={s} size={18} fill={s <= Math.round(book.rating) ? "currentColor" : "none"} strokeWidth={1.5} />
                            ))}
                        </div>
                        <span className="text-lg font-bold text-slate-900">{book.rating}</span>
                        <span className="text-sm text-slate-400 font-medium group-hover:text-sky-600 group-hover:underline transition-all">({book.reviews.toLocaleString()} global reviews)</span>
                    </div>
                </div>

                <div className="flex gap-2 text-sm">
                   {book.contributors.map((c, i) => (
                    <div key={i} className="flex flex-col group cursor-pointer">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{c.role}</span>
                        <span className="text-slate-900 font-bold group-hover:text-sky-600 transition-colors underline-offset-4 group-hover:underline">{c.name}</span>
                    </div>
                   ))}
                </div>

                <div className="h-[1px] w-full bg-slate-200 my-8" />

                {/* Format Selection (Premium) */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Select Edition</h3>
                    <div className="flex flex-wrap gap-4">
                       {[
                         { id: 'kindle', label: 'E-Book', desc: 'Instant Delivery', price: book.price.kindle },
                         { id: 'paperback', label: 'Paperback', desc: 'Premium Print', price: book.price.paperback },
                         { id: 'hardcover', label: 'Hardcover', desc: 'Limited Bound', price: book.price.hardcover }
                       ].map(fmt => (
                         <button 
                          key={fmt.id}
                          onClick={() => setSelectedFormat(fmt.id as FormatKey)}
                          className={`flex-1 min-w-[160px] p-6 rounded-3xl text-left transition-all relative overflow-hidden group border-2 ${
                            selectedFormat === fmt.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                            : 'bg-white text-slate-900 border-slate-200 hover:border-sky-200 hover:bg-sky-50/20'
                          }`}
                         >
                            <span className="block text-sm font-black uppercase tracking-widest mb-1 opacity-60">{fmt.label}</span>
                            <span className="block text-2xl font-black mb-1">${fmt.price.toFixed(2)}</span>
                            <span className="block text-[10px] font-bold opacity-50 uppercase tracking-tighter">{fmt.desc}</span>
                            {selectedFormat === fmt.id && <div className="absolute top-2 right-2"><CheckCircle2 size={24} className="text-sky-400" /></div>}
                         </button>
                       ))}
                    </div>
                </div>

                <div className="mt-12 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">About this book</h3>
                  <div 
                    className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: book.descriptionHtml }}
                  />
                </div>

                <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white/50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="space-y-1">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Length</span>
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                            <BookOpen size={16} className="text-sky-600" />
                            {book.pageCount} pages
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Language</span>
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                            <Globe size={16} className="text-sky-600" />
                            {book.language}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">ISBN</span>
                        <div className="flex items-center gap-2 text-slate-900 font-bold italic">
                            {book.isbn}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Imprint</span>
                        <div className="flex items-center gap-2 text-slate-900 font-black">
                            {book.imprint}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Buy Box (Floating Right) */}
          <aside className="w-full lg:w-[320px] sticky top-28 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl animate-in fade-in slide-in-from-right-12 duration-700 delay-300">
             <div className="space-y-8">
                <div className="space-y-2">
                    <div className="flex items-start">
                        <span className="text-2xl font-bold text-sky-600 mt-[4px] font-display">$</span>
                        <span className="text-6xl font-black text-slate-900 tracking-tighter">{Math.floor(selectedPrice)}</span>
                        <span className="text-2xl font-bold text-slate-900 mt-[4px] font-display">{(selectedPrice % 1).toFixed(2).substring(2)}</span>
                    </div>
                    <p className="text-green-600 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} />
                        In Stock & Ready
                    </p>
                </div>

                <div className="space-y-3">
                   <div className="relative group">
                        <select className="w-full bg-slate-100 border-none px-6 py-4 rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-sky-500/30 transition-all cursor-pointer">
                            <option>Qty: 1</option>
                            <option>Qty: 2</option>
                            <option>Qty: 3</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><ChevronLeft size={16} className="-rotate-90" /></div>
                   </div>
                   <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/30 hover:bg-sky-600 transition-all active:scale-95 group">
                        <ShoppingCart size={20} className="group-hover:translate-x-1 transition-transform" />
                        Add to Library
                   </button>
                   <button className="w-full py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                        Buy Now
                   </button>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                   <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <ShieldCheck size={16} className="text-sky-600" />
                       Secure Transaction
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <Globe size={16} className="text-sky-600" />
                       Global Delivery
                   </div>
                </div>

                <button className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                    <Heart size={16} />
                    Save to Wishlist
                </button>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
