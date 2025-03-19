import qs from 'qs'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`
  }
})

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  try {
    const queryString = qs.stringify(urlParamsObject)
    const url = `${path}${queryString ? `?${queryString}` : ''}`
    
    const { next, ...axiosOptions } = options as any
    const { data } = await strapiApi.get(url, axiosOptions)
    
    return data
  } catch (error) {
    throw new Error(`Failed to fetch from Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getLandingPage() {
  try {
    const queryString = qs.stringify({
      populate: {
        hero: {
          populate: '*',
        },
        features: {
          populate: '*',
        },
        seo: {
          populate: '*',
        },
      },
    })

    const config: AxiosRequestConfig & { next?: { revalidate: number } } = {
      next: { revalidate: 60 }
    }

    const { data } = await strapiApi.get(`/landing-page?${queryString}`, config)

    if (!data?.data) {
      throw new Error('Invalid response structure from Strapi')
    }

    return data
  } catch (error) {
    throw new Error(`Failed to get landing page: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 