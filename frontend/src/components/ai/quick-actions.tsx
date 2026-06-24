'use client'

import { FileText, Layers, HelpCircle, Lightbulb, ArrowRight } from 'lucide-react'

const actions = [
  {
    key: 'summary',
    icon: FileText,
    title: 'Summary',
    desc: 'Key takeaways from your notes',
  },
  {
    key: 'flashcards',
    icon: Layers,
    title: 'Flashcards',
    desc: 'Turn notes into a study deck',
  },
  {
    key: 'quiz',
    icon: HelpCircle,
    title: 'Quiz',
    desc: 'Test yourself with questions',
  },
  {
    key: 'explain',
    icon: Lightbulb,
    title: 'Explain topic',
    desc: 'Break down a tricky concept',
  },
]

export function QuickActions({
  onAction,
}: {
  onAction: (key: string) => void
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        Quick actions
      </h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Generate study material instantly
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {actions.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => onAction(a.key)}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <a.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{a.title}</p>
              <p className="truncate text-xs text-muted-foreground">{a.desc}</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  )
}
