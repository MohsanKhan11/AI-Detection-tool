import { api } from '@/lib/axios'
import type { ApiResponse, DetectionResult } from '../types'

export const detectionApi = {
  analyzeText: async (text: string): Promise<ApiResponse<DetectionResult>> => {
    const response = await api.post<ApiResponse<DetectionResult>>('/detection/analyze', { text })
    return response.data
  },

  getHistory: async (): Promise<ApiResponse<DetectionResult[]>> => {
    const response = await api.get<ApiResponse<DetectionResult[]>>('/detection/history')
    return response.data
  },

  saveResult: async (result: DetectionResult): Promise<ApiResponse<DetectionResult>> => {
    const response = await api.post<ApiResponse<DetectionResult>>('/detection/save', result)
    return response.data
  }
} 