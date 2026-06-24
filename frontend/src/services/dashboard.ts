import { api } from '@/src/lib/api'

export interface DashboardStats {
  xp: number
  level: number
  reputation: number
  streak: number
  studyHours: number
  badges: string[]
  accountabilityScore: number
  totalGoals: number
  completedGoals: number
  activeGoals: number
  activeContracts: number
  completedContracts: number
  missedContracts: number
}

export interface DashboardResponse {
  success: boolean
  stats: DashboardStats
}

export async function getDashboardData() {
  const { data } = await api.get<DashboardResponse>('/dashboard')

  return data.stats
}
