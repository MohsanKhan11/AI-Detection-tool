import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { getSession } from '../app/actions/auth'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  checkSession: async () => {
    try {
      const session = await getSession()
      set({ user: session?.user ?? null })
    } catch (error) {
      console.error('Error checking session:', error)
      set({ user: null })
    } finally {
      set({ loading: false })
    }
  }
})) 