import { api } from '@/src/lib/api'

export interface StudySession {
  id: string
  startedAt?: string
  endedAt?: string
  duration?: number
  status?: string
}

interface SessionResponse {
  success?: boolean
  session?: StudySession
  data?: StudySession
}

function normalizeSession(rawSession: StudySession & { _id?: string }) {
  return {
    ...rawSession,
    id: rawSession.id ?? rawSession._id ?? '',
  }
}

function unwrapSession(data: SessionResponse | StudySession) {
  if ('session' in data && data.session) {
    return data.session
  }

  if ('data' in data && data.data) {
    return data.data
  }

  return data as StudySession
}

export async function startSession() {
  const { data } = await api.post<SessionResponse | StudySession>(
    '/sessions/start',
  )

  return normalizeSession(unwrapSession(data))
}

export async function endSession(id: string) {
  const { data } = await api.post<SessionResponse | StudySession>(
    `/sessions/${id}/end`,
  )

  return normalizeSession(unwrapSession(data))
}
