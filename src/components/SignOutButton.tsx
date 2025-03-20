'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { useAuthStore } from '@/store/authStore'

export default function SignOutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setIsAuthenticated } = useAuthStore()

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      setUser(null)
      setIsAuthenticated(false)
      router.push('/auth/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
} 