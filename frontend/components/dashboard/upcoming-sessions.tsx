import { Calendar, Clock, Video, Users } from 'lucide-react'

const sessions = [
  {
    title: 'Macroeconomics review',
    time: 'Today · 4:00 PM',
    meta: 'with Maya R.',
    type: 'video',
    accent: 'bg-primary/15 text-primary',
  },
  {
    title: 'Organic Chemistry group',
    time: 'Today · 7:30 PM',
    meta: '4 partners',
    type: 'group',
    accent: 'bg-chart-2/15 text-chart-2',
  },
  {
    title: 'Calculus II problem set',
    time: 'Tomorrow · 10:00 AM',
    meta: 'with Leo K.',
    type: 'video',
    accent: 'bg-chart-3/15 text-chart-3',
  },
  {
    title: 'Cell Biology flashcards',
    time: 'Thu · 2:00 PM',
    meta: 'Solo focus',
    type: 'solo',
    accent: 'bg-accent text-accent-foreground',
  },
]

export function UpcomingSessions() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Upcoming study sessions
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {sessions.map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4"
          >
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${s.accent}`}
            >
              {s.type === 'video' ? (
                <Video className="size-5" />
              ) : s.type === 'group' ? (
                <Users className="size-5" />
              ) : (
                <Calendar className="size-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {s.title}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>{s.time}</span>
                <span aria-hidden="true">·</span>
                <span>{s.meta}</span>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
