'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

import { Sidebar } from '@/src/components/dashboard/sidebar'
import {
  getMySessions,
  type StudySession,
} from '@/src/services/sessions'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadSessions() {
      try {
        const nextSessions = await getMySessions()

        if (isMounted) {
          setSessions(nextSessions)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Unable to load sessions.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSessions()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar active="Sessions" />

      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pt-12 lg:pt-0">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Session History
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Your past study sessions, newest first.
            </p>
          </header>

          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Recent sessions
                </h2>

                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {sessions.length} session{sessions.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {isLoading && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                    Loading sessions...
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {!isLoading && !error && sessions.length === 0 && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                    No study sessions recorded yet. Your completed study
                    sessions will appear here.
                  </div>
                )}

                {sessions.map((session) => {
                  const startTime = new Date(session.startTime)
                  const isComplete = Boolean(session.endTime)

                  return (
                    <div
                      key={session._id}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Clock className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {session.roomId?.name ?? 'Solo session'}
                          </p>

                          <p className="shrink-0 text-sm font-semibold text-foreground">
                            {isComplete
                              ? `${session.duration} min`
                              : 'In progress'}
                          </p>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                          <span>
                            {startTime.toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>

                          <span>
                            {startTime.toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>

                          {session.roomId?.subject && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{session.roomId.subject}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
