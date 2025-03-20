import axios from 'axios'

const UNDETECTABLE_API_KEY = process.env.UNDETECTABLE_API_KEY
const UNDETECTABLE_API_URL = process.env.NEXT_UNDETECTABLE_API_URL!
const maxAttempts = Number(process.env.NEXT_MAX_DETECTION_ATTEMPTS) || 10
const delayMs = Number(process.env.NEXT_DETECTION_DELAY_MS) || 1000

const undetectableApi = axios.create({
  baseURL: UNDETECTABLE_API_URL.replace('/detect', ''),
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

export async function detectAIContent(text: string) {
  try {
    if (!UNDETECTABLE_API_KEY) {
      throw new Error('API key is not configured. Please set UNDETECTABLE_API_KEY in your environment variables.')
    }

    console.log('Making API request to:', UNDETECTABLE_API_URL)
    
    const { data } = await undetectableApi.post('/detect', {
      text,
      key: UNDETECTABLE_API_KEY,
      model: 'xlm_ud_detector',
      retry_count: 0
    })
    
    if (data.status === 'pending' && data.id) {
      return await pollForResults(data.id)
    }

    return {
      aiScore: data.result || 0,
      isAI: (data.result || 0) > 70,
    }
  } catch (error) {
    console.error('Error detecting AI content:', error)
    throw error
  }
}

async function pollForResults(id: string) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const { data } = await undetectableApi.post('/query', { id })
      
      if (data.status === 'done') {
        return {
          aiScore: data.result || 0,
          isAI: (data.result || 0) > 70, 
        }
      }

      await new Promise(resolve => setTimeout(resolve, delayMs))
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error)
      continue
    }
  }

  throw new Error('Timeout waiting for detection results')
} 