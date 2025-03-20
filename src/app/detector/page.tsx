'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { detectText, getDetections, deleteDetection } from '@/app/actions/detection'
import DetectionForm from './components/DetectionForm'
import DetectionsList from './components/DetectionsList'
import SignOutButton from '@/components/SignOutButton'

export default function DetectorPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [detections, setDetections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth/signin')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadDetections()
    }
  }, [isAuthenticated])

  async function loadDetections() {
    try {
      const data = await getDetections()
      setDetections(data)
    } catch (error) {
      console.error('Error loading detections:', error)
    }
  }

  async function handleDetect(text: string) {
    setIsLoading(true)
    try {
      await detectText(text)
      await loadDetections()
    } catch (error) {
      console.error('Error detecting text:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDetection(id)
      await loadDetections()
    } catch (error) {
      console.error('Error deleting detection:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Redirecting to sign in...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">AI Content Detector</h1>
          <SignOutButton />
        </div>
        
        <DetectionForm onSubmit={handleDetect} isLoading={isLoading} />
        
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4">Detection History</h2>
          <DetectionsList detections={detections} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
} 