import { Sidebar } from '@/components/dashboard/sidebar'
import { WelcomeSection } from '@/components/dashboard/welcome-section'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { StudyProgressChart } from '@/components/dashboard/study-progress-chart'
import { UpcomingSessions } from '@/components/dashboard/upcoming-sessions'
import { ActiveStudyRooms } from '@/components/dashboard/active-study-rooms'
import { FriendsOnline } from '@/components/dashboard/friends-online'
import { Notifications } from '@/components/dashboard/notifications'
import { LeaderboardSection } from '@/components/dashboard/leaderboard-section'
import { AiWidget } from '@/components/dashboard/ai-widget'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-12 lg:pt-0">
          <WelcomeSection />
          <StatsGrid />

          {/* Main area */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <StudyProgressChart />
              <UpcomingSessions />
            </div>
            <div className="flex flex-col gap-6">
              <ActiveStudyRooms />
              <FriendsOnline />
              <Notifications />
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
