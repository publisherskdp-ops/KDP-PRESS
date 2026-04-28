'use client';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Heart, Globe, Target, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-24 overflow-hidden hero-gradient">
         <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-amber-100 animate-in fade-in slide-in-from-top-4 duration-700">
                <Sparkles size={12} />
                Est. 2026
            </div>
<h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
    Readers’ Heaven.<br />
    <span className="gradient-text italic">Indie Authors’ Hub</span>.
</h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000">
               KDP Press empowers writers—new and experienced—to publish freely, own their work completely, and connect with readers seeking stories beyond the mainstream. 
            </p>
         </div>
         
         {/* Visual decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </section>

      {/* Mission Section */}
      <section className="py-32 px-6">
         <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-10">
               <div className="space-y-4">
                   <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-[0.02em] uppercase">
                       Built for Stories <br/><span className="text-sky-600">That Deserve to Be Seen</span>
                   </h2>
                   <div className="w-20 h-1 bg-sky-600" />
               </div>
               
               <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  The publishing world is competitive, but great stories shouldn’t be lost in the noise. 

At KDP Press, we remove the barriers by offering free self-publishing and access to a global distribution network of 50+ platforms. This means you don’t just publish but also get the opportunity to be discovered.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <ValueItem icon={<Award />} label="Free Publishing" />
                    <ValueItem icon={<Globe />} label="Guaranteed Author Visibility" />
                    <ValueItem icon={<Target />} label="Complete Ownership" />
                    <ValueItem icon={<Heart />} label="Simple Process" />
               </div>

               <div className="pt-10">
                   <Link href="/auth/signup" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center gap-3 w-fit">
                       Join the Movement
                       <ArrowRight size={20} />
                   </Link>
               </div>
            </div>

            <div className="flex-1 relative w-full aspect-square max-w-[600px]">
               <div className="absolute inset-0 bg-sky-400/5 blur-[100px] rounded-full" />
               <div className="relative w-full h-full glass-card rounded-[3rem] p-4 shadow-2xl border border-white rotate-3 group hover:rotate-0 transition-transform duration-700">
                  <div className="w-full h-full bg-slate-100 rounded-[2.5rem] overflow-hidden">
                     <img 
                        src="https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?auto=format&fit=crop&q=80&w=1000" 
                        alt="Publishing Workspace" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative aspect-square max-w-[500px] mx-auto lg:mx-0">
               <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full" />
               <div className="relative w-full h-full bg-white/5 backdrop-blur-md rounded-[3rem] p-4 shadow-2xl border border-white/5 -rotate-3 group hover:rotate-0 transition-transform duration-700">
                  <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden">
                     <img 
                        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1000" 
                        alt="Library" 
                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-all duration-700" 
                     />
                  </div>
               </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-10">
               <div className="space-y-4 text-right lg:text-left">
                  <h2 className="text-5xl font-black text-white leading-tight tracking-[0.02em] uppercase">
                      A Library Beyond <br/><span className="text-amber-500">the Bestsellers </span>
                  </h2>
                  <div className="w-20 h-1 bg-amber-500 ml-auto lg:ml-0" />
               </div>
               
               <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  For readers seeking something different, KDP Press offers a curated space of fresh, undiscovered voices. 

Explore a growing collection of titles, from editor’s picks to featured authors, and find stories that go beyond the usual.
               </p>

               <div className="grid grid-cols-2 gap-6">
                  <StatCard number="1000+" label="Authors" />
                  <StatCard number="50,000+" label="Books" />
                  <StatCard number="100,000" label="Readership" />
                  <StatCard number="50+"label="Catogeries" />
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-6 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
         
         <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">
               Redefining Book Stores Starting Now!
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
               <Link href="/auth/signup" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl active:scale-95">
                   Begin Publishing
               </Link>
               <Link href="/contact" className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                   Get in touch
               </Link>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}

function ValueItem({ icon, label }: { icon: React.ReactElement, label: string }) {
   return (
      <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
              {React.isValidElement(icon) ? (
                React.cloneElement(icon, { 
                  size: 20 
                } as any)
              ) : (
                icon
              )}
          </div>
          <span className="text-slate-900 font-bold uppercase tracking-widest text-[10px]">{label}</span>
      </div>
   );
}

function StatCard({ number, label }: { number: string, label: string }) {
   return (
      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:border-amber-500/30 transition-all group">
         <div className="text-4xl font-black text-white mb-1 group-hover:text-amber-500 transition-colors">{number}</div>
         <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</div>
      </div>
   );
}
