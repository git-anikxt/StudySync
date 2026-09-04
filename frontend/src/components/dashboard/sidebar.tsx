'use client'

import { useState } from 'react'
import { Logo } from '@/src/components/landing/logo'
import {
  LayoutDashboard,
  Users,
  Trophy,
  Calendar,
  BookOpen,
  Sparkles,
  Settings,
  Menu,
  X,
} from 'lucide-react'

import { type DashboardStats } from '@/src/services/dashboard'

const fallbackStats: Pick<DashboardStats, 'level' | 'badges'> = {
  level: 24,
  badges: ['Gold'],
}

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Study Rooms', icon: BookOpen, href: '/dashboard/study-rooms' },
  { label: 'Partners', icon: Users, href: '#' },
  { label: 'Sessions', icon: Calendar, href: '#' },
  { label: 'Leaderboard', icon: Trophy, href: '#' },
  { label: 'AI Tools', icon: Sparkles, href: '/dashboard/ai' },
]

export function Sidebar({
  active = 'Dashboard',
  stats,
}: {
  active?: string
  stats?: Pick<DashboardStats, 'level' | 'badges'>
}) {
  const [open, setOpen] = useState(false)
  const sidebarStats = stats ?? fallbackStats

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm lg:hidden"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card px-4 py-6 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-2">
          <Logo />
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                item.label === active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="size-5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <a
            href="#"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="size-5" />
            Settings
          </a>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <img
              src="/avatars/avatar-2.png"
              alt="Aniket Sharma"
              className="size-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                Aniket Sharma
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Level {sidebarStats.level} · {sidebarStats.badges[0] ?? 'Active'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
