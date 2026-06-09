import { Flame, Zap, Trophy, TrendingUp, Search, Bell } from 'lucide-react'

function HeroStat({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof Flame
  label: string
  value: string
  sub: string
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={`flex size-8 items-center justify-center rounded-lg ${tone}`}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

export function WelcomeSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Tuesday, June 9
          </p>
          <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back, Aniket
          </h1>
          <p className="mt-1 text-pretty text-muted-foreground">
            You&apos;re on a 47-day streak. Keep the momentum going today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 sm:flex">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search…"
              className="w-32 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground"
          >
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary" />
          </button>
        </div>
      </div>

      {/* Level progress banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-2xl"
        />
        <div className="grid gap-6 sm:grid-cols-4">
          <HeroStat
            icon={Trophy}
            label="Current level"
            value="Level 24"
            sub="Gold tier"
            tone="bg-chart-3/15 text-chart-3"
          />
          <HeroStat
            icon={Zap}
            label="Current XP"
            value="17,310"
            sub="1,690 to Level 25"
            tone="bg-accent text-accent-foreground"
          />
          <HeroStat
            icon={TrendingUp}
            label="Current rank"
            value="#2"
            sub="in Biology 201"
            tone="bg-chart-2/15 text-chart-2"
          />
          <HeroStat
            icon={Flame}
            label="Study streak"
            value="47 days"
            sub="Personal best: 61"
            tone="bg-primary/15 text-primary"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Progress to Level 25
            </span>
            <span className="text-muted-foreground">17,310 / 19,000 XP</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: '91%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
