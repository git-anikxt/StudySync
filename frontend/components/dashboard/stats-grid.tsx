import { Clock, Zap, Users, CheckCircle2, ArrowUpRight } from 'lucide-react'

const stats = [
  {
    label: 'Study hours this week',
    value: '23.5h',
    delta: '+12%',
    icon: Clock,
    tone: 'bg-primary/15 text-primary',
  },
  {
    label: 'XP earned this week',
    value: '4,280',
    delta: '+8%',
    icon: Zap,
    tone: 'bg-chart-3/15 text-chart-3',
  },
  {
    label: 'Active study groups',
    value: '5',
    delta: '+1',
    icon: Users,
    tone: 'bg-chart-2/15 text-chart-2',
  },
  {
    label: 'Tasks completed',
    value: '38',
    delta: '+6',
    icon: CheckCircle2,
    tone: 'bg-accent text-accent-foreground',
  },
]

export function StatsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-3xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${s.tone}`}
            >
              <s.icon className="size-5" />
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              <ArrowUpRight className="size-3" />
              {s.delta}
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {s.value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </section>
  )
}
