'use client';
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Rocket, Sparkles, Globe, ShieldCheck, Zap, BookMarked, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-gradient">
        {/* Animated background elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-sky-400/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/5 blur-[100px] rounded-full" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/50 backdrop-blur-md border border-white rounded-full shadow-lg shadow-slate-200/50">
               <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">The Future of Publishing</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] text-slate-900">
              Your story, published <br />
              <span className="gradient-text">professionally</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-medium">
              Keep 100% of your rights and earn up to 70% royalties. Reach a global audience with the industry's most advanced publishing infrastructure.
            </p>

            <div className="flex flex-wrap gap-5 pt-6">
              <Link href="/auth/signup" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-900/20 hover:scale-105 hover:bg-sky-600 transition-all duration-300 active:scale-95 flex items-center gap-2">
                Start My Journey
                <ArrowRight size={20} />
              </Link>
              <Link href="/bookstore" className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-lg shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                Browse Library
              </Link>
            </div>

            <div className="flex items-center gap-10 pt-8 opacity-60">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-sky-600" />
                <span className="text-xs font-black uppercase tracking-widest">Secure Settlements</span>
              </div>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-10">
                <Globe size={18} className="text-sky-600" />
                <span className="text-xs font-black uppercase tracking-widest">Global Distribution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-20 border-y border-slate-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2 group">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform">1.2M</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Independent Authors</p>
            </div>
            <div className="space-y-2 group">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform">$3.4B</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Royalties Paid</p>
            </div>
            <div className="space-y-2 group">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform">192</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Countries</p>
            </div>
            <div className="space-y-2 group">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform">70%</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Max Royalty Tier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Excellence Features */}
      <section className="py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl mb-24 space-y-6">
             <div className="inline-flex items-center gap-2 text-sky-600 font-black uppercase tracking-[0.2em] text-xs">
                <Sparkles size={16} />
                Elite Infrastructure
             </div>
             <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">Built for those who <br /><span className="italic font-serif text-sky-600">refuse</span> to settle.</h2>
             <p className="text-xl text-slate-500 font-medium max-w-xl">We've eliminated the technical friction of publishing so you can focus on the art of storytelling.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-amber-500" />} 
              title="Instant Formatting" 
              desc="Drop your manuscript and let our AI engine handle the complex typesetting for both digital and print arrays." 
            />
            <FeatureCard 
              icon={<Globe className="text-sky-500" />} 
              title="Global Fulfillment" 
              desc="Your book is stocked in major retail networks worldwide, with automated local printing to minimize shipping costs." 
            />
            <FeatureCard 
              icon={<Rocket className="text-slate-900" />} 
              title="Launch Dynamics" 
              desc="Access elite marketing tools, algorithmic optimization, and real-time sales analytics to fuel your growth." 
            />
          </div>
        </div>
      </section>

      {/* Editorial Teaser */}
      <section className="py-32 bg-slate-900 text-white rounded-[4rem] mx-6 mb-32 overflow-hidden relative">
         {/* Background glow */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-600/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
         
         <div className="max-w-[1200px] mx-auto px-10 relative z-10 flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
                <div className="space-y-4">
                   <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">Stay Inspired.</h2>
                   <div className="w-20 h-1 bg-sky-500" />
                </div>
                <p className="text-2xl text-slate-400 font-medium leading-relaxed">
                   Discover why 50k+ authors choose KDP Press for their most ambitious projects. The bookstore isn't just a shop—it's an experience.
                </p>
                <div className="flex gap-10">
                    <div className="space-y-1">
                        <span className="text-3xl font-black text-white">4.9/5</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Author Sat.</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-3xl font-black text-white">24/7</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expert Support</p>
                    </div>
                </div>
                <Link href="/bookstore" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-all duration-300">
                    Explore the Store
                    <ArrowRight size={20} />
                </Link>
            </div>

            <div className="flex-1 relative h-[600px] w-full hidden lg:block">
               {/* Visual book display mockup */}
               <div className="absolute bottom-10 right-0 w-80 aspect-[2/3] bg-white rounded-2xl shadow-2xl rotate-12 z-20 overflow-hidden glass-card p-2">
                  <div className="w-full h-full bg-slate-200 rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600')" }} />
               </div>
               <div className="absolute bottom-20 right-32 w-72 aspect-[2/3] bg-white rounded-2xl shadow-2xl scale-95 opacity-60 rotate-6 z-10 overflow-hidden p-2">
                  <div className="w-full h-full bg-slate-100 rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1474932430478-367d26bbef6e?auto=format&fit=crop&q=80&w=400&h=600')" }} />
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
        {React.cloneElement(icon as React.ReactElement, { size: 32 })}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
