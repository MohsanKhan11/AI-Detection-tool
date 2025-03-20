import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { getSession } from '../app/actions/auth'

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setIsAuthenticated: (value: boolean) => void
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
  },
  setLoading: (loading) => {
    set({ loading })
  },
  setIsAuthenticated: (value) => {
    set({ isAuthenticated: value })
  },
  checkSession: async () => {
    try {
      const session = await getSession()
      set({ 
        user: session?.user ?? null,
        isAuthenticated: !!session?.user
      })
    } catch (error) {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ loading: false })
    }
  }
})) 