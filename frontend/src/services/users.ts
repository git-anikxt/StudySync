import { api } from '@/src/lib/api'

export interface UserProfile {
  _id: string
  name: string
  email?: string
  avatar?: string
  xp?: number
  streak?: number
  level?: number
  reputation?: number
  accountabilityScore?: number
  studyHours?: number
  semester?: string
  subjects?: string[]
  availability?: string
  bio?: string
  badges?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ProfileResponse {
  success: boolean
  user?: UserProfile
}

export async function getMyProfile() {
  const { data } = await api.get<ProfileResponse>('/users/profile')

  return data
}