import axios from 'axios'

interface ClerkWindow {
  Clerk?: {
    loaded?: boolean
    load: () => Promise<void>
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

  // Wait for Clerk to finish loading before reading a token, otherwise
  // mount-time requests fire unauthenticated and 401 (Clerk.load() is
  // idempotent — resolves immediately if already loaded).
  const clerk = (window as Window & ClerkWindow).Clerk
  if (clerk && !clerk.loaded) {
    await clerk.load()
  }
  const token = await clerk?.session?.getToken()

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
