"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Send, Sparkles, User, FileText, DollarSign, BookOpen,
  Image as ImageIcon, FileUp, CheckCircle2, Loader2, ChevronRight, ChevronLeft
} from "lucide-react"
import { publishBookAction } from "@/app/bookstore/actions"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function PublishPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    title: '',
    subtitle: '',
    genre: 'Modern Fiction',
    descriptionHtml: '',
    pricePaperback: 19.99,
    priceEbook: 9.99,
    priceHardcover: 29.99,
    isbn: '',
    pageCount: 200,
    language: 'English',
    image: '', // Front Cover URL
    coverBack: '', // Back Cover URL
    manuscriptUrl: '', // Manuscript PDF URL

    // Separate physical specs for Paperback
    paperbackTrimSize: '6 x 9',
    paperbackCoverFinish: 'Gloss',
    paperbackInteriorColor: 'Black & White Standard',

    // Separate physical specs for Hardcover
    hardcoverTrimSize: '6 x 9',
    hardcoverCoverFinish: 'Gloss',
    hardcoverInteriorColor: 'Black & White Standard'
  })

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    image: null,
    coverBack: null,
    manuscriptUrl: null
  })

  const fileInputRefs = {
    image: useRef<HTMLInputElement>(null),
    coverBack: useRef<HTMLInputElement>(null),
    manuscriptUrl: useRef<HTMLInputElement>(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(field)
    await new Promise(resolve => setTimeout(resolve, 1200)) // Simulate upload delay

    setFiles(prev => ({ ...prev, [field]: file }))
    setFormData(prev => ({ ...prev, [field]: `https://kdp-press-storage.s3.amazonaws.com/uploads/${file.name}` }))
    setUploadingField(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async () => {
    if (!files.image || !files.manuscriptUrl) {
      alert("Please upload the required assets (Front Cover and Manuscript).")
      return
    }

    setIsSubmitting(true)
    try {
      const rawFormData = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value !== 'undefined' && value !== null) {
          rawFormData.append(key, value.toString());
        }
      });

      // Append actual file objects
      if (files.image) rawFormData.set('image', files.image);
      if (files.coverBack) rawFormData.set('coverBack', files.coverBack);
      if (files.manuscriptUrl) rawFormData.set('manuscriptUrl', files.manuscriptUrl);

      const result = await publishBookAction(rawFormData)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/bookstore')
        }, 3000)
      } else {
        alert("Error saving: " + result.error)
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-12">
      {[
        { step: 1, label: "Core Details" },
        { step: 2, label: "Print & Assets" },
        { step: 3, label: "Pricing & Summary" }
      ].map((s, index) => (
        <div key={s.step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === s.step ? 'bg-sky-600 text-white shadow-lg shadow-sky-200 ring-4 ring-sky-100' :
                step > s.step ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
              {step > s.step ? <CheckCircle2 size={18} /> : s.step}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider mt-2 transition-colors ${step === s.step ? 'text-sky-600' : 'text-slate-400'
              }`}>{s.label}</span>
          </div>
          {index < 2 && (
            <div className={`w-16 h-[2px] mx-2 -mt-4 transition-colors duration-300 ${step > s.step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-16 text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Project Registered!</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Your book data and assets were synced with Lulu Print Services.<br />
              Loading bookstore page...
            </p>
          </div>
          <div className="pt-4">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[progress_3s_ease-in-out]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-3 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100/50">
            <Sparkles size={12} />
            Global Print-on-Demand Console
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Publish Your Book
          </h1>
          <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">
            Configure dynamic specs for paperback and hardcover formats
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-14">

            {/* Step 1: Core Details */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                    <User className="text-sky-600" size={20} /> Author & Book Identity
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Specify your authorship information and public titles.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Author Full Name *</label>
                    <input
                      required name="fullName" value={formData.fullName} onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold"
                      placeholder="e.g. Stephen King"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Contact Email Address *</label>
                    <input
                      required name="email" value={formData.email} onChange={handleChange} type="email"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold"
                      placeholder="publisher@domain.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Book Title *</label>
                    <input
                      required name="title" value={formData.title} onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold"
                      placeholder="Title on cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subtitle</label>
                    <input
                      name="subtitle" value={formData.subtitle} onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold"
                      placeholder="Optional secondary tagline"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.fullName || !formData.email || !formData.title}
                    className="px-8 py-4 bg-slate-950 text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-sky-600 transition-all disabled:opacity-40 active:scale-95 shadow-md"
                  >
                    Set Specifications <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Custom Layouts, Specifications & Assets */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                    <BookOpen className="text-sky-600" size={20} /> Production Layout & Metadata
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Configure individual print attributes for each physical format.</p>
                </div>

                {/* Book Metadata Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Select Genre</label>
                    <select
                      name="genre" value={formData.genre} onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                    >
                      <option>Modern Fiction</option>
                      <option>Non-Fiction</option>
                      <option>Business & Growth</option>
                      <option>Science Fiction</option>
                      <option>Romance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Language</label>
                    <input
                      name="language" value={formData.language} onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Final Page Count *</label>
                    <input
                      type="number" name="pageCount" value={formData.pageCount} onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-bold"
                    />
                  </div>
                </div>

                {/* DUAL SPECS: Paperback Card & Hardcover Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">

                  {/* Paperback Specifications Panel */}
                  <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">Paperback Specifications</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Trim Size (Paperback)</label>
                        <select
                          name="paperbackTrimSize" value={formData.paperbackTrimSize} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="6 x 9">6 x 9 (US Trade)</option>
                          <option value="5.5 x 8.5">5.5 x 8.5 (Digest)</option>
                          <option value="8.5 x 11">8.5 x 11 (Letter)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Cover Finish</label>
                        <select
                          name="paperbackCoverFinish" value={formData.paperbackCoverFinish} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="Gloss">Gloss</option>
                          <option value="Matte">Matte</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Interior Ink/Color Type</label>
                        <select
                          name="paperbackInteriorColor" value={formData.paperbackInteriorColor} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="Black & White Standard">Black & White Standard</option>
                          <option value="Standard Color">Standard Color</option>
                          <option value="Premium Color">Premium Color</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Hardcover Specifications Panel */}
                  <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">Hardcover Specifications</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Trim Size (Hardcover)</label>
                        <select
                          name="hardcoverTrimSize" value={formData.hardcoverTrimSize} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="6 x 9">6 x 9 (US Trade)</option>
                          <option value="5.5 x 8.5">5.5 x 8.5 (Digest)</option>
                          <option value="8.5 x 11">8.5 x 11 (Letter)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Cover Finish</label>
                        <select
                          name="hardcoverCoverFinish" value={formData.hardcoverCoverFinish} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="Gloss">Gloss</option>
                          <option value="Matte">Matte</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Interior Ink/Color Type</label>
                        <select
                          name="hardcoverInteriorColor" value={formData.hardcoverInteriorColor} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <option value="Black & White Standard">Black & White Standard</option>
                          <option value="Standard Color">Standard Color</option>
                          <option value="Premium Color">Premium Color</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Upload Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Required Publishing Assets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div
                      onClick={() => fileInputRefs.image.current?.click()}
                      className={`group relative p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${files.image ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-150 hover:border-sky-300'
                        }`}
                    >
                      <input type="file" ref={fileInputRefs.image} accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
                      {uploadingField === 'image' ? <Loader2 className="animate-spin text-sky-600" size={24} /> :
                        files.image ? <CheckCircle2 className="text-emerald-500" size={24} /> : <ImageIcon className="text-slate-400 group-hover:scale-105 transition-transform" size={24} />}
                      <div>
                        <p className="text-xs font-black text-slate-800">{files.image ? files.image.name : 'Upload Front Cover'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">High-quality PDF (Front Cover)</p>
                      </div>
                    </div>

                    <div
                      onClick={() => fileInputRefs.coverBack.current?.click()}
                      className={`group relative p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${files.coverBack ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-150 hover:border-sky-300'
                        }`}
                    >
                      <input type="file" ref={fileInputRefs.coverBack} accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'coverBack')} />
                      {uploadingField === 'coverBack' ? <Loader2 className="animate-spin text-sky-600" size={24} /> :
                        files.coverBack ? <CheckCircle2 className="text-emerald-500" size={24} /> : <ImageIcon className="text-slate-400 group-hover:scale-105 transition-transform" size={24} />}
                      <div>
                        <p className="text-xs font-black text-slate-800">{files.coverBack ? files.coverBack.name : 'Upload Back Cover'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Optional: High-quality PDF (Back Cover)</p>
                      </div>
                    </div>

                    <div
                      onClick={() => fileInputRefs.manuscriptUrl.current?.click()}
                      className={`group relative p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${files.manuscriptUrl ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-150 hover:border-sky-300'
                        }`}
                    >
                      <input type="file" ref={fileInputRefs.manuscriptUrl} accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'manuscriptUrl')} />
                      {uploadingField === 'manuscriptUrl' ? <Loader2 className="animate-spin text-sky-600" size={24} /> :
                        files.manuscriptUrl ? <CheckCircle2 className="text-emerald-500" size={24} /> : <FileText className="text-slate-400 group-hover:scale-105 transition-transform" size={24} />}
                      <div>
                        <p className="text-xs font-black text-slate-800">{files.manuscriptUrl ? files.manuscriptUrl.name : 'Upload Manuscript'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Final Manuscript PDF file</p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button onClick={() => setStep(1)} className="px-6 py-4 text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <ChevronLeft size={16} /> Identity Details
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!files.image || !files.manuscriptUrl}
                    className="px-8 py-4 bg-slate-950 text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-sky-600 transition-all disabled:opacity-45"
                  >
                    Pricing & Sync <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Review */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                    <DollarSign className="text-sky-600" size={20} /> Commercial Pricing & Summary
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Provide your target list prices. Set to 0 if a format is unavailable.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">Paperback USD ($)</label>
                    <input
                      type="number" step="0.01" name="pricePaperback" value={formData.pricePaperback} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-slate-950 font-black text-3xl focus:text-sky-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">Ebook USD ($)</label>
                    <input
                      type="number" step="0.01" name="priceEbook" value={formData.priceEbook} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-slate-950 font-black text-3xl focus:text-sky-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">Hardcover USD ($)</label>
                    <input
                      type="number" step="0.01" name="priceHardcover" value={formData.priceHardcover} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-slate-950 font-black text-3xl focus:text-sky-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Marketing Synopsis & Description</label>
                  <textarea
                    name="descriptionHtml" value={formData.descriptionHtml} onChange={handleChange}
                    rows={5}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-medium leading-relaxed resize-none"
                    placeholder="Provide a persuasive marketing copy for this book..."
                  />
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button onClick={() => setStep(2)} className="px-6 py-4 text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <ChevronLeft size={16} /> Physical Specs
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-sky-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-slate-950 transition-all shadow-md disabled:opacity-45"
                  >
                    {isSubmitting ? 'Generating Specifications & Launching...' : 'Confirm & Launch Book'}
                    {!isSubmitting && <Send size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          Integrated with automated Lulu Print-On-Demand pipelines.
        </p>
      </main>

      <Footer />
    </div>
  )
}