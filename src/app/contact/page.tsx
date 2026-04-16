'use client';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden hero-gradient">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
               Talk to our <br/><span className="gradient-text italic">Experts</span>.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium">
               Whether you're finalizing your first manuscript or looking to reach a global scale, our team is ready to guide your publishing journey.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-6 pb-32">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Contact Form Section */}
          <div className="flex-1 w-full animate-in fade-in slide-in-from-left-12 duration-700 delay-200">
            <div className="glass-card rounded-[3rem] p-8 md:p-12 border border-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-amber-400 to-sky-400" />
               
               <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3 font-display">
                  <MessageSquare size={32} className="text-sky-600" />
                  Send a Message
               </h2>

               <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                        <input 
                           type="text" 
                           placeholder="Johnathan Rivers" 
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-medium" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                        <input 
                           type="email" 
                           placeholder="john@example.com" 
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-medium" 
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Inquiry Category</label>
                     <div className="relative">
                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-bold appearance-none cursor-pointer">
                           <option>Full Publishing Package</option>
                           <option>Editing & Premium Layout</option>
                           <option>Cover Design & Illustration</option>
                           <option>Marketing Strategy</option>
                           <option>Technical Support</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ArrowRight size={20} className="rotate-90" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Narrative</label>
                     <textarea 
                        placeholder="Tell us about your manuscript or specific requirements..." 
                        rows={6} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-medium resize-none"
                     ></textarea>
                  </div>

                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-sky-600 transition-all active:scale-95 group">
                     Initiate Consultation
                     <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </form>
            </div>
          </div>

          {/* Contact Details Column */}
          <aside className="w-full lg:w-[400px] space-y-12 animate-in fade-in slide-in-from-right-12 duration-700 delay-400">
             <div className="space-y-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-4">Direct Communication</h3>
                <div className="space-y-8">
                   <ContactInfoItem icon={<Phone />} label="Phone" value="+1 (855) 209-8899" />
                   <ContactInfoItem icon={<Mail />} label="Email" value="experts@kdppress.com" />
                   <ContactInfoItem icon={<MapPin />} label="Headquarters" value="2121 N Pearl St, Dallas, TX 75201" />
                </div>
             </div>

             <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10 space-y-6">
                   <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400 border border-white/10">
                      <Globe size={28} />
                   </div>
                   <h4 className="text-2xl font-black">Global Support</h4>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Our elite support desk operates 24/7 across every time zone to ensure your manuscript never misses a deadline.
                   </p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-400/80">
                      <Clock size={12} />
                      Current Wait Time: 4 mins
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4 p-8 border border-slate-100 rounded-3xl bg-white shadow-sm">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                   <ShieldCheck size={24} />
                </div>
                <div>
                   <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security</span>
                   <p className="text-sm font-bold text-slate-900">100% Secure & Encrypted</p>
                </div>
             </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ContactInfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
   return (
      <div className="flex items-center gap-5 group cursor-pointer">
         <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
            {React.cloneElement(icon as React.isValidElement, { size: 24 })}
         </div>
         <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</div>
            <div className="text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors">{value}</div>
         </div>
      </div>
   );
}
