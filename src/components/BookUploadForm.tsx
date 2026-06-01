"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useBookshelfStore } from "@/lib/store";
import { publishBookAction, updateBookDetailsAction } from "@/app/bookstore/actions";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { CheckCircle2, FileText, Image as ImageIcon, Upload } from "lucide-react";
import {
   PAPERBACK_TRIMS,
   HARDCOVER_TRIMS,
   getAvailableInkTypes,
   getAvailableFinishes,
   type InkPaperType
} from "@/lib/luluSpecs";

const getNormalizedInk = (ink: string): InkPaperType => {
   if (!ink) return 'Black & White / White';
   if (ink === 'Black & White Standard' || ink === 'Black & White / White') return 'Black & White / White';
   if (ink === 'Standard Color' || ink === 'Standard Color / White') return 'Standard Color / White';
   if (ink === 'Premium Color' || ink === 'Premium Color / White') return 'Premium Color / White';
   return ink as InkPaperType;
};

interface BookUploadFormProps {
   format?: string;
   initialData?: any; // <-- Added prop definition
   onClose?: () => void;
}

export default function BookUploadForm({ format = 'KDP', initialData, onClose }: BookUploadFormProps) {
   const [step, setStep] = useState(1);
   const [uploadProgress, setUploadProgress] = useState(0);
   const addBook = useBookshelfStore(state => state.addBook);

   const formatText = format === 'KDP' ? 'KDP eBook' : format.charAt(0).toUpperCase() + format.slice(1);

   const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
      values: {
         title: initialData?.title || '',
         subtitle: initialData?.subtitle || '',
         email: initialData?.email || '',
         series: initialData?.series || '',
         editionNumber: initialData?.editionNumber || '',
         primaryAuthor: initialData?.author || '', // Mapping book.author to form property
         contributors: initialData?.contributors || [{ name: '', role: 'Author' }],
         descriptionHtml: initialData?.descriptionHtml || '',
         publishingRights: initialData?.publishingRights || 'yes',
         primaryAudienceSexuallyExplicit: initialData?.primaryAudienceSexuallyExplicit || 'no',
         readingAgeMin: initialData?.readingAgeMin || 'Select',
         readingAgeMax: initialData?.readingAgeMax || 'Select',
         primaryMarketplace: initialData?.primaryMarketplace || 'Amazon.com',
         categories: initialData?.categories || [],
         keywords: initialData?.keywords || ['', '', '', '', '', '', ''],
         preOrder: initialData?.preOrder || 'release_now',
         drm: initialData?.drm || 'no',
         manuscript: null,
         cover: null,
         coverPdfFile: null,
         aiGenerated: initialData?.aiGenerated || 'no',
         isbn: initialData?.isbn || '',
         publisher: initialData?.publisher || '',
         kdpSelect: initialData?.kdpSelect || 'yes',
         territories: initialData?.territories || 'all',
         royalty: initialData?.[format]?.price ? '70' : '35',
         specification: initialData?.specification || 'ebook',
         pageCount: initialData?.pageCount || 0,

         // Paperback Specs
         paperbackTrimSize: initialData?.paperbackTrimSize || '6 x 9',
         paperbackInteriorColor: getNormalizedInk(initialData?.paperbackInteriorColor || ''),
         paperbackCoverFinish: initialData?.paperbackCoverFinish || 'Gloss',

         // Hardcover Specs
         hardcoverTrimSize: initialData?.hardcoverTrimSize || '6 x 9',
         hardcoverInteriorColor: getNormalizedInk(initialData?.hardcoverInteriorColor || ''),
         hardcoverCoverFinish: initialData?.hardcoverCoverFinish || 'Gloss',

         priceEbook: initialData?.priceEbook || 0,
         pricePaperback: initialData?.pricePaperback || 0,
         priceHardcover: initialData?.priceHardcover || 0,
         status: initialData?.status || 'PENDING'
      }
    });

    const watchedPbTrim = watch("paperbackTrimSize") || '6 x 9';
    const watchedPbInterior = watch("paperbackInteriorColor") || 'Black & White / White';
    const normalizedPbInterior = getNormalizedInk(watchedPbInterior);
    const availablePbInks = getAvailableInkTypes('paperback', watchedPbTrim);
    const availablePbFinishes = getAvailableFinishes('paperback', watchedPbTrim, normalizedPbInterior);

    const watchedHcTrim = watch("hardcoverTrimSize") || '6 x 9';
    const watchedHcInterior = watch("hardcoverInteriorColor") || 'Black & White / White';
    const normalizedHcInterior = getNormalizedInk(watchedHcInterior);
    const availableHcInks = getAvailableInkTypes('hardcover', watchedHcTrim);
    const availableHcFinishes = getAvailableFinishes('hardcover', watchedHcTrim, normalizedHcInterior);

    const router = useRouter();

   const { fields, append, remove } = useFieldArray({
      control,
      name: "contributors"
   });

   const nextStep = () => {
      setStep(s => Math.min(s + 1, 4));
      window.scrollTo(0, 0);
   };

   const onSubmit = async (data: any) => {
      if (step < 4) {
         nextStep();
         return;
      }

      setUploadProgress(10);
      const formData = new FormData();
      Object.keys(data).forEach(key => {
         if (key === 'contributors') {
            formData.append(key, JSON.stringify(data[key]));
         } else if (data[key] instanceof FileList) {
            // Only append if a file is actually selected
            if (data[key] && data[key].length > 0) {
               formData.append(key, data[key][0]);
               // Map to specific backend keys if needed
               if (key === 'manuscript') formData.append('manuscriptUrl', data[key][0]);
               if (key === 'cover') formData.append('image', data[key][0]);
               if (key === 'coverPdfFile') formData.append('coverPdf', data[key][0]);
            }
         } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
            // Map primaryAuthor to fullName for backend compatibility
            if (key === 'primaryAuthor') formData.append('fullName', data[key]);
            if (key === 'status') formData.set('status', data[key]); // Ensure status is explicitly set
         }
      });

      setUploadProgress(40);

      let result;
      if (initialData?.id) {
         // Update
         result = await updateBookDetailsAction(initialData.id, formData);
      } else {
         // Create
         result = await publishBookAction(formData);
      }

      setUploadProgress(100);

      if (result.success) {
         if (onClose) onClose();
         router.refresh();
      } else {
         toast.error("Error: " + result.error);
         setUploadProgress(0);
      }
   };

   const StepHeader = () => (
      <div className="flex gap-2 max-w-[1000px] mb-8">
         {[
            { id: 1, label: `${formatText} Details` },
            { id: 2, label: `Specifications` },
            { id: 3, label: `${formatText} Content` },
            { id: 4, label: `${formatText} Pricing` }
         ].map((tab) => (
            <div key={tab.id} className={`flex-1 flex flex-col p-4 border-b-4 transition-colors ${step === tab.id ? 'bg-white border-amber-500 shadow-sm' :
               step > tab.id ? 'bg-slate-50 border-green-500 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
               }`}>
               <span className="font-bold text-sky-800 text-sm md:text-lg">{tab.label}</span>
               <span className="text-xs font-semibold mt-1 flex items-center gap-1">
                  {step > tab.id ? <><div className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</div> Complete</> :
                     step === tab.id ? <><div className="w-4 h-4 bg-amber-500 rounded-full"></div> In Progress...</> : ''}
               </span>
            </div>
         ))}
      </div>
   );

   return (
      <div className="max-w-[1000px] mx-auto pb-12">
         <div className="flex items-center gap-2 mb-6">
            {onClose && <button type="button" onClick={onClose} className="text-sky-700 hover:underline font-semibold text-sm">{"< Back to Bookshelf"}</button>}
            <h1 className="text-2xl font-bold uppercase text-slate-700">{formatText} Setup</h1>
         </div>

         <StepHeader />

         <form className="space-y-6">

            {step === 1 && (
               <div className="space-y-6 text-sm">

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
                     <div className="w-1/4 font-bold text-slate-800">Language</div>
                     <div className="w-3/4">
                        <p className="text-slate-600 mb-2">Choose the primary language the book is written in. <span className="text-sky-700 hover:underline cursor-pointer">Supported languages</span></p>
                        <select className="border border-slate-300 rounded p-2 bg-white w-64 shadow-sm focus:ring-1 focus:ring-sky-500">
                           <option>English</option>
                        </select>
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
                     <div className="w-1/4 font-bold text-slate-800">Book Title</div>
                     <div className="w-3/4 space-y-4">
                        <p className="text-slate-600">Enter your title as it appears on the book cover. It must act naturally and follow Amazon formatting guidelines. <span className="text-sky-700 hover:underline cursor-pointer">Title entry guidelines</span></p>
                        <div>
                           <label className="font-bold text-slate-800 block mb-1">Book Title <span className="text-red-600">*</span></label>
                           <input {...register("title")} className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                           <label className="font-bold text-slate-800 block mb-1">Subtitle <span className="text-slate-400 font-normal">(Optional)</span></label>
                           <input {...register("subtitle")} className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500" />
                        </div>
                     </div>
                  </div>
                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
                     <div className="w-1/4 font-bold text-slate-800">Page Count</div>
                     <div className="w-3/4">
                        <p className="text-slate-600 mb-2">Enter the total number of pages in your book.</p>
                        <input type="number" {...register("pageCount")} className="border border-slate-300 rounded p-2 w-32 shadow-sm focus:ring-1 focus:ring-sky-500" />
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
                     <div className="w-1/4 font-bold text-slate-800">Author & Contact</div>
                     <div className="w-3/4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="font-bold text-slate-800 block mb-1">Author Name <span className="text-red-600">*</span></label>
                              <input {...register("primaryAuthor")} placeholder="Full Name (e.g. John Doe)" className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500" />
                           </div>
                           <div>
                              <label className="font-bold text-slate-800 block mb-1">Contact Email <span className="text-red-600">*</span></label>
                              <input {...register("email")} placeholder="email@example.com" className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
                     <div className="w-1/4 font-bold text-slate-800">Description</div>
                     <div className="w-3/4">
                        <p className="text-slate-600 mb-2">Summarize your book. This will be your product description on Amazon and cannot contain images. <span className="text-sky-700 hover:underline cursor-pointer">How to format your description</span></p>
                        <div className="border border-slate-300 rounded overflow-hidden shadow-sm">
                           <div className="bg-slate-50 border-b border-slate-300 p-2 flex gap-2">
                              <button type="button" className="px-2 font-bold hover:bg-slate-200 rounded">B</button>
                              <button type="button" className="px-2 italic hover:bg-slate-200 rounded">I</button>
                              <button type="button" className="px-2 underline hover:bg-slate-200 rounded">U</button>
                              <span className="w-px bg-slate-300 block"></span>
                              <select className="bg-transparent text-sm p-1 outline-none text-slate-600"><option>Format</option></select>
                           </div>
                           <textarea {...register("descriptionHtml")} rows={8} className="w-full p-3 focus:outline-none bg-white font-mono text-sm" placeholder="<p>Enter your description here...</p>"></textarea>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
                     <div className="w-1/4 font-bold text-slate-800">Publishing Status</div>
                     <div className="w-3/4">
                        <p className="text-slate-600 mb-4">Choose whether the book should be live on the store or in review status.</p>
                        <div className="flex gap-4">
                           <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all ${watch('status') === 'LIVE' ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                              <input type="radio" value="LIVE" {...register("status")} className="hidden" />
                              <div className={`w-4 h-4 rounded-full border-4 ${watch('status') === 'LIVE' ? 'border-emerald-500 bg-white' : 'border-slate-200'}`} />
                              <div className="text-left">
                                 <span className="block font-bold text-slate-800">LIVE</span>
                                 <span className="text-[10px] text-slate-500">Visible on Storefront</span>
                              </div>
                           </label>
                           <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all ${watch('status') === 'PENDING' ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                              <input type="radio" value="PENDING" {...register("status")} className="hidden" />
                              <div className={`w-4 h-4 rounded-full border-4 ${watch('status') === 'PENDING' ? 'border-amber-500 bg-white' : 'border-slate-200'}`} />
                              <div className="text-left">
                                 <span className="block font-bold text-slate-800">IN REVIEW</span>
                                 <span className="text-[10px] text-slate-500">Hidden from Public</span>
                              </div>
                           </label>
                        </div>
                     </div>
                  </div>

               </div>
            )}

            {step === 2 && (
               <div className="space-y-6 text-sm">
                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Paperback Specifications</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="font-bold text-slate-800 block mb-2">Trim Size</label>
                           <select {...register("paperbackTrimSize")} className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500">
                              {PAPERBACK_TRIMS.map(t => (
                                 <option key={t.value} value={t.value}>{t.label} ({t.metric})</option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label className="font-bold text-slate-800 block mb-2">Interior & Paper Type</label>
                           <select {...register("paperbackInteriorColor")} className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500">
                              {availablePbInks.map(ink => (
                                 <option key={ink} value={ink}>{ink}</option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label className="font-bold text-slate-800 block mb-2">Cover Finish</label>
                           <div className="flex gap-4">
                              {availablePbFinishes.map(f => (
                                 <label key={f} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value={f} {...register("paperbackCoverFinish")} /> {f === 'Gloss' ? 'Glossy' : 'Matte'}
                                 </label>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Hardcover Specifications</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="font-bold text-slate-800 block mb-2">Trim Size</label>
                           <select {...register("hardcoverTrimSize")} className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500">
                              {HARDCOVER_TRIMS.map(t => (
                                 <option key={t.value} value={t.value}>{t.label} ({t.metric})</option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label className="font-bold text-slate-800 block mb-2">Interior & Paper Type</label>
                           <select {...register("hardcoverInteriorColor")} className="border border-slate-300 rounded p-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500">
                              {availableHcInks.map(ink => (
                                 <option key={ink} value={ink}>{ink}</option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label className="font-bold text-slate-800 block mb-2">Cover Finish</label>
                           <div className="flex gap-4">
                              {availableHcFinishes.map(f => (
                                 <label key={f} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value={f} {...register("hardcoverCoverFinish")} /> {f === 'Gloss' ? 'Glossy' : 'Matte'}
                                 </label>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {step === 3 && (
               <div className="space-y-6 text-sm">

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
                     <div className="w-1/4 font-bold text-slate-800">Book Publishing Assets</div>
                     <div className="w-3/4 space-y-8">
                        {/* Manuscript Section */}
                        <div className="space-y-4">
                           <label className="font-bold text-slate-700 block text-xs uppercase tracking-wider">1. Book Manuscript (Internal PDF)</label>
                           <p className="text-slate-600 mb-2 text-xs">Upload the interior content of your book in PDF format.</p>
                           <input type="file" {...register("manuscript")} accept=".pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />

                           {(initialData?.manuscriptUrl || (watch('manuscript') as any)?.[0]) && (
                              <div className="border border-green-500 rounded p-4 bg-green-50 text-green-900 font-medium flex gap-2 items-start">
                                 <CheckCircle2 className="text-green-600 mt-1" size={18} />
                                 <div>
                                    <strong className="block text-base">Manuscript {(watch('manuscript') as any)?.[0]?.name || 'Current File'} {(watch('manuscript') as any)?.[0] ? 'selected' : 'active'}</strong>
                                    <span className="text-xs font-normal">
                                       {initialData?.manuscriptUrl ? `Current file: ${initialData.manuscriptUrl.split('/').pop()}` : 'File ready for processing.'}
                                    </span>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Cover PDF Section */}
                        <div className="space-y-4">
                           <label className="font-bold text-slate-700 block text-xs uppercase tracking-wider">2. Book Cover (Print-Ready PDF)</label>
                           <p className="text-slate-600 mb-2 text-xs">Upload your full book cover PDF for high-quality printing.</p>
                           <input type="file" {...register("coverPdfFile")} accept=".pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                           
                           {(initialData?.coverPdf || (watch('coverPdfFile') as any)?.[0]) && (
                              <div className="border border-sky-500 rounded p-4 bg-sky-50 text-sky-900 font-medium flex gap-2 items-start">
                                 <CheckCircle2 className="text-sky-600 mt-1" size={18} />
                                 <div>
                                    <strong className="block text-base">Cover PDF {(watch('coverPdfFile') as any)?.[0]?.name || 'Current File'} {(watch('coverPdfFile') as any)?.[0] ? 'selected' : 'active'}</strong>
                                    <span className="text-xs font-normal">
                                       {initialData?.coverPdf ? `Current file: ${initialData.coverPdf.split('/').pop()}` : 'File ready for printing.'}
                                    </span>
                                 </div>
                              </div>
                           )}
                        </div>

                         {/* Storefront Image Section - Only shown on Edit */}
                         {initialData?.id && (
                            <>
                               <div className="h-px bg-slate-100 w-full" />
                               <div className="space-y-4">
                                  <label className="font-bold text-slate-700 block text-xs uppercase tracking-wider">3. Storefront Display Image (Book Front Image)</label>
                                  <p className="text-slate-600 mb-2 text-xs">This image is what customers see on the Amazon and website storefront. JPG or PNG recommended.</p>
                                  <input type="file" {...register("cover")} accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />

                                  {initialData?.image && !watch('cover')?.[0] && (
                                     <div className="mt-4 flex gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                                        <div className="relative group">
                                           <img src={initialData.image} alt="Current Cover" className="w-24 h-36 object-cover rounded shadow-lg border-2 border-white transition-transform group-hover:scale-105" />
                                           <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                                              <CheckCircle2 size={12} />
                                           </div>
                                        </div>
                                        <div>
                                           <p className="text-sm font-bold text-slate-900">Current Storefront Image</p>
                                           <p className="text-xs text-slate-500 mt-1 leading-relaxed">This high-resolution image is currently active.<br />Uploading a new file will replace it.</p>
                                           <div className="mt-3 flex gap-2">
                                              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active</span>
                                              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">Public</span>
                                           </div>
                                        </div>
                                     </div>
                                  )}

                                  {(watch('cover') as any)?.[0] && (
                                     <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <CheckCircle2 size={16} /> New storefront image selected: {(watch('cover') as any)[0].name}
                                     </div>
                                  )}
                               </div>
                            </>
                         )}

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="space-y-4">
                           <strong className="block mb-2 text-slate-800">Digital Rights Management (DRM)</strong>
                           <p className="text-slate-600 mb-2">DRM protects the rights of copyright holders and prevents unauthorized distribution of your file.</p>
                           <div className="space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium"><input type="radio" value="yes" {...register("drm")} className="text-sky-600" /> Yes, apply Digital Rights Management</label>
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium"><input type="radio" value="no" {...register("drm")} className="text-sky-600" /> No, do not apply Digital Rights Management</label>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {step === 4 && (
               <div className="space-y-6 text-sm">
                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Pricing & Royalty</h2>
                     <p className="text-slate-600 mb-6">Set your list prices for each format. We automatically calculate a 70% royalty for you.</p>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                           <label className="font-bold text-slate-800 block">Kindle eBook Price (USD)</label>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                              <input type="number" step="0.01" {...register("priceEbook")} className="border border-slate-300 rounded pl-7 pr-3 py-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500 font-mono" />
                           </div>
                           <p className="text-[10px] text-slate-400">Recommended: $2.99 - $9.99</p>
                        </div>

                        <div className="space-y-2">
                           <label className="font-bold text-slate-800 block">Paperback Price (USD)</label>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                              <input type="number" step="0.01" {...register("pricePaperback")} className="border border-slate-300 rounded pl-7 pr-3 py-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500 font-mono" />
                           </div>
                           <p className="text-[10px] text-slate-400">Minimum: $6.50 (Printing cost)</p>
                        </div>

                        <div className="space-y-2">
                           <label className="font-bold text-slate-800 block">Hardcover Price (USD)</label>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                              <input type="number" step="0.01" {...register("priceHardcover")} className="border border-slate-300 rounded pl-7 pr-3 py-2 w-full shadow-sm focus:ring-1 focus:ring-sky-500 font-mono" />
                           </div>
                           <p className="text-[10px] text-slate-400">Minimum: $12.00 (Printing cost)</p>
                        </div>
                     </div>

                     {uploadProgress > 0 && (
                        <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                           <div className="flex justify-between font-bold text-xs text-slate-500 mb-2 uppercase tracking-widest">
                              <span>Syncing to Global Markets...</span> <span>{uploadProgress}%</span>
                           </div>
                           <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-sky-600 h-1.5 transition-all duration-500 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            )}

         </form>

         {/* Bottom Sticky Action Bar */}
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] z-40">
            <div className="max-w-[1000px] mx-auto flex justify-between items-center text-sm">
               <button type="button" onClick={() => setStep(Math.max(1, step - 1))} className="text-slate-700 font-bold px-4 hover:underline disabled:opacity-30" disabled={step === 1}>{"< Back to "}{(step === 2) ? 'Details' : (step === 3) ? 'Specifications' : 'Content'}</button>
               <div className="flex gap-4">
                  {step < 4 ? (
                     <button type="button" onClick={handleSubmit(onSubmit)} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-slate-900 font-bold rounded shadow-sm transition">Save and Continue</button>
                  ) : (
                     <button type="button" onClick={handleSubmit(onSubmit)} disabled={uploadProgress > 0} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-slate-900 font-bold rounded shadow-sm transition disabled:opacity-50 disabled:cursor-wait">
                        {initialData?.id ? 'Update Book' : `Publish Your ${formatText}`}
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
