import { FileText, Layers, HelpCircle, MessageSquare } from 'lucide-react'

const sessions = [
  {
    icon: Layers,
    title: 'Chemistry flashcards',
    meta: '24 cards · 2h ago',
  },
  {
    icon: FileText,
    title: 'Calculus summary',
    meta: 'Ch.4 · Yesterday',
  },
  {
    icon: HelpCircle,
    title: 'History practice quiz',
    meta: '10 questions · 2d ago',
  },
  {
    icon: MessageSquare,
    title: 'Biology Q&A',
    meta: '8 messages · 3d ago',
  },
]

export function RecentSessions() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        Recent AI sessions
      </h2>
      <ul className="mt-3 flex flex-col gap-1.5">
        {sessions.map((s) => (
          <li key={s.title}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-muted"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {s.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.meta}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
