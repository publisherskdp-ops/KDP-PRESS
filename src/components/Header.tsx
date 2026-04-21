'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, LogIn, Sparkles, BookMarked, Menu, X } from 'lucide-react';
import { useCart } from './CartContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { setIsOpen, cartCount } = useCart();

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg h-16' : 'bg-transparent h-20'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95">
              <Image 
                src="/logo.png" 
                alt="KDP Press Logo" 
                width={120} 
                height={40} 
                className="object-contain w-auto h-10"
                priority
              />
          </div>
          <span className="hidden sm:block text-xl font-black tracking-tighter text-slate-900 uppercase">KDP <span className="text-sky-600">Press</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Home</Link>
          <Link href="/bookstore" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Bookstore</Link>
          <Link href="/about" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">About</Link>
          <Link href="/contact" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact</Link>
          <Link href="/book-publishing" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Book Publishing</Link>
          <Link href="/dashboard" className="text-sm font-black text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={14} />
            Dashboard
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div 
            onClick={() => setIsOpen(true)} 
            className="relative cursor-pointer p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all active:scale-95"
          >
             <ShoppingCart size={20} />
             {cartCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-300">
                 {cartCount}
               </span>
             )}
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/auth/login" className="px-5 py-2.5 text-sm font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2">
              <LogIn size={18} />
              Login
            </Link>
            <Link href="/auth/signup" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-widest">
                Join KDP
            </Link>
          </div>

          <button 
            className="lg:hidden p-2 text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-300">
           <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 uppercase">Home</Link>
           <Link href="/bookstore" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 uppercase">Bookstore</Link>
           <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 uppercase">About</Link>
           <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 uppercase">Contact</Link>
           <Link href="/book-publishing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 uppercase">Book Publishing</Link>
           <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-amber-600 uppercase flex items-center gap-2">
             <Sparkles size={20} />
             Dashboard
           </Link>
           <div className="h-[1px] bg-slate-100" />
           <div className="flex flex-col gap-3">
             <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center font-black text-slate-500 uppercase">Login</Link>
             <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-center">Join KDP Press</Link>
           </div>
        </div>
      )}
    </header>
  );
};

export default Header;
