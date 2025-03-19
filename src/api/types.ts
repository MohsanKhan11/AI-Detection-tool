export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

export interface DetectionResult {
  text: string
  score: number
  isAI: boolean
  confidence: number
}

export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
} 