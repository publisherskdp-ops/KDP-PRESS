"use client"

import React, { useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuthStore } from "@/lib/authStore"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

function LoginForm() {
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrUsername, password }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Sync local zustand store for backward-compatibility with other UI components
        useAuthStore.setState({
          user: { fullName: data.user.name, email: data.user.email },
          isAuthenticated: true,
          isEmailVerified: true,
          isOnboarded: true
        })
        
        toast.success("Successfully logged in!")
        
        // Push and refresh to trigger middleware check
        router.push(callbackUrl)
        router.refresh()
      } else {
        toast.error(data.error || "Invalid username/email or password.")
      }
    } catch (error) {
      console.error("Login request failed:", error)
      toast.error("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 block transition-transform hover:scale-105 active:scale-95">
        <Image 
          src="/kdppress Logo-01.png" 
          alt="KDP Press Logo" 
          width={500} 
          height={200} 
          className="object-contain h-32 w-auto"
          priority
        />
      </div>
      
      <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="text-slate-500 mt-2">Access your Author Central account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Username or Email</label>
            <input 
              required
              type="text" 
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-900" 
              placeholder="e.g. admin or admin@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-bold text-slate-700">Password</label>
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-900" 
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
          
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="keep" className="rounded text-sky-600" defaultChecked />
            <label htmlFor="keep" className="text-xs text-slate-600">Keep me signed in on this device</label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
