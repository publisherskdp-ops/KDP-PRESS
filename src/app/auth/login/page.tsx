"use client"

import React, { Suspense, useActionState, useEffect } from "react"
import Image from "next/image"
import { useAuthStore } from "@/lib/authStore"
import { useSearchParams } from "next/navigation"
import { login } from "@/app/actions/auth"

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

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
        
        <form action={action} className="space-y-5">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Username or Email</label>
            <input 
              required
              name="email"
              type="text" 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-900" 
              placeholder="e.g. admin or admin@example.com"
            />
            {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-bold text-slate-700">Password</label>
            </div>
            <input 
              required
              name="password"
              type="password" 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-900" 
              placeholder="Enter password"
            />
            {state?.errors?.password && <p className="text-red-500 text-sm mt-1">{state.errors.password}</p>}
          </div>
          
          {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}

          <button 
            type="submit"
            disabled={pending}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg shadow-md transition transform active:scale-95 disabled:opacity-50"
          >
            {pending ? 'Signing in...' : 'Sign in'}
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
