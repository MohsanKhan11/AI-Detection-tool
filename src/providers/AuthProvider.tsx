'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setIsAuthenticated } = useAuthStore()

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }
        
        setUser(session?.user ?? null)
        setIsAuthenticated(!!session?.user)
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', {
        event,
        hasSession: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email
        } : null
      })
      
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
    })

    // Initialize
    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setLoading, setIsAuthenticated])

  return <>{children}</>
}

// Export the store hook directly
export const useAuth = useAuthStore 