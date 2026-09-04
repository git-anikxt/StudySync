'use client'

import { Crown, Medal, Flame } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  getLeaderboard,
  type LeaderboardEntry,
} from '@/src/services/leaderboard'

export function rankBadge(rank: number) {
  if (rank === 1) return <Crown className="size-4 text-chart-3" aria-label="1st place" />
  if (rank === 2) return <Medal className="size-4 text-muted-foreground" aria-label="2nd place" />
  if (rank === 3) return <Medal className="size-4 text-chart-4" aria-label="3rd place" />
  return <span className="text-sm font-semibold text-muted-foreground">{rank}</span>
}

export function LeaderboardSection() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadLeaderboard() {
      try {
        const leaderboard = await getLeaderboard()

        if (isMounted) {
          setLeaders(leaderboard)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load leaderboard.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  const max = Math.max(...leaders.map((l) => l.xp), 1)

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/leaderboard">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Leaderboard · Top 5
            </h2>
          </Link>
          <p className="mt-0.5 text-sm text-muted-foreground">
            This week · Biology 201
          </p>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          Resets in 3d
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2">
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

        {leaders.slice(0, 5).map((l) => (
          <div
            key={l.rank}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${
              l.rank === 1 ? 'border-primary/40 bg-accent' : 'border-border bg-background'
            }`}
          >
            <div className="flex size-7 shrink-0 items-center justify-center">
              {rankBadge(l.rank)}
            </div>
            <img
              src="/placeholder-user.jpg"
              alt={l.name}
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`truncate text-sm font-semibold ${
                    l.rank === 1 ? 'text-accent-foreground' : 'text-foreground'
                  }`}
                >
                  {l.name}
                </p>
                <p className="shrink-0 text-sm font-semibold text-foreground">
                  {l.xp.toLocaleString()} XP
                </p>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(l.xp / max) * 100}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  Lvl {l.level}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  Rep {l.reputation.toLocaleString()}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  Score {l.score.toLocaleString()}
                </span>
                <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                  <Flame className="size-3 text-primary" />
                  {l.streak}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
