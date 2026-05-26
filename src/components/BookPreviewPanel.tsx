import React from "react";
import { BookOpen, AlertCircle } from "lucide-react";

interface BookPreviewPanelProps {
  formData: any;
  files: any;
}

export default function BookPreviewPanel({
  formData,
  files,
}: BookPreviewPanelProps) {
  return (
    <aside className="w-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 space-y-6 border border-slate-200 h-fit sticky top-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Live Book Preview
        </p>
        <div className="h-1 bg-gradient-to-r from-sky-500 to-violet-500 rounded-full" />
      </div>

      {/* Book Cover Preview */}
      <div className="space-y-3">
        <div className="aspect-[3/4] bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
          {files.image ? (
            <img
              src={URL.createObjectURL(files.image)}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <BookOpen size={32} className="text-slate-500" />
              <p className="text-xs text-slate-400 text-center px-4">
                Cover image preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Book Metadata */}
      <div className="space-y-3 bg-white rounded-xl p-4 border border-slate-100">
        <div>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            Title
          </p>
          <p className="text-sm font-black text-slate-900 mt-1 line-clamp-2">
            {formData.title || "Your Book Title"}
          </p>
        </div>

        {formData.subtitle && (
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Subtitle
            </p>
            <p className="text-xs font-medium text-slate-600 mt-1 line-clamp-2">
              {formData.subtitle}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            By
          </p>
          <p className="text-xs font-bold text-slate-700 mt-1">
            {formData.fullName || "Author Name"}
          </p>
        </div>
      </div>

      {/* Format Specs */}
      <div className="space-y-3 bg-white rounded-xl p-4 border border-slate-100">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
          Format Specifications
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-700">Paperback</p>
              <p className="text-[10px] text-slate-500">
                {formData.paperbackTrimSize} • {formData.paperbackInteriorColor}
              </p>
              <p className="text-[10px] text-slate-400">
                {formData.paperbackCoverFinish} Cover
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-700">Hardcover</p>
              <p className="text-[10px] text-slate-500">
                {formData.hardcoverTrimSize} • {formData.hardcoverInteriorColor}
              </p>
              <p className="text-[10px] text-slate-400">
                {formData.hardcoverCoverFinish} Cover
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="space-y-3 bg-white rounded-xl p-4 border border-slate-100">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
          Pricing
        </p>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600">Paperback</span>
            <span className="text-sm font-black text-slate-900">
              ${formData.pricePaperback.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600">Ebook</span>
            <span className="text-sm font-black text-slate-900">
              ${formData.priceEbook.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600">Hardcover</span>
            <span className="text-sm font-black text-slate-900">
              ${formData.priceHardcover.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Upload Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex gap-2">
          <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-blue-900">
              {files.manuscriptUrl && files.coverPdf
                ? "✓ Ready to publish"
                : "Missing required files"}
            </p>
            <p className="text-blue-700 mt-1">
              {files.manuscriptUrl ? "✓ Manuscript" : "○ Manuscript"} •{" "}
              {files.coverPdf ? "✓ Cover" : "○ Cover"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}