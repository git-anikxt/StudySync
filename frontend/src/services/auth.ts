import { api } from '@/src/lib/api'

export interface AuthUser {
  id: string
  name?: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
}

export interface AuthResponse {
  token: string
  user?: AuthUser
}

function normalizeAuthResponse(data: unknown): AuthResponse {
  const response = data as Partial<AuthResponse> & {
    accessToken?: string
    jwt?: string
  }

  const token = response.token ?? response.accessToken ?? response.jwt

  if (!token) {
    throw new Error('Authentication response did not include a token.')
  }

  return {
    token,
    user: response.user,
  }
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post('/auth/login', payload)

  return normalizeAuthResponse(data)
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post('/auth/register', payload)

  return normalizeAuthResponse(data)
}
