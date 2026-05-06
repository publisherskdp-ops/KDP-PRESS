'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight, Sparkles, BookOpen, LayoutDashboard, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ThankYouPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-12">
            
            {/* Success Animation Area */}
            <div className="relative">
              <div className="absolute inset-0 bg-sky-400/20 blur-[60px] rounded-full animate-pulse" />
              <div className="relative z-10 w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl border border-white flex items-center justify-center text-sky-600 animate-in zoom-in duration-700">
                <CheckCircle2 size={64} strokeWidth={2.5} />
              </div>
              {mounted && (
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-lg animate-bounce delay-300">
                  <Sparkles size={24} />
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                Submission<br /><span className="gradient-text italic">Received!</span>.
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium">
                Your journey towards becoming a published author just took a giant leap forward. Our team of experts will review your details and reach out within 24 hours.
              </p>
            </div>


            {/* Support Callout */}
            <div className="w-full max-w-2xl p-8 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
               <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 flex-shrink-0">
                  <Heart size={32} />
               </div>
               <div className="text-left flex-1">
                  <h4 className="text-lg font-black text-slate-900">Need immediate help?</h4>
                  <p className="text-slate-500 font-medium">Our elite support desk is available 24/7 to answer any technical queries.</p>
               </div>
               <Link href="/contact" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-sky-600 transition-all active:scale-95 whitespace-nowrap">
                  Contact Support
               </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
