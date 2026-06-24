import axios from 'axios'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config
  }

  const token = localStorage.getItem('studysync-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
