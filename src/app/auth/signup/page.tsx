"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuthStore } from "@/lib/authStore"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  
  const signup = useAuthStore(state => state.signup)
  const verifyEmail = useAuthStore(state => state.verifyEmail)
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      signup(name, email)
      setIsSubmitting(false)
      setShowVerify(true)
    }, 1000)
  }

  const handleVerify = () => {
    verifyEmail()
    router.push("/auth/login")
  }

  if (showVerify) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <Link href="/" className="mb-10 block transition-transform hover:scale-105 active:scale-95">
          <Image 
            src="/logo.png" 
            alt="KDP Press Logo" 
            width={160} 
            height={50} 
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>
        <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
          <p className="text-slate-600">
            We've sent a verification link to <span className="font-semibold">{email}</span>. 
            Once you verify, you'll be able to access your bookshelf.
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1 italic">PROTIP (KDP-Clone-Internal):</p>
            Since this is a simulation, you can click the button below to "verify" instantly.
          </div>
          <button 
            onClick={handleVerify}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg shadow-md transition"
          >
            I've Verified My Email
          </button>
          <p className="text-sm text-slate-400">Didn't receive it? <span className="text-sky-600 cursor-pointer hover:underline">Resend email</span></p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-10 block transition-transform hover:scale-105 active:scale-95">
        <Image 
          src="/logo.png" 
          alt="KDP Press Logo" 
          width={180} 
          height={60} 
          className="object-contain h-12 w-auto"
          priority
        />
      </Link>
      
      <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="text-slate-500 mt-2">Publish your story to the world</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" 
              placeholder="First and last name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" 
              placeholder="name@domain.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" 
              placeholder="At least 8 characters"
            />
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Passwords are case sensitive</p>
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg shadow-md transition transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Create your KDP account'}
          </button>
          
          <p className="text-xs text-slate-500 text-center px-4 leading-relaxed">
            By creating an account, you agree to KDP Press's <span className="text-sky-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-sky-600 hover:underline cursor-pointer">Privacy Notice</span>.
          </p>
        </form>
        
        <div className="border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account? <Link href="/auth/login" className="text-sky-600 font-bold hover:underline">Sign in &rarr;</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
