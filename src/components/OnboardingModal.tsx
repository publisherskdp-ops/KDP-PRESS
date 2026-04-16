"use client"

import React, { useState } from "react"
import { useAuthStore } from "@/lib/authStore"

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const completeOnboarding = useAuthStore(state => state.completeOnboarding)
  const user = useAuthStore(state => state.user)
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    address: "",
    dob: "",
    phone: "",
    bankName: "",
    accountHolder: "",
    routingNumber: "",
    accountNumber: "",
    ssn: "",
    classification: "Individual",
    signature: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    completeOnboarding({
      fullName: formData.fullName,
      address: formData.address,
      dob: formData.dob,
      phone: formData.phone,
      bankDetails: {
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        routingNumber: formData.routingNumber,
        accountNumber: formData.accountNumber
      },
      taxInfo: {
        ssn: formData.ssn,
        classification: formData.classification,
        signature: formData.signature
      }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 shadow-sm">
             <div className="text-red-600 bg-white rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center border border-red-300 font-bold text-lg animate-pulse">!</div>
             <div>
                <p className="text-sm font-bold text-red-900 uppercase tracking-tight">Action Required: Incomplete Account Information</p>
                <p className="text-xs text-red-800 mt-1">Please fill your details below. You cannot publish any books or receive royalty payments until your banking and tax profiles are completed.</p>
             </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Complete Account Information</h2>
          <p className="text-sm text-slate-500 mt-1">Required to publish and receive royalties</p>
          
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-amber-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="onboarding-form" onSubmit={handleSubmit} className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">1. Author Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full legal name</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="John Doe" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                    <input required name="address" value={formData.address} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Street, City, Zip" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input required name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="+1..." />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">2. Banking Details</h3>
                <p className="text-xs text-slate-500">Provide where you'd like to receive your monthly royalty payments.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Bank Name</label>
                    <input required name="bankName" value={formData.bankName} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Global Trust Bank" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Account Holder Name</label>
                    <input required name="accountHolder" value={formData.accountHolder} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Johnathan Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Routing Number</label>
                    <input required name="routingNumber" value={formData.routingNumber} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="9 digits" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Account Number</label>
                    <input required name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="..." />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">3. Tax Information & W-8 form</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tax Classification</label>
                    <select name="classification" value={formData.classification} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none bg-white">
                      <option>Individual</option>
                      <option>Corporation / LLC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">SSN or ITIN</label>
                    <input required name="ssn" value={formData.ssn} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none" placeholder="XXX-XX-XXXX" />
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-[10px] text-slate-600 leading-relaxed uppercase font-bold tracking-tight mb-3">W-8BEN Certification</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                      I certify that the beneficial owner is a resident of the country listed above... and I have the capacity to sign for the person identified on line 1 of this form.
                    </p>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Type your full name as E-Signature</label>
                    <input required name="signature" value={formData.signature} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-sky-500 outline-none font-serif italic text-lg" placeholder="Full legal name" />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-between">
          <button 
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2.5 text-slate-600 font-bold hover:underline disabled:opacity-0"
          >
            &larr; Previous
          </button>
          
          <div className="flex gap-3">
             {step < 3 ? (
               <button 
                 type="button"
                 onClick={nextStep}
                 className="px-8 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md transition transform active:scale-95"
               >
                 Next Step
               </button>
             ) : (
               <button 
                 type="submit"
                 form="onboarding-form"
                 className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg shadow-md transition transform active:scale-95"
               >
                 Complete & Finish
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
