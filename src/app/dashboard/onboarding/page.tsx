"use client"
import { useState } from "react"
import Link from "next/link"

export default function Onboarding() {
  const [verified, setVerified] = useState(false)
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">Author Tax Interview</h2>
        <p className="text-muted-foreground mb-8">Please provide your W-9 information to receive royalty payouts.</p>
        
        {!verified ? (
          <form onSubmit={(e) => { e.preventDefault(); setTimeout(() => setVerified(true), 1500) }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Legal Name</label>
              <input required className="w-full p-3 rounded-lg border border-slate-300 bg-transparent" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">SSN / EIN</label>
              <input required type="password" placeholder="XXX-XX-XXXX" className="w-full p-3 rounded-lg border border-slate-300 bg-transparent" />
            </div>
            <button type="submit" className="w-full py-3 mt-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30">
              Submit Tax Forms securely via Stripe
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-6">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold">Tax Verified!</h3>
            <p className="text-muted-foreground">You are now ready to publish and earn 70% royalties globally.</p>
            <Link href="/dashboard" className="block w-full py-3 mt-4 bg-slate-900 text-white font-bold rounded-xl">
              Continue to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
