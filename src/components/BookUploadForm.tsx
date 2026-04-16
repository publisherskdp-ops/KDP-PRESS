"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useBookshelfStore } from "@/lib/store";

interface BookUploadFormProps {
  format?: 'kindle' | 'paperback' | 'hardcover';
  onClose?: () => void;
}

export default function BookUploadForm({ format = 'kindle', onClose }: BookUploadFormProps) {
  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const addBook = useBookshelfStore(state => state.addBook);

  const formatText = format === 'kindle' ? 'Kindle eBook' : format.charAt(0).toUpperCase() + format.slice(1);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '', subtitle: '', 
      series: '', editionNumber: '',
      primaryAuthor: '',
      contributors: [{ name: '', role: 'Author' }],
      descriptionHtml: '',
      publishingRights: 'yes',
      primaryAudienceSexuallyExplicit: 'no',
      readingAgeMin: 'Select', readingAgeMax: 'Select',
      primaryMarketplace: 'Amazon.com',
      categories: [], keywords: ['','','','','','',''],
      preOrder: 'release_now',
      
      drm: 'no',
      manuscript: null, cover: null, aiGenerated: 'no', isbn: '', publisher: '',
      
      kdpSelect: 'yes', territories: 'all', royalty: '70'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contributors"
  });

  const nextStep = () => {
    setStep(s => Math.min(s + 1, 3));
    window.scrollTo(0, 0);
  };

  const onSubmit = () => {
    // Mock save behavior matching KDP Flow
    if (step < 3) {
       nextStep();
       return;
    }
    
    // Simulate final step success mapping back to dashboard
    let prog = 0;
    const interval = setInterval(() => {
      prog += 30;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        addBook({
          id: Math.random().toString(),
          title: 'A New ' + formatText + ' Title',
          author: 'Current User',
          kindle: { status: format === 'kindle' ? 'IN_REVIEW' : 'NONE' },
          paperback: { status: format === 'paperback' ? 'IN_REVIEW' : 'NONE' },
          hardcover: { status: format === 'hardcover' ? 'IN_REVIEW' : 'NONE' }
        });
        if (onClose) onClose();
      }
    }, 400);
  };

  const StepHeader = () => (
    <div className="flex gap-2 max-w-[1000px] mb-8">
      {[
        { id: 1, label: `${formatText} Details` },
        { id: 2, label: `${formatText} Content` },
        { id: 3, label: `${formatText} Pricing` }
      ].map((tab) => (
        <div key={tab.id} className={`flex-1 flex flex-col p-4 border-b-4 transition-colors ${
          step === tab.id ? 'bg-white border-amber-500 shadow-sm' : 
          step > tab.id ? 'bg-slate-50 border-green-500 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <span className="font-bold text-sky-800 text-lg">{tab.label}</span>
          <span className="text-sm font-semibold mt-1 flex items-center gap-1">
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
               <div className="w-1/4 font-bold text-slate-800">Series</div>
               <div className="w-3/4">
                  <p className="text-slate-600 mb-4">Are you writing a book within a continuous storyline or world? Series pages collect your interrelated publications so readers can easily discover and follow the entire narrative arc.</p>
                  <button type="button" className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 font-bold bg-slate-50 hover:bg-slate-100 shadow-sm transition">Add series details</button>
               </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">Edition Number</div>
               <div className="w-3/4">
                  <p className="text-slate-600 mb-2">Provide an edition number if this title is an updated version of a previously published book. <span className="text-sky-700 hover:underline cursor-pointer">Learn what qualifies as a new edition</span></p>
                  <label className="font-bold text-slate-800 block mb-1">Edition Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input type="number" {...register("editionNumber")} className="border border-slate-300 rounded p-2 w-32 shadow-sm focus:ring-1 focus:ring-sky-500" />
               </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">Author</div>
               <div className="w-3/4">
                  <label className="font-bold text-slate-800 block mb-1">Primary Author or Contributor <span className="text-red-600">*</span></label>
                  <div className="flex gap-2">
                     <input {...register("primaryAuthor")} placeholder="First Name" className="border border-slate-300 rounded p-2 w-1/2 shadow-sm focus:ring-1 focus:ring-sky-500" />
                     <input placeholder="Last Name" className="border border-slate-300 rounded p-2 w-1/2 shadow-sm focus:ring-1 focus:ring-sky-500" />
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">Contributors</div>
               <div className="w-3/4 space-y-4">
                  <p className="text-slate-600">Add the people who worked on this book. <span className="text-sky-700 hover:underline cursor-pointer">Learn more about contributor roles</span></p>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                       <select {...register(`contributors.${index}.role`)} className="border border-slate-300 rounded p-2 w-1/4 bg-white shadow-sm focus:ring-1 focus:ring-sky-500">
                          <option value="Author">Author</option>
                          <option value="Editor">Editor</option>
                          <option value="Illustrator">Illustrator</option>
                       </select>
                       <input {...register(`contributors.${index}.name`)} placeholder="First Name" className="border border-slate-300 rounded p-2 w-1/4 shadow-sm focus:ring-1 focus:ring-sky-500" />
                       <input placeholder="Last Name" className="border border-slate-300 rounded p-2 w-1/4 shadow-sm focus:ring-1 focus:ring-sky-500" />
                       <button type="button" onClick={() => remove(index)} className="px-3 py-1.5 border border-slate-300 text-slate-700 font-bold bg-slate-50 hover:bg-slate-100 rounded shadow-sm">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => append({ name: '', role: 'Author'})} className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 font-bold bg-slate-50 hover:bg-slate-100 shadow-sm transition">Add another</button>
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
               <div className="w-1/4 font-bold text-slate-800">Primary Audience</div>
               <div className="w-3/4">
                  <div className="bg-sky-50 border border-sky-200 rounded p-4 text-sky-800 mb-4 flex gap-2 font-medium">
                     <span className="text-sky-600 font-bold text-lg">i</span>
                     Your primary audience range must relate to the <i>content target</i>. Sexually explicit images cannot be marked for children.
                  </div>
                  
                  <label className="font-bold text-slate-800 block mb-2">Sexually explicit images or title?</label>
                  <p className="text-slate-600 mb-2">Does this book show an illustration or photograph involving explicit sexual situations?</p>
                  <div className="flex gap-4 mb-6">
                     <label className="flex items-center gap-1 cursor-pointer"><input type="radio" value="yes" {...register("primaryAudienceSexuallyExplicit")} /> Yes</label>
                     <label className="flex items-center gap-1 cursor-pointer"><input type="radio" value="no" {...register("primaryAudienceSexuallyExplicit")} /> No</label>
                  </div>

                  <label className="font-bold text-slate-800 block mb-2">Reading age (Optional)</label>
                  <div className="flex gap-4">
                     <div className="w-1/2">
                       <label className="text-slate-600 block mb-1">Minimum</label>
                       <select className="border border-slate-300 rounded p-2 w-full bg-white shadow-sm focus:ring-1 focus:ring-sky-500"><option>Select</option></select>
                     </div>
                     <div className="w-1/2">
                       <label className="text-slate-600 block mb-1">Maximum</label>
                       <select className="border border-slate-300 rounded p-2 w-full bg-white shadow-sm focus:ring-1 focus:ring-sky-500"><option>Select</option></select>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">Keywords</div>
               <div className="w-3/4">
                  <p className="text-slate-600 mb-4">Choose up to 7 search keywords that describe your book. Search terms help readers easily find your book.</p>
                  <div className="grid grid-cols-2 gap-4">
                     {[0,1,2,3,4,5,6].map(i => (
                        <input key={i} {...register(`keywords.${i}`)} className="border border-slate-300 rounded p-2 shadow-sm focus:ring-1 focus:ring-sky-500 w-full" />
                     ))}
                  </div>
               </div>
            </div>

          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-sm">
            
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">Manuscript</div>
               <div className="w-3/4">
                  <p className="text-slate-600 mb-4">Upload your manuscript file. We recommend using a DOCX or EPUB file. <span className="text-sky-700 hover:underline cursor-pointer">See all supported formats</span></p>
                  <button type="button" className="bg-amber-500 hover:bg-amber-600 border border-amber-600 rounded px-6 py-1.5 font-bold text-slate-900 shadow-sm transition mb-6">Upload manuscript</button>
                  
                  <div className="border border-green-500 rounded p-4 bg-green-50 text-green-900 font-medium flex gap-2 items-start mb-8">
                     <span className="text-green-600 font-bold bg-white rounded-full w-5 h-5 flex items-center justify-center border border-green-500">✓</span>
                     <div>
                       <strong className="block text-base">Manuscript "Your_Book_Final.docx" uploaded successfully!</strong>
                       <span className="text-xs font-normal">Uploaded on April 9, 2026. File processing complete. Manuscript check complete.</span>
                     </div>
                  </div>

                  <strong className="block mb-2">Digital Rights Management (DRM)</strong>
                  <p className="text-slate-600 mb-2">DRM protects the rights of copyright holders and prevents unauthorized distribution of your file.</p>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 cursor-pointer"><input type="radio" value="yes" {...register("drm")} /> Yes, apply Digital Rights Management</label>
                     <label className="flex items-center gap-2 cursor-pointer"><input type="radio" value="no" {...register("drm")} /> No, do not apply Digital Rights Management</label>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">{formatText} Cover</div>
               <div className="w-3/4 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 opacity-50 cursor-not-allowed">
                     <label className="flex items-center gap-2 font-bold"><input type="radio" disabled /> Use Cover Creator to make your book cover</label>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-4">
                     <label className="flex items-center gap-2 font-bold mb-4"><input type="radio" defaultChecked /> Upload a cover you already have (JPG/TIFF only)</label>
                     <button type="button" className="bg-amber-500 hover:bg-amber-600 border border-amber-600 rounded px-6 py-1.5 font-bold text-slate-900 shadow-sm transition mb-4">Upload your cover file</button>
                     <div className="border border-green-500 rounded p-3 bg-green-50 text-green-900 font-bold flex gap-2 items-center">
                        <span className="text-green-600 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-green-500">✓</span>
                        Cover uploaded successfully!
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">AI-Generated Content</div>
               <div className="w-3/4">
                  <p className="text-slate-600 mb-4">Amazon is collecting information about the use of Artificial Intelligence (AI) tools in creating content. <span className="text-sky-700 hover:underline cursor-pointer">What is AI-generated content?</span></p>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
                     <label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" value="yes" {...register("aiGenerated")} /> Yes</label>
                     <label className="flex items-center gap-2 font-bold cursor-pointer"><input type="radio" value="no" {...register("aiGenerated")} /> No</label>
                  </div>
               </div>
            </div>

          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-sm">
             
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">KDP Select Enrollment</div>
               <div className="w-3/4">
                  <strong className="block mb-2">Reach more readers. Maximize your sales potential.</strong>
                  <p className="text-slate-600 mb-4">KDP Select is a free program offering to authors and publishers that helps you reach more readers and earn more money while keeping 100% control.</p>
                  <button type="button" className="bg-amber-500 hover:bg-amber-600 border border-amber-600 rounded px-6 py-1.5 font-bold text-slate-900 shadow-sm transition">Enroll in KDP Select</button>
               </div>
            </div>
            
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded flex gap-8">
               <div className="w-1/4 font-bold text-slate-800">Pricing, royalty, and distribution</div>
               <div className="w-3/4">
                  <strong className="block mb-2">Select a royalty plan and set your eBook list price below.</strong>
                  <div className="flex gap-6 mb-6">
                     <label className="flex items-center gap-1 font-bold text-base cursor-pointer"><input type="radio" value="35" {...register("royalty")} /> 35%</label>
                     <label className="flex items-center gap-1 font-bold text-base cursor-pointer"><input type="radio" value="70" {...register("royalty")} /> 70%</label>
                  </div>

                  {uploadProgress > 0 && (
                     <div className="mb-4">
                        <div className="flex justify-between font-bold text-xs text-slate-500 mb-1">
                          <span>Publishing to KDP Systems...</span> <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                           <div className="bg-amber-500 h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                     </div>
                  )}

                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-y border-slate-200 text-sky-800">
                        <tr>
                          <th className="p-3 font-semibold w-1/4">Marketplace</th>
                          <th className="p-3 font-semibold w-1/4">List Price</th>
                          <th className="p-3 font-semibold text-center w-1/6">Delivery</th>
                          <th className="p-3 font-semibold text-center w-1/6">Rate</th>
                          <th className="p-3 font-semibold text-right w-1/6">Royalty</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-bold text-slate-900">Amazon.com</td>
                          <td className="p-3">
                             <input type="number" defaultValue="9.99" className="w-20 border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-sky-500 text-right font-mono" /> USD
                          </td>
                          <td className="p-3 text-center text-slate-600">$0.00</td>
                          <td className="p-3 text-center text-sky-700 font-bold">70%</td>
                          <td className="p-3 text-right font-bold text-slate-900">$6.99</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">Amazon.co.uk</td>
                          <td className="p-3">
                             <input type="number" defaultValue="7.99" className="w-20 border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-sky-500 text-right font-mono disabled:opacity-50" disabled /> GBP
                          </td>
                          <td className="p-3 text-center text-slate-600">£0.00</td>
                          <td className="p-3 text-center text-sky-700 font-bold">70%</td>
                          <td className="p-3 text-right font-bold text-slate-900">£5.59</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

          </div>
        )}

      </form>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] z-40">
         <div className="max-w-[1000px] mx-auto flex justify-between items-center text-sm">
            <button type="button" onClick={() => setStep(Math.max(1, step - 1))} className="text-slate-700 font-bold px-4 hover:underline disabled:opacity-30" disabled={step === 1}>{"< Back to "}{(step === 2) ? 'Details' : 'Content'}</button>
            <div className="flex gap-4">
               <button type="button" className="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded shadow-sm hover:bg-slate-50 transition">Save as Draft</button>
               {step < 3 ? (
                  <button type="button" onClick={nextStep} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-slate-900 font-bold rounded shadow-sm transition">Save and Continue</button>
               ) : (
                  <button type="button" onClick={onSubmit} disabled={uploadProgress > 0} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-slate-900 font-bold rounded shadow-sm transition disabled:opacity-50 disabled:cursor-wait">Publish Your {formatText}</button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
