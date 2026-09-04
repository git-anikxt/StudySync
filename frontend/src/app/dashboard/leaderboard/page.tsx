'use client'

import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'

import { Sidebar } from '@/src/components/dashboard/sidebar'
import { rankBadge } from '@/src/components/dashboard/leaderboard-section'
import {
  getLeaderboard,
  type LeaderboardEntry,
} from '@/src/services/leaderboard'
import { getMyProfile } from '@/src/services/users'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadLeaderboard() {
      const [leaderboardResult, profileResult] = await Promise.allSettled([
        getLeaderboard(),
        getMyProfile(),
      ])

      if (!isMounted) return

      if (leaderboardResult.status === 'fulfilled') {
        setEntries(leaderboardResult.value)
        setError('')
      } else {
        setError(
          leaderboardResult.reason instanceof Error
            ? leaderboardResult.reason.message
            : 'Unable to load leaderboard.',
        )
      }

      if (profileResult.status === 'fulfilled') {
        setCurrentUserId(profileResult.value.user?._id ?? null)
      }

      setIsLoading(false)
    }

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  const maxXp = Math.max(...entries.map((entry) => entry.xp), 1)

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar active="Leaderboard" />

      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pt-12 lg:pt-0">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Leaderboard
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Top students across StudySync, ranked by XP, reputation, and
              streaks. Your row is highlighted.
            </p>
          </header>

          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Top 20
                </h2>

                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {entries.length} ranked
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {isLoading && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                    Loading leaderboard...
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {!isLoading && !error && entries.length === 0 && (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                    No leaderboard data yet. Complete activities to earn XP and
                    climb the ranks!
                  </div>
                )}

                {entries.map((entry) => {
                  const isYou =
                    currentUserId !== null && entry.userId === currentUserId

                  return (
                    <div
                      key={entry.userId ?? entry.rank}
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        isYou
                          ? 'border-primary/40 bg-accent'
                          : 'border-border bg-background'
                      }`}
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center">
                        {rankBadge(entry.rank)}
                      </div>

                      <img
                        src="/placeholder-user.jpg"
                        alt={entry.name}
                        className="size-10 shrink-0 rounded-full object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            {isYou && (
                              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                                You
                              </span>
                            )}

                            <p
                              className={`truncate text-sm font-semibold ${
                                isYou
                                  ? 'text-accent-foreground'
                                  : 'text-foreground'
                              }`}
                            >
                              {entry.name}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-foreground">
                            {entry.xp.toLocaleString()} XP
                          </p>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${(entry.xp / maxXp) * 100}%`,
                              }}
                            />
                          </div>

                          <span className="shrink-0 text-xs text-muted-foreground">
                            Lvl {entry.level}
                          </span>

                          <span className="shrink-0 text-xs text-muted-foreground">
                            Rep {entry.reputation.toLocaleString()}
                          </span>

                          <span className="shrink-0 text-xs text-muted-foreground">
                            Score {entry.score.toLocaleString()}
                          </span>

                          <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                            <Flame className="size-3 text-primary" />
                            {entry.streak}
                          </span>
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
