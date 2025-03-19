'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const supabase = createClientComponentClient()
      
      const code = searchParams.get('code')
      
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
          router.push('/detector')
          router.refresh() 
        } catch (error) {
          console.error('Error verifying email:', error)
          router.push('/auth/signin?error=verification_failed')
        }
      } else {
        router.push('/auth/signin')
      }
    }

    handleEmailConfirmation()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
        <p>Please wait while we confirm your email address.</p>
      </div>
    </div>
  )
} 