import { api } from '@/src/lib/api'

export interface LeaderboardEntry {
  rank: number
  userId?: string
  name: string
  xp: number
  reputation: number
  streak: number
  level: number
  score: number
}

interface LeaderboardResponse {
  success?: boolean
  leaderboard?: LeaderboardEntry[]
  leaders?: LeaderboardEntry[]
  rankings?: LeaderboardEntry[]
  users?: LeaderboardEntry[]
  data?: LeaderboardEntry[]
}

function normalizeLeaderboard(data: LeaderboardResponse | LeaderboardEntry[]) {
  if (Array.isArray(data)) {
    return data
  }

  return (
    data.leaderboard ??
    data.leaders ??
    data.rankings ??
    data.users ??
    data.data ??
    []
  )
}

export async function getLeaderboard() {
  const { data } = await api.get<LeaderboardResponse | LeaderboardEntry[]>(
    '/leaderboard',
  )

  return normalizeLeaderboard(data)
}
