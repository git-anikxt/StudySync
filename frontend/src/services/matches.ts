import { api } from '@/src/lib/api'

export interface MatchUser {
  _id: string
  name: string
  semester: string
  subjects: string[]
  availability: string
  reputation: number
  xp: number
}

interface MatchesResponse {
  success?: boolean
  matches?: MatchUser[]
}

export async function getMatches() {
  const { data } = await api.get<MatchesResponse>('/matches')

  return data.matches ?? []
}
