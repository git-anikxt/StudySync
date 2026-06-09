import { Trophy, Flame, Users, Sparkles } from 'lucide-react'

const notifications = [
  {
    icon: Trophy,
    tone: 'bg-chart-3/15 text-chart-3',
    text: 'You moved up to #2 in Biology 201',
    time: '12m ago',
  },
  {
    icon: Flame,
    tone: 'bg-primary/15 text-primary',
    text: 'Streak milestone: 47 days in a row!',
    time: '1h ago',
  },
  {
    icon: Users,
    tone: 'bg-chart-2/15 text-chart-2',
    text: 'Maya invited you to Macroeconomics review',
    time: '3h ago',
  },
  {
    icon: Sparkles,
    tone: 'bg-accent text-accent-foreground',
    text: 'Your AI quiz on Cell Biology is ready',
    time: '5h ago',
  },
]

export function Notifications() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Notifications
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${n.tone}`}
            >
              <n.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-foreground">{n.text}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
