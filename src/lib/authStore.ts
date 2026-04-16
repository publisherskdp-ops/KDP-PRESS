import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  fullName: string
  email: string
  address?: string
  dob?: string
  phone?: string
  bankDetails?: {
    bankName: string
    accountHolder: string
    routingNumber: string
    accountNumber: string
  }
  taxInfo?: {
    ssn: string
    classification: string
    signature: string
  }
}

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isEmailVerified: boolean
  isOnboarded: boolean
  
  signup: (name: string, email: string) => void
  verifyEmail: () => void
  login: () => void
  completeOnboarding: (data: Partial<UserProfile>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isEmailVerified: false,
      isOnboarded: false,

      signup: (name, email) => set({ 
        user: { fullName: name, email }, 
        isEmailVerified: false,
        isAuthenticated: false 
      }),
      
      verifyEmail: () => set({ isEmailVerified: true }),
      
      login: () => set({ isAuthenticated: true }),
      
      completeOnboarding: (data) => set((state) => ({ 
        isOnboarded: true,
        user: state.user ? { ...state.user, ...data } : null
      })),
      
      logout: () => set({ user: null, isAuthenticated: false, isEmailVerified: false, isOnboarded: false })
    }),
    {
      name: 'kdp-auth-storage',
    }
  )
)
