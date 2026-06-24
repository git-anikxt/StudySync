import { api } from '@/src/lib/api'

export interface Goal {
  id: string
  title: string
  description?: string
  status?: string
  completed?: boolean
  completedAt?: string | null
  deadline?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CreateGoalPayload {
  title: string
  description: string
  deadline: string
}

export type UpdateGoalPayload = Partial<CreateGoalPayload> & {
  completed?: boolean
  status?: string
}

interface GoalsResponse {
  success?: boolean
  goal?: Goal
  goals?: Goal[]
  data?: Goal[]
  result?: Goal[]
}

function normalizeGoal(rawGoal: Goal & { _id?: string }) {
  return {
    ...rawGoal,
    id: rawGoal.id ?? rawGoal._id ?? '',
  }
}

function normalizeGoals(data: GoalsResponse | Goal[]) {
  const goals = Array.isArray(data)
    ? data
    : data.goals ?? data.data ?? data.result ?? []

  return goals.map(normalizeGoal)
}

export async function getGoals() {
  const { data } = await api.get<GoalsResponse | Goal[]>('/goals')

  return normalizeGoals(data)
}

export async function createGoal(payload: CreateGoalPayload) {
  const { data } = await api.post<GoalsResponse | Goal>('/goals', payload)

  return normalizeGoal('goal' in data && data.goal ? data.goal : (data as Goal))
}

export async function updateGoal(id: string, payload: UpdateGoalPayload) {
  const { data } = await api.patch<GoalsResponse | Goal>(
    `/goals/${id}`,
    payload,
  )

  return normalizeGoal('goal' in data && data.goal ? data.goal : (data as Goal))
}

export async function completeGoal(id: string) {
  const { data } = await api.patch<GoalsResponse | Goal>(
    `/goals/${id}/complete`,
  )

  return normalizeGoal('goal' in data && data.goal ? data.goal : (data as Goal))
}

export async function deleteGoal(id: string) {
  await api.delete(`/goals/${id}`)
}
