import { api } from '@/src/lib/api'

export interface SessionRoom {
  _id: string
  name: string
  subject: string
}

export interface StudySession {
  _id: string
  startTime: string
  endTime?: string
  duration: number
  roomId?: SessionRoom | null
}

interface SessionsResponse {
  success?: boolean
  sessions?: StudySession[]
}

export async function getMySessions() {
  const { data } = await api.get<SessionsResponse>('/sessions')

  return data.sessions ?? []
}
