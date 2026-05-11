'use client';

import { useBookshelfStore, FormatData } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import BookUploadForm from "@/components/BookUploadForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, { useState, useEffect, useRef } from "react";
import { getDashboardBooksAction, updateBookCoverAction } from "@/app/bookstore/actions";
import Image from "next/image";
import {
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  FileEdit,
  BarChart3,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const FormatRow = ({ label, data, onSetup }: { label: string, data?: FormatData, onSetup: () => void }) => {
  if (!data) return null;
  return (
    <div className="py-5 border-b border-slate-100 last:border-0 group transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">{label}</h4>
          {data.status === 'NONE' ? (
            <p className="text-sm font-medium text-slate-300 italic">Not initialized</p>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${data.status === 'LIVE' ? 'text-green-600' : data.status === 'PENDING' ? 'text-amber-600' : 'text-slate-900'}`}>
                {data.status === 'LIVE' ? 'Live on Store' : data.status === 'PENDING' ? 'Pending Approval' : data.status === 'IN_REVIEW' ? 'In Review' : 'Draft Edition'}
              </span>
              {data.status === 'LIVE' && <CheckCircle2 size={14} className="text-green-500" />}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {data.price && (
            <div className="text-right hidden md:block">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">List Price</span>
              <span className="text-sm font-black text-slate-900">${data.price.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {data.status === 'NONE' ? (
              <button
                onClick={onSetup}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all active:scale-95"
              >
                + Create
              </button>
            ) : (
              <button
                onClick={onSetup}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${data.status === 'DRAFT'
                    ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 hover:bg-amber-600'
                    : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {data.status === 'DRAFT' ? 'Continue' : 'Edit'}
                <ArrowUpRight size={14} />
              </button>
            )}
            <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUploadFormat, setActiveUploadFormat] = useState<'kindle' | 'paperback' | 'hardcover' | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingCoverSlug, setUpdatingCoverSlug] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBooks = async () => {
    setLoading(true);
    const data = await getDashboardBooksAction();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);


  const handleCoverUpdate = async (slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUpdatingCoverSlug(slug);
    const formData = new FormData();
    formData.append('image', file);

    const result = await updateBookCoverAction(slug, formData);
    if (result.success) {
      await fetchBooks();
    } else {
      alert("Error updating cover: " + result.error);
    }
    setUpdatingCoverSlug(null);
  };

  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = {
    total: books.length,
    pending: books.filter(b => b.status === 'PENDING').length,
    approved: books.filter(b => b.status === 'LIVE').length,
    draft: books.filter(b => b.status === 'DRAFT').length
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-sky-100 flex flex-col pt-20">


      {activeUploadFormat ? (
        <main className="flex-1 max-w-[1200px] mx-auto py-12 px-6 w-full animate-in fade-in zoom-in-95 duration-500">
          <BookUploadForm
            format={activeUploadFormat}
            onClose={() => setActiveUploadFormat(null)}
          />
        </main>
      ) : (
        <>
          <main className="flex-1 max-w-[1400px] mx-auto py-12 px-6 w-full space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatPreview icon={<BarChart3 />} label="Total Projects" value={`${stats.total}`} trend="Books" />
              <StatPreview icon={<Clock />} label="Pending Review" value={`${stats.pending}`} trend="In Queue" />
              <StatPreview icon={<CheckCircle2 />} label="Approved" value={`${stats.approved}`} trend="Live" />
              <StatPreview icon={<FileEdit />} label="Drafts" value={`${stats.draft}`} trend="In Progress" />
            </div>

            {/* Bookshelf Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span className="text-slate-900 border-b-2 border-sky-600 pb-1">All Manuscripts</span>
                  <span className="hover:text-slate-900 cursor-pointer transition-colors pb-1">In Review</span>
                  <span className="hover:text-slate-900 cursor-pointer transition-colors pb-1">Archived</span>
                </div>

                <div className="relative group w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Find a manuscript..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Bookshelf List */}
              {filteredBooks.length > 0 ? (
                <div className="space-y-6">
                  {filteredBooks.map((book, idx) => (
                    <div key={book.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-white shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                      {/* Left Cover Teaser */}
                      <div className="w-full md:w-48 aspect-[2/3] bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center justify-center relative group">
                        <div className="absolute inset-0 bg-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {book.image ? (
                          <div
                            className={`w-full h-full bg-white shadow-2xl border border-slate-200 rounded-lg relative z-10 transform group-hover:scale-105 transition-transform duration-500 overflow-hidden ${updatingCoverSlug === book.id ? 'opacity-50' : ''}`}
                          >
                            <Image
                              src={book.image}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-slate-100 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-300 gap-2 relative z-10 transition-colors group-hover:border-sky-200 group-hover:text-sky-300">
                            <Sparkles size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">No Cover</span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setUpdatingCoverSlug(book.id);
                            fileInputRef.current?.click();
                          }}
                          className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
                        >
                          {updatingCoverSlug === book.id ? 'Uploading...' : 'Update Cover'}
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => updatingCoverSlug && handleCoverUpdate(updatingCoverSlug, e)}
                      />

                      {/* Right Data Section */}
                      <div className="flex-1 p-8 md:p-10 relative">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-black text-slate-900 leading-tight">{book.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${book.status === 'LIVE' ? 'bg-emerald-100 text-emerald-600' :
                                  book.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {book.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                Author: <span className="text-slate-900 italic font-medium">{book.author}</span>
                              </p>
                              <div className="h-4 w-[1px] bg-slate-200" />
                              <p className="text-xs text-sky-600 font-black uppercase tracking-widest flex items-center gap-1">
                                ID: {book.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                              Manage Title
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-12">
                          <FormatRow label="Kindle eBook" data={book.kindle} onSetup={() => setActiveUploadFormat('kindle')} />
                          <FormatRow label="Paperback" data={book.paperback} onSetup={() => setActiveUploadFormat('paperback')} />
                          <FormatRow label="Hardcover" data={book.hardcover} onSetup={() => setActiveUploadFormat('hardcover')} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center glass-card rounded-[3rem] border-dashed border-2 border-slate-200 bg-transparent">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-6">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No manuscripts found</h3>
                  <p className="text-slate-400 font-medium">Clear your search or create a new title to get started.</p>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}

function StatPreview({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <div className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
          {React.isValidElement(icon) ? (
            React.cloneElement(icon, {
              size: 24
            } as any)
          ) : (
            icon
          )}
        </div>
        <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
          {trend}
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
