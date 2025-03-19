'use server'

import { getSession } from './auth'
import { prisma } from '@/lib/prisma'
import { detectAIContent } from '@/lib/detection'
import { revalidatePath } from 'next/cache'

export async function detectText(text: string) {
  try {
    const session = await getSession()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    const result = await detectAIContent(text)
    
    const detection = await prisma.detectedText.create({
      data: {
        content: text,
        aiScore: result.aiScore,
        userId: user.id,
      },
    })

    revalidatePath('/detector')
    return { success: true, detection, result }
  } catch (error) {
    console.error('Detection error:', error)
    throw error
  }
}

export async function getDetections() {
  try {
    const session = await getSession()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    const detections = await prisma.detectedText.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return detections
  } catch (error) {
    console.error('Error getting detections:', error)
    throw error
  }
}

export async function deleteDetection(id: string) {
  try {
    const session = await getSession()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    const detection = await prisma.detectedText.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!detection || detection.userId !== user.id) {
      throw new Error('Not found')
    }

    await prisma.detectedText.delete({
      where: { id },
    })

    revalidatePath('/detector')
    return { success: true }
  } catch (error) {
    console.error('Error deleting detection:', error)
    throw error
  }
} 