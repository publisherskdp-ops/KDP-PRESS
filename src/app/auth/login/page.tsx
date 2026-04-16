"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/authStore"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const login = useAuthStore(state => state.login)
  const isEmailVerified = useAuthStore(state => state.isEmailVerified)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      login()
      setIsSubmitting(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="text-3xl font-black tracking-tight text-sky-700 mb-10">
        KDP<span className="text-amber-500">Press</span>
      </Link>
      
      <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="text-slate-500 mt-2">To continue to your bookshelf</p>
        </div>
        
        {!isEmailVerified && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-xs text-amber-800">
             Warning: This account's email is not yet verified. You should normally verify via signup first, but for testing purposes, you can still sign in.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-bold text-slate-700">Password</label>
              <span className="text-xs text-sky-600 hover:underline cursor-pointer">Forgot your password?</span>
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" 
              placeholder="Enter password"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg shadow-md transition transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" id="keep" className="rounded text-sky-600" />
            <label htmlFor="keep" className="text-xs text-slate-600">Keep me signed in. <span className="text-sky-600 cursor-pointer">Details &rarr;</span></label>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">New to KDP Press?</span></div>
        </div>

        <Link 
          href="/auth/signup"
          className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-center font-bold py-2.5 rounded-lg shadow-sm transition block"
        >
          Create your KDP Press account
        </Link>
      </div>
    </div>
  )
}
