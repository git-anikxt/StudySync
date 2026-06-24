'use client'

import { Calendar, Clock, Video, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getGoals, type Goal } from '@/src/services/goals'

export function UpcomingSessions() {
  const [goals, setGoals] = useState<Goal[]>([])

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadGoals() {
    setIsLoading(true)
    setError('')

    try {
      const nextGoals = await getGoals()

      setGoals(nextGoals)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load goals.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])



  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Upcoming study sessions
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={loadGoals}
        >
          Refresh
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {isLoading && (
          <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
            Loading goals...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-border bg-background p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!isLoading && !error && goals.length === 0 && (
          <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
            No goals yet.
          </div>
        )}

        {goals.map((goal, index) => (
          <div
            key={goal.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4"
          >
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${goal.completed || goal.status === 'completed'
                  ? 'bg-accent text-accent-foreground'
                  : index % 2 === 0
                    ? 'bg-primary/15 text-primary'
                    : 'bg-chart-2/15 text-chart-2'
                }`}
            >
              {goal.completed || goal.status === 'completed' ? (
                <Calendar className="size-5" />
              ) : index % 2 === 0 ? (
                <Video className="size-5" />
              ) : (
                <Users className="size-5" />
              )}
            </div>
            <div className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              {goal.completed || goal.status === 'completed'
  ? 'Completed'
  : 'Active'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {goal.title}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                <span aria-hidden="true">·</span>
                <span>{goal.completed || goal.status === 'completed' ? 'Completed' : 'Active'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
