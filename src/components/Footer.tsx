'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookMarked, Globe, ShieldCheck, Mail, Users, Share2, Camera, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-white pt-24 pb-12 overflow-hidden selection:bg-sky-500/30">
      {/* Visual background decoration */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500 rounded-full blur-[120px] opacity-10" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-40 h-40 bg-white/5 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center group-hover:bg-sky-400/20 transition-all shadow-xl p-6">
                <Image
                  src="/kdppress Logo-01.png"
                  alt="KDP Press Logo"
                  width={400}
                  height={200}
                  className="object-contain w-auto h-32"
                />
              </div>
            </Link>
            <p className="text-lg text-slate-400 leading-relaxed max-w-md font-medium">
              Empowering independent authors with elite publishing technology, global fulfillment, and 100% royalty transparency.
            </p>
            <div className="flex gap-4">
              {[Camera, Send, Share2, Users].map((Icon, i) => (
                <button key={i} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-sky-600 hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-sky-400 mb-8">Publishing</h4>
              <ul className="space-y-4">
                <li><Link href="/auth/signup" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Author Portal</Link></li>
                <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Royalty Tiers</Link></li>
                <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Print-on-Demand</Link></li>
                <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Digital Rights</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-sky-400 mb-8">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/bookstore" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Bookstore</Link></li>
                <li><Link href="/about" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Our Story</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Support Hub</Link></li>
                <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block font-medium">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/10 pt-10 md:pt-0 md:pl-10">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Contact Us</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail size={18} className="text-sky-400" />
                  <span className="text-sm font-bold">experts@kdppress.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Globe size={18} className="text-sky-400" />
                  <span className="text-sm font-bold">Global Distribution Hub</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <ShieldCheck size={18} className="text-sky-400" />
                  <span className="text-sm font-bold">Secure Settlement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            © 2026 KDP Press LLC. <span className="text-slate-700 mx-2">|</span> Part of the Kinetic Digital Network
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Author Agreement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
