'use client'

import { useEffect, useState } from 'react'

import { Sidebar } from '@/src/components/dashboard/sidebar'
import {
  getMatches,
  type MatchUser,
} from '@/src/services/matches'

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchUser[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadMatches() {
      try {
        const nextMatches = await getMatches()

        if (isMounted) {
          setMatches(nextMatches)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Unable to load matches.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMatches()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar active="Partners" />

      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pt-12 lg:pt-0">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Study Partners
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Students matched to you by shared semester, availability, and
              overlapping subjects.
            </p>
          </header>

          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Your matches
                </h2>

                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {matches.length} match{matches.length === 1 ? '' : 'es'}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {isLoading && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                    Loading study partners...
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {!isLoading && !error && matches.length === 0 && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                    No study partners found yet. Matches are based on your
                    semester, availability, and overlapping subjects — new
                    partners appear as more students join or update their
                    profiles.
                  </div>
                )}

                {matches.map((match) => (
                  <div
                    key={match._id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
                  >
                    <img
                      src="/placeholder-user.jpg"
                      alt={match.name}
                      className="size-10 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {match.name}
                        </p>

                        <p className="shrink-0 text-sm font-semibold text-foreground">
                          {match.xp.toLocaleString()} XP
                        </p>
                      </div>

                      {match.subjects.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {match.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                        {match.semester && (
                          <span>Semester {match.semester}</span>
                        )}

                        {match.availability && (
                          <span>{match.availability}</span>
                        )}

                        <span>
                          Rep {match.reputation.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
