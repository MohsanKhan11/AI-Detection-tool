'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return <>{children}</>
}

// Export the store hook directly
export const useAuth = useAuthStore 