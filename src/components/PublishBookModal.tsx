"use client"

import React, { useState } from "react"
import { X, Send, Sparkles, BookOpen, User, Mail, Hash } from "lucide-react"
import { publishBookAction } from "@/app/bookstore/actions"

export default function PublishBookModal({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    title: '',
    genre: 'Modern Fiction'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const result = await publishBookAction(formData)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        alert("Error saving to database: " + result.error)
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-12 text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Success!</h2>
          <p className="text-slate-500 font-medium">Our publishing experts will contact you shortly to discuss your masterpiece.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in slide-in-from-bottom-8 duration-500" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-10 pb-0 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
            <Sparkles size={12} />
            Start Your Journey
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Publish Your <span className="italic font-serif text-sky-600">Masterpiece</span>.
          </h2>
          <p className="text-slate-500 font-medium">Fill in the details below and let's bring your story to life.</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                  <User size={12} /> Full Name
                </label>
                <input 
                  required 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input 
                  required 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                <BookOpen size={12} /> Book Title
              </label>
              <input 
                required 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="The Chronicles of Eternity" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-medium" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                <Hash size={12} /> Genre / Category
              </label>
              <select 
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-slate-900 font-bold appearance-none cursor-pointer"
              >
                <option>Modern Fiction</option>
                <option>Non-Fiction</option>
                <option>Mystery & Crime</option>
                <option>Science Fiction</option>
                <option>Poetry</option>
                <option>Business & Growth</option>
              </select>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-sky-600 transition-all active:scale-95 group disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Submit Manuscript'}
              {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-10 pt-0 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            By submitting, you agree to our <span className="text-sky-600 cursor-pointer hover:underline">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  )
}
