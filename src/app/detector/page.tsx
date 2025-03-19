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
  const { user, loading } = useAuth() //zustand
  const [detections, setDetections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadDetections()
    }
  }, [user])

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
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/signin')
    return null
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