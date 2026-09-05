import axios from 'axios'

interface ClerkWindow {
  Clerk?: {
    session?: {
      getToken: () => Promise<string | null>
    }
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    return config
  }

  const token = await (window as Window & ClerkWindow).Clerk?.session?.getToken()

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
