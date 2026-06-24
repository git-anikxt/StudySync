'use client'

import { useEffect, useState } from 'react'

import { Sidebar } from '@/src/components/dashboard/sidebar'
import { WelcomeSection } from '@/src/components/dashboard/welcome-section'
import { StatsGrid } from '@/src/components/dashboard/stats-grid'
import { StudyProgressChart } from '@/src/components/dashboard/study-progress-chart'
import { UpcomingSessions } from '@/src/components/dashboard/upcoming-sessions'
import { ActiveStudyRooms } from '@/src/components/dashboard/active-study-rooms'
import { FriendsOnline } from '@/src/components/dashboard/friends-online'
import { Notifications } from '@/src/components/dashboard/notifications'
import { LeaderboardSection } from '@/src/components/dashboard/leaderboard-section'
import { AiWidget } from '@/src/components/dashboard/ai-widget'
import {
  getDashboardData,
  type DashboardStats,
} from '@/src/services/dashboard'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      try {
        const dashboardStats = await getDashboardData()

        if (isMounted) {
          setStats(dashboardStats)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load dashboard data.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-12 lg:pt-0">
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading dashboard...
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-muted/30">
        <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-12 lg:pt-0">
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-destructive">
              {error || 'Unable to load dashboard data.'}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar stats={stats} />
      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-12 lg:pt-0">
          <WelcomeSection stats={stats} />
          <StatsGrid stats={stats} />

          {/* Main area */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <StudyProgressChart studyHours={stats.studyHours} />
              <UpcomingSessions />
            </div>
            <div className="flex flex-col gap-6">
              <ActiveStudyRooms />
              <FriendsOnline />
              <Notifications stats={stats} />
            </div>
          </div>

          {/* AI widget */}
          <AiWidget />

          {/* Leaderboard */}
          <LeaderboardSection />
        </div>
      </main>
    </div>
  )
}
