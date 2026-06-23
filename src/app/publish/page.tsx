"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Send, Sparkles, User, FileText, DollarSign, BookOpen,
  Image as ImageIcon, FileUp, CheckCircle2, Loader2, Book,
  ToggleLeft, ToggleRight, ChevronDown, AlertCircle, Info
} from "lucide-react"
import { publishBookAction } from "@/app/bookstore/actions"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { toast } from "sonner"
import {
  PAPERBACK_TRIMS,
  HARDCOVER_TRIMS,
  getAvailableInkTypes,
  getAvailableFinishes,
  validatePageCount,
  type InkPaperType,
  type BindingFormat,
  type TrimSpec,
} from "@/lib/luluSpecs"

// ─── Format Card Component ──────────────────────────────────
function FormatCard({
  format,
  enabled,
  onToggle,
  trimSpecs,
  selectedTrim,
  onTrimChange,
  selectedInk,
  onInkChange,
  selectedFinish,
  onFinishChange,
  pageCount,
  accentColor,
  icon,
  detectedSize,
}: {
  format: BindingFormat
  enabled: boolean
  onToggle: () => void
  trimSpecs: TrimSpec[]
  selectedTrim: string
  onTrimChange: (val: string) => void
  selectedInk: InkPaperType
  onInkChange: (val: InkPaperType) => void
  selectedFinish: string
  onFinishChange: (val: string) => void
  pageCount: number
  accentColor: 'sky' | 'violet'
  icon: React.ReactNode
  detectedSize?: { width: number, height: number } | null
}) {
  const availableInks = getAvailableInkTypes(format, selectedTrim)
  const availableFinishes = getAvailableFinishes(format, selectedTrim, selectedInk)
  const validation = enabled ? validatePageCount(format, selectedTrim, selectedInk, pageCount) : null

  // Reset ink if current selection becomes unavailable
  useEffect(() => {
    if (enabled && !availableInks.includes(selectedInk)) {
      onInkChange(availableInks[0])
    }
  }, [selectedTrim, enabled])

  // Reset finish if current selection becomes unavailable
  useEffect(() => {
    if (enabled && !availableFinishes.includes(selectedFinish)) {
      onFinishChange(availableFinishes[0])
    }
  }, [selectedTrim, selectedInk, enabled])

  const standardTrims = trimSpecs.filter(t => !t.isLarge)
  const largeTrims = trimSpecs.filter(t => t.isLarge)

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        enabled
          ? accentColor === 'sky'
            ? 'border-sky-200 bg-white shadow-lg shadow-sky-50'
            : 'border-violet-200 bg-white shadow-lg shadow-violet-50'
          : 'border-slate-100 bg-slate-50/30'
      }`}
    >
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 md:p-6 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            enabled
              ? accentColor === 'sky' ? 'bg-sky-100 text-sky-600' : 'bg-violet-100 text-violet-600'
              : 'bg-slate-100 text-slate-400'
          }`}>
            {icon}
          </div>
          <div className="text-left">
            <h3 className={`text-sm font-black uppercase tracking-wider transition-colors ${
              enabled ? 'text-slate-900' : 'text-slate-400'
            }`}>
              {format === 'paperback' ? 'Paperback' : 'Hardcover'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {format === 'paperback'
                ? 'Perfect-bound softcover printing'
                : 'Case-wrapped hardcover binding'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {enabled && validation && (
            <span className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              validation.valid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {validation.valid ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
              {validation.valid ? 'Ready' : 'Check Pages'}
            </span>
          )}
          {enabled ? (
            <ToggleRight size={32} className={accentColor === 'sky' ? 'text-sky-500' : 'text-violet-500'} />
          ) : (
            <ToggleLeft size={32} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
          )}
        </div>
      </button>

      {/* Expanded Spec Configuration */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        enabled ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-5 md:px-6 pb-6 space-y-4 border-t border-slate-100 pt-5">

          {/* Trim Size */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              Trim Size
            </label>
            {detectedSize ? (
              <div className="space-y-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  accentColor === 'sky' 
                    ? 'bg-sky-50 border-sky-100 text-sky-800' 
                    : 'bg-violet-50 border-violet-100 text-violet-800'
                }`}>
                  <FileText size={14} className={accentColor === 'sky' ? 'text-sky-600' : 'text-violet-600'} />
                  <span className="text-xs font-bold">
                    Detected PDF Size: {detectedSize.width.toFixed(2)}" x {detectedSize.height.toFixed(2)}"
                  </span>
                </div>
                <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed flex justify-between items-center">
                  <span>{trimSpecs.find(t => t.value === selectedTrim)?.label || selectedTrim}</span>
                  <span className="text-[10px] uppercase tracking-wider font-black bg-slate-200 px-2 py-0.5 rounded text-slate-400">Locked</span>
                </div>
              </div>
            ) : (
              <select
                value={selectedTrim}
                onChange={(e) => onTrimChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all appearance-none"
              >
                {standardTrims.length > 0 && (
                  <optgroup label="Standard Trim Sizes">
                    {standardTrims.map(t => (
                      <option key={t.value} value={t.value}>
                        {t.label} — {t.metric}
                      </option>
                    ))}
                  </optgroup>
                )}
                {largeTrims.length > 0 && (
                  <optgroup label="Large Trim Sizes">
                    {largeTrims.map(t => (
                      <option key={t.value} value={t.value}>
                        {t.label} — {t.metric}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            )}
          </div>

          {/* Ink / Paper Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Interior Ink & Paper
            </label>
            <select
              value={selectedInk}
              onChange={(e) => onInkChange(e.target.value as InkPaperType)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all appearance-none"
            >
              {availableInks.map(ink => (
                <option key={ink} value={ink}>{ink}</option>
              ))}
            </select>
          </div>

          {/* Cover Finish */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Cover Finish
            </label>
            <div className="flex gap-3">
              {['Gloss', 'Matte'].map(finish => {
                const isAvailable = availableFinishes.includes(finish)
                const isSelected = selectedFinish === finish
                return (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => isAvailable && onFinishChange(finish)}
                    disabled={!isAvailable}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      isSelected
                        ? accentColor === 'sky'
                          ? 'bg-sky-600 text-white shadow-md'
                          : 'bg-violet-600 text-white shadow-md'
                        : isAvailable
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                    }`}
                  >
                    {finish}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Page Count Validation Indicator */}
          {validation && (
            <div className={`flex items-start gap-2 p-3 rounded-xl text-[11px] font-semibold leading-snug ${
              validation.valid
                ? 'bg-emerald-50/80 text-emerald-700'
                : 'bg-amber-50/80 text-amber-700'
            }`}>
              {validation.valid ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
              <span>{validation.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Publish Page ───────────────────────────────────────
export default function PublishPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  // Author & Book
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [genre, setGenre] = useState('Modern Fiction')
  const [language, setLanguage] = useState('English')
  const [pageCount, setPageCount] = useState(200)
  const [descriptionHtml, setDescriptionHtml] = useState('')

  // Format enable flags
  const [enablePaperback, setEnablePaperback] = useState(true)
  const [enableHardcover, setEnableHardcover] = useState(false)

  // Paperback specs
  const [pbTrim, setPbTrim] = useState('6 x 9')
  const [pbInk, setPbInk] = useState<InkPaperType>('Black & White / White')
  const [pbFinish, setPbFinish] = useState('Gloss')

  // Hardcover specs
  const [hcTrim, setHcTrim] = useState('6 x 9')
  const [hcInk, setHcInk] = useState<InkPaperType>('Black & White / White')
  const [hcFinish, setHcFinish] = useState('Gloss')

  // Pricing
  const [pricePaperback, setPricePaperback] = useState(19.99)
  const [priceEbook, setPriceEbook] = useState(9.99)
  const [priceHardcover, setPriceHardcover] = useState(29.99)

  // Files
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    coverPdfPaperback: null,
    coverPdfHardcover: null,
    manuscriptUrl: null,
    image: null,
  })

  // PDF Detected Data
  const [detectedSize, setDetectedSize] = useState<{width: number, height: number} | null>(null)

  const fileInputRefs = {
    image: useRef<HTMLInputElement>(null),
    coverPdfPaperback: useRef<HTMLInputElement>(null),
    coverPdfHardcover: useRef<HTMLInputElement>(null),
    manuscriptUrl: useRef<HTMLInputElement>(null),
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(field)

    if (field === 'manuscriptUrl' && file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const { PDFDocument } = await import('pdf-lib')
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        
        // 1. Extract Page Count
        const count = pdfDoc.getPageCount()
        setPageCount(count)

        // 2. Extract Physical Dimensions (Points -> Inches)
        const firstPage = pdfDoc.getPage(0)
        const { width, height } = firstPage.getSize()
        const widthInches = width / 72
        const heightInches = height / 72

        // Helper to find closest trim size
        const findClosestTrim = (w: number, h: number, specs: any[]) => {
          let closest = specs[0].value
          let minDiff = Infinity
          specs.forEach(s => {
            const [sw, sh] = s.value.split(' x ').map(Number)
            const diff = Math.abs(sw - w) + Math.abs(sh - h)
            if (diff < minDiff) {
              minDiff = diff
              closest = s.value
            }
          })
          return { closest, minDiff }
        }

        const pbMatch = findClosestTrim(widthInches, heightInches, PAPERBACK_TRIMS)
        const hcMatch = findClosestTrim(widthInches, heightInches, HARDCOVER_TRIMS)

        // Auto-select if it's a reasonably close match (within 0.2 inches tolerance)
        if (pbMatch.minDiff < 0.2) {
          setPbTrim(pbMatch.closest)
        }
        if (hcMatch.minDiff < 0.2) {
          setHcTrim(hcMatch.closest)
        }

        setDetectedSize({ width: widthInches, height: heightInches })

        toast.success(`Manuscript loaded: ${count} pages at ${widthInches.toFixed(2)}" x ${heightInches.toFixed(2)}"`)
      } catch (err) {
        console.error("Failed to parse PDF:", err)
        toast.error("Could not read PDF dimensions or page count. Please ensure it is a valid PDF.")
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1200))
    setFiles(prev => ({ ...prev, [field]: file }))
    setUploadingField(null)
  }

  // Ensure at least one format is always enabled
  const togglePaperback = () => {
    if (enablePaperback && !enableHardcover) {
      toast.warning("At least one print format must be enabled.")
      return
    }
    setEnablePaperback(!enablePaperback)
  }

  const toggleHardcover = () => {
    if (enableHardcover && !enablePaperback) {
      toast.warning("At least one print format must be enabled.")
      return
    }
    setEnableHardcover(!enableHardcover)
  }

  // Validate before submit
  const getValidationErrors = (): string[] => {
    const errors: string[] = []
    if (!fullName.trim()) errors.push('Author name is required')
    if (!email.trim()) errors.push('Email is required')
    if (!title.trim()) errors.push('Book title is required')
    if (enablePaperback && !files.coverPdfPaperback) errors.push('Paperback Cover PDF is required')
    if (enableHardcover && !files.coverPdfHardcover) errors.push('Hardcover Cover PDF is required')
    if (!files.manuscriptUrl) errors.push('Manuscript PDF is required')
    if (!enablePaperback && !enableHardcover) errors.push('At least one print format must be enabled')

    if (enablePaperback) {
      const pbValidation = validatePageCount('paperback', pbTrim, pbInk, pageCount)
      if (!pbValidation.valid) errors.push(`Paperback: ${pbValidation.message}`)
    }
    if (enableHardcover) {
      const hcValidation = validatePageCount('hardcover', hcTrim, hcInk, pageCount)
      if (!hcValidation.valid) errors.push(`Hardcover: ${hcValidation.message}`)
    }
    return errors
  }

  const handleSubmit = async () => {
    const errors = getValidationErrors()
    if (errors.length > 0) {
      errors.forEach(e => toast.error(e))
      return
    }

    setIsSubmitting(true)
    try {
      const rawFormData = new FormData()

      // Core fields
      rawFormData.append('fullName', fullName)
      rawFormData.append('email', email)
      rawFormData.append('title', title)
      rawFormData.append('subtitle', subtitle)
      rawFormData.append('genre', genre)
      rawFormData.append('language', language)
      rawFormData.append('pageCount', pageCount.toString())
      rawFormData.append('descriptionHtml', descriptionHtml)

      // Enable flags
      rawFormData.append('enablePaperback', enablePaperback.toString())
      rawFormData.append('enableHardcover', enableHardcover.toString())

      // Paperback specs (always send — server ignores if disabled)
      rawFormData.append('paperbackTrimSize', pbTrim)
      rawFormData.append('paperbackInteriorColor', pbInk)
      rawFormData.append('paperbackCoverFinish', pbFinish)

      // Hardcover specs
      rawFormData.append('hardcoverTrimSize', hcTrim)
      rawFormData.append('hardcoverInteriorColor', hcInk)
      rawFormData.append('hardcoverCoverFinish', hcFinish)

      // Pricing
      rawFormData.append('pricePaperback', pricePaperback.toString())
      rawFormData.append('priceEbook', priceEbook.toString())
      rawFormData.append('priceHardcover', priceHardcover.toString())

      // Files
      if (files.image) rawFormData.set('image', files.image)
      if (files.coverPdfPaperback) rawFormData.set('coverPdfPaperback', files.coverPdfPaperback)
      if (files.coverPdfHardcover) rawFormData.set('coverPdfHardcover', files.coverPdfHardcover)
      if (files.manuscriptUrl) rawFormData.set('manuscriptUrl', files.manuscriptUrl)

      const result = await publishBookAction(rawFormData)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/bookstore')
        }, 3000)
      } else {
        toast.error("Error saving: " + result.error)
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Success State ───────────────────────────────────────
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

  // ─── Main Render ─────────────────────────────────────────
  const canSubmit = fullName && email && title && files.manuscriptUrl && (enablePaperback || enableHardcover) &&
    (!enablePaperback || files.coverPdfPaperback) && (!enableHardcover || files.coverPdfHardcover)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">

        {/* Page Header */}
        <div className="space-y-3 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100/50">
            <Sparkles size={12} />
            Global Print-on-Demand Console
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
            Publish Your Book
          </h1>
          <p className="text-slate-400 font-bold text-xs tracking-wide uppercase">
            Configure formats, specs, and pricing — then launch
          </p>
        </div>

        <div className="space-y-8">

          {/* ─── Section 1: Author & Book Identity ─── */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <User className="text-sky-600" size={18} />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Author & Book Identity</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Author Full Name *</label>
                  <input
                    required value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold text-sm"
                    placeholder="e.g. Stephen King"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Contact Email *</label>
                  <input
                    required value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold text-sm"
                    placeholder="publisher@domain.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Book Title *</label>
                  <input
                    required value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold text-sm"
                    placeholder="Title on cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subtitle</label>
                  <input
                    value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-bold text-sm"
                    placeholder="Optional secondary tagline"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─── Section 2: Print Format Selection ─── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 px-1">
              <BookOpen className="text-sky-600" size={18} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Print Formats</h2>
              <span className="text-[10px] font-bold text-slate-400 ml-auto uppercase tracking-wider">Select at least one</span>
            </div>

            <FormatCard
              format="paperback"
              enabled={enablePaperback}
              onToggle={togglePaperback}
              trimSpecs={PAPERBACK_TRIMS}
              selectedTrim={pbTrim}
              onTrimChange={setPbTrim}
              selectedInk={pbInk}
              onInkChange={setPbInk}
              selectedFinish={pbFinish}
              onFinishChange={setPbFinish}
              pageCount={pageCount}
              accentColor="sky"
              icon={<Book size={18} />}
              detectedSize={detectedSize}
            />

            <FormatCard
              format="hardcover"
              enabled={enableHardcover}
              onToggle={toggleHardcover}
              trimSpecs={HARDCOVER_TRIMS}
              selectedTrim={hcTrim}
              onTrimChange={setHcTrim}
              selectedInk={hcInk}
              onInkChange={setHcInk}
              selectedFinish={hcFinish}
              onFinishChange={setHcFinish}
              pageCount={pageCount}
              accentColor="violet"
              icon={<BookOpen size={18} />}
              detectedSize={detectedSize}
            />
          </section>

          {/* ─── Section 3: Book Details ─── */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <FileText className="text-sky-600" size={18} />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Book Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Genre</label>
                  <select
                    value={genre} onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-bold text-sm appearance-none cursor-pointer"
                  >
                    <option>Modern Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Business & Growth</option>
                    <option>Science Fiction</option>
                    <option>Romance</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Language</label>
                  <input
                    value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-bold text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Final Page Count *</label>
                  <input
                    type="number" value={pageCount} onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
                    readOnly={!!files.manuscriptUrl}
                    className={`w-full px-4 py-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-bold text-sm ${
                      files.manuscriptUrl 
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 cursor-not-allowed' 
                        : 'bg-slate-50 border-slate-100 focus:bg-white text-slate-900'
                    }`}
                  />
                  {files.manuscriptUrl && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Auto-detected from manuscript</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Marketing Synopsis & Description</label>
                <textarea
                  value={descriptionHtml} onChange={(e) => setDescriptionHtml(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-950 font-medium leading-relaxed resize-none text-sm"
                  placeholder="Provide a persuasive marketing copy for this book..."
                />
              </div>
            </div>
          </section>

          {/* ─── Section 4: Publishing Assets ─── */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <FileUp className="text-sky-600" size={18} />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Publishing Assets</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Paperback Cover PDF */}
                {enablePaperback && (
                  <div
                    onClick={() => fileInputRefs.coverPdfPaperback.current?.click()}
                    className={`group relative p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                      files.coverPdfPaperback ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <input type="file" ref={fileInputRefs.coverPdfPaperback} accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'coverPdfPaperback')} />
                    {uploadingField === 'coverPdfPaperback' ? <Loader2 className="animate-spin text-sky-600" size={22} /> :
                      files.coverPdfPaperback ? <CheckCircle2 className="text-emerald-500" size={22} /> : <FileUp className="text-slate-400 group-hover:scale-105 transition-transform" size={22} />}
                    <div>
                      <p className="text-xs font-black text-slate-800">{files.coverPdfPaperback ? files.coverPdfPaperback.name : 'Paperback Cover PDF *'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">High-quality PDF for paperback printing</p>
                    </div>
                  </div>
                )}

                {/* Hardcover Cover PDF */}
                {enableHardcover && (
                  <div
                    onClick={() => fileInputRefs.coverPdfHardcover.current?.click()}
                    className={`group relative p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                      files.coverPdfHardcover ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-violet-300'
                    }`}
                  >
                    <input type="file" ref={fileInputRefs.coverPdfHardcover} accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'coverPdfHardcover')} />
                    {uploadingField === 'coverPdfHardcover' ? <Loader2 className="animate-spin text-violet-600" size={22} /> :
                      files.coverPdfHardcover ? <CheckCircle2 className="text-emerald-500" size={22} /> : <FileUp className="text-slate-400 group-hover:scale-105 transition-transform" size={22} />}
                    <div>
                      <p className="text-xs font-black text-slate-800">{files.coverPdfHardcover ? files.coverPdfHardcover.name : 'Hardcover Cover PDF *'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">High-quality PDF for hardcover printing</p>
                    </div>
                  </div>
                )}

                {/* Manuscript */}
                <div
                  onClick={() => fileInputRefs.manuscriptUrl.current?.click()}
                  className={`group relative p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                    files.manuscriptUrl ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <input type="file" ref={fileInputRefs.manuscriptUrl} accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'manuscriptUrl')} />
                  {uploadingField === 'manuscriptUrl' ? <Loader2 className="animate-spin text-sky-600" size={22} /> :
                    files.manuscriptUrl ? <CheckCircle2 className="text-emerald-500" size={22} /> : <FileText className="text-slate-400 group-hover:scale-105 transition-transform" size={22} />}
                  <div>
                    <p className="text-xs font-black text-slate-800">{files.manuscriptUrl ? files.manuscriptUrl.name : 'Upload Manuscript *'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Final interior PDF file</p>
                  </div>
                </div>
            </div>
          </div>
        </section>

          {/* ─── Section 5: Pricing ─── */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <DollarSign className="text-sky-600" size={18} />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Pricing</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Always show Ebook */}
                <div className="space-y-1.5 p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Ebook USD ($)</label>
                  <input
                    type="number" step="0.01" value={priceEbook} onChange={(e) => setPriceEbook(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent outline-none text-slate-950 font-black text-2xl focus:text-sky-600 transition-colors"
                  />
                </div>

                {/* Paperback — only if enabled */}
                {enablePaperback && (
                  <div className="space-y-1.5 p-4 bg-sky-50/30 border border-sky-100 rounded-xl">
                    <label className="text-[9px] font-black uppercase tracking-wider text-sky-600 block">Paperback USD ($)</label>
                    <input
                      type="number" step="0.01" value={pricePaperback} onChange={(e) => setPricePaperback(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent outline-none text-slate-950 font-black text-2xl focus:text-sky-600 transition-colors"
                    />
                  </div>
                )}

                {/* Hardcover — only if enabled */}
                {enableHardcover && (
                  <div className="space-y-1.5 p-4 bg-violet-50/30 border border-violet-100 rounded-xl">
                    <label className="text-[9px] font-black uppercase tracking-wider text-violet-600 block">Hardcover USD ($)</label>
                    <input
                      type="number" step="0.01" value={priceHardcover} onChange={(e) => setPriceHardcover(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent outline-none text-slate-950 font-black text-2xl focus:text-violet-600 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ─── Submit Button ─── */}
          <div className="pt-2 pb-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !canSubmit}
              className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:bg-sky-600 transition-all disabled:opacity-40 active:scale-[0.99] shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Specifications & Launching...
                </>
              ) : (
                <>
                  Confirm & Launch Book
                  <Send size={16} />
                </>
              )}
            </button>
          </div>

        </div>

        <p className="mt-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          Integrated with automated Lulu Print-On-Demand pipelines.
        </p>
      </main>

      <Footer />
    </div>
  )
}