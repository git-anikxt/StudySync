import { Radio, Users, ArrowRight } from 'lucide-react'

const rooms = [
  { name: 'Finals Cram: Biology', members: 12, subject: 'Biology 201' },
  { name: 'Late Night Calculus', members: 7, subject: 'Math' },
  { name: 'Chem Lab Prep', members: 5, subject: 'Chemistry' },
]

export function ActiveStudyRooms() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Active study rooms
        </h2>
        <span className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {rooms.map((r) => (
          <button
            key={r.name}
            type="button"
            className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:border-primary/40"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Radio className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {r.name}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3" />
                {r.members} studying · {r.subject}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  )
}
