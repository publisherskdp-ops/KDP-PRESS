'use client';

import BookUploadForm from "@/components/BookUploadForm";
import React, { useState, useEffect, useRef } from "react";
import { getDashboardBooksAction, updateBookCoverAction } from "@/app/bookstore/actions";
import Image from "next/image";
import { toast } from 'sonner';
import {
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  FileEdit,
  BarChart3,
  Sparkles,
  BookOpen,
  Upload,
  Eye,
  Megaphone,
  X,
  Tag,
  DollarSign,
  Users
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type BookStatus = "PENDING" | "LIVE" | "DRAFT" | string;
type TabKey = "ALL" | "IN_REVIEW";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  LIVE:    { label: "Live",    dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700" },
  PENDING: { label: "Review",  dot: "bg-amber-500",   bg: "bg-amber-50",   text: "text-amber-700"   },
  DRAFT:   { label: "Draft",   dot: "bg-slate-400",   bg: "bg-slate-100",  text: "text-slate-500"   },
};
const getStatus = (s: string) => statusConfig[s] ?? statusConfig.DRAFT;

const fmt = (n: number | string | undefined) =>
  n ? `$${Number(n).toFixed(2)}` : "—";

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  accent: "blue" | "amber" | "green";
}) {
  const accents = {
    blue:  { icon: "text-blue-500 bg-blue-50",  border: "hover:border-blue-200" },
    amber: { icon: "text-amber-500 bg-amber-50", border: "hover:border-amber-200" },
    green: { icon: "text-emerald-500 bg-emerald-50", border: "hover:border-emerald-200" },
  };
  const a = accents[accent];
  return (
    <div
      className={`group bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-md ${a.border} cursor-default`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${a.icon}`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-1 font-medium">{label}</p>
      </div>
      <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-300 group-hover:text-slate-400 transition-colors">
        {sub}
      </span>
    </div>
  );
}

function FormatPill({
  label,
  price,
  spec,
  accent,
}: {
  label: string;
  price: string;
  spec: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className={`text-[9px] font-bold uppercase tracking-widest ${accent}`}>{label}</span>
      <span className="text-sm font-bold text-slate-800 truncate">{price}</span>
      <span className="text-[10px] text-slate-400 truncate">{spec}</span>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-4 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
        <BookOpen size={28} />
      </div>
      <div>
        <p className="font-semibold text-slate-700">
          {query ? "No results found" : "No manuscripts yet"}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          {query ? `Nothing matched "${query}"` : "Upload your first book to get started."}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 flex gap-6 animate-pulse">
      <div className="w-24 h-36 bg-slate-100 rounded-xl shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 bg-slate-100 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-1/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2 mt-4" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Book Row ─────────────────────────────────────────────────────────────────
function BookRow({
  book,
  onEdit,
  onUpdateCover,
  updatingCover,
}: {
  book: any;
  onEdit: () => void;
  onUpdateCover: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updatingCover: boolean;
}) {
  const s = getStatus(book.status);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="group bg-white border border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col md:flex-row">
      {/* Cover image container */}
      <div
        className="relative w-full md:w-32 aspect-[3/4] md:aspect-auto bg-slate-50 shrink-0 cursor-pointer min-h-[160px] md:min-h-0"
        onClick={() => fileRef.current?.click()}
        title="Click to update cover"
      >
        {book.image ? (
          <Image src={book.image} alt={book.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-300 p-4 text-center">
            <Sparkles size={20} />
            <span className="text-[9px] font-bold uppercase tracking-widest">No Cover</span>
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload size={16} className="text-white" />
        </div>
        {updatingCover && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          </div>
        )}
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          accept="image/*"
          onChange={onUpdateCover}
        />
      </div>

      {/* Main Metadata and Actions Content block */}
      <div className="flex-1 p-5 md:p-6 flex flex-col gap-4 min-w-0">
        
        {/* Header Metadata block */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 truncate max-w-md">{book.title}</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              By <span className="text-slate-600 font-medium">{book.author}</span>
              <span className="text-slate-200">·</span>
              <span>{book.language?.toUpperCase() || "EN"}</span>
              <span className="text-slate-200">·</span>
              <span>{book.pageCount || 0} pages</span>
              <span className="text-slate-200">·</span>
              <span className="font-mono text-slate-300 text-[11px]">{book.id.substring(0, 8)}</span>
            </p>

            {/* Expanded attributes block */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {book.genre && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-slate-500 text-[10px] font-medium border border-slate-100">
                  <Tag size={10} />
                  {book.genre}
                </span>
              )}
              {book.audience && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-slate-500 text-[10px] font-medium border border-slate-100">
                  <Users size={10} />
                  {book.audience}
                </span>
              )}
              {book.estRoyalty && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100/50">
                  <DollarSign size={10} />
                  {book.estRoyalty} Royalty Est.
                </span>
              )}
            </div>
          </div>

          {/* Action trigger tools */}
          <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-slate-100"
            >
              <FileEdit size={13} />
              Edit
            </button>
            <button className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Pricing Layout Matrix */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 py-3 border-y border-slate-100">
          <FormatPill
            label="E-Book"
            price={fmt(book.priceEbook)}
            spec="Digital"
            accent="text-blue-500"
          />
          <FormatPill
            label="Paperback"
            price={fmt(book.pricePaperback)}
            spec={`${book.paperbackTrimSize || "6×9"} · ${book.paperbackCoverFinish || "Gloss"}`}
            accent="text-amber-500"
          />
          <FormatPill
            label="Hardcover"
            price={fmt(book.priceHardcover)}
            spec={`${book.hardcoverTrimSize || "6×9"} · ${book.hardcoverCoverFinish || "Gloss"}`}
            accent="text-emerald-500"
          />
        </div>

        {/* Interactive Footer element metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] mt-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400">
            <span>
              Created{" "}
              <span className="text-slate-600 font-medium">
                {new Date(book.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
            {book.isbn && (
              <>
                <span className="text-slate-200 hidden sm:inline">·</span>
                <span>
                  ISBN-13 <span className="text-slate-600 font-mono font-medium">{book.isbn}</span>
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-semibold transition-colors">
              <Eye size={12} />
              Store
            </button>
            <span className="text-slate-200">·</span>
            <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-semibold transition-colors">
              <Megaphone size={12} />
              Promote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUploadFormat, setActiveUploadFormat] = useState<{
    format: "kindle" | "paperback" | "hardcover";
    bookData: any;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [updatingCoverSlug, setUpdatingCoverSlug] = useState<string | null>(null);

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
    formData.append("image", file);
    const result = await updateBookCoverAction(slug, formData);
    if (result.success) {
      await fetchBooks();
      toast.success("Cover updated successfully!");
    } else {
      toast.error("Error updating cover: " + result.error);
    }
    setUpdatingCoverSlug(null);
  };

  const tabFilter: Record<TabKey, (b: any) => boolean> = {
    ALL:       () => true,
    IN_REVIEW: (b) => b.status === "PENDING",
  };

  const filteredBooks = books
    .filter(tabFilter[activeTab])
    .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = {
    total:   books.length,
    pending: books.filter((b) => b.status === "PENDING").length,
    live:    books.filter((b) => b.status === "LIVE").length,
  };

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "ALL",       label: "All",       count: books.length },
    { key: "IN_REVIEW", label: "In Review", count: stats.pending },
  ];

  if (activeUploadFormat) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col pt-16 md:pt-20">
        <main className="flex-1 max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-6 w-full">
          <button
            onClick={() => setActiveUploadFormat(null)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 md:mb-8 transition-colors font-medium"
          >
            <X size={16} />
            Back to Dashboard
          </button>
          <BookUploadForm
            format={activeUploadFormat.format}
            initialData={activeUploadFormat.bookData}
            onClose={() => setActiveUploadFormat(null)}
          />
        </main>
      </div>
    );
  }

  return (
    /* FIXED: Combined layout wrappers with cohesive bg-slate-50 to eradicate outer layout canvas spacing */
    <div >
      <main className="w-full max-w-1xl py-6 md:py-10 px-4 sm:px-6 md:px-8 space-y-6 md:space-y-8 flex-1">

        {/* Page Title & Header Actions Banner */}
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">Manage and track your manuscripts</p>
          </div>
          {/* <button
            onClick={() => se tActiveUploadFormat({ format: "kindle", bookData: null })}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-slate-900 text-white text-xs md:text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all shadow-sm shrink-0"
          >
            <Plus size={15} />
            New Title
          </button> */}
        </div>

        {/* Summary Metric Stats Display Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<BarChart3 />}    label="Total Manuscripts" value={stats.total}   sub="Books"    accent="blue"  />
          <StatCard icon={<Clock />}        label="Pending Review"    value={stats.pending} sub="In Queue" accent="amber" />
          <StatCard icon={<CheckCircle2 />} label="Live on Store"     value={stats.live}    sub="Published" accent="green" />
        </div>

        {/* Toolbar Filter & Live Query Actions Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
          {/* Filtering Tab Group Controls */}
          <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1 overflow-x-auto no-scrollbar max-w-full">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                  activeTab === t.key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {t.label}
                {t.count !== undefined && (
                  <span className={`ml-1.5 text-[10px] ${activeTab === t.key ? "opacity-60" : "text-slate-300"}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Query Control Box */}
          <div className="relative flex-1 max-w-sm w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search manuscripts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all placeholder:text-slate-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-400 sm:ml-auto whitespace-nowrap">
            {filteredBooks.length} result{filteredBooks.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Core Book List Container Section */}
        <div className="space-y-3 md:space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookRow
                key={book.id}
                book={book}
                onEdit={() => setActiveUploadFormat({ format: "KDP", bookData: book })}
                onUpdateCover={(e) => handleCoverUpdate(book.id, e)}
                updatingCover={updatingCoverSlug === book.id}
              />
            ))
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl">
              <EmptyState query={searchQuery} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}