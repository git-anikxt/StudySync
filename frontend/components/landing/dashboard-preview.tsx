import {
  Flame,
  Trophy,
  Users,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export function DashboardPreview() {
  return (
    <section className="relative px-4 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative animate-float rounded-3xl border border-border bg-card p-2 shadow-2xl shadow-foreground/5">
          {/* window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3">
            <span className="size-3 rounded-full bg-destructive/60" />
            <span className="size-3 rounded-full bg-chart-3/70" />
            <span className="size-3 rounded-full bg-primary/70" />
            <div className="ml-4 hidden h-6 flex-1 items-center rounded-md bg-muted px-3 text-xs text-muted-foreground sm:flex">
              app.studysync.com/dashboard
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl bg-muted/40 p-3 sm:grid-cols-3 sm:p-4">
            {/* streak + xp column */}
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Current streak
                  </span>
                  <Flame className="size-4 text-primary" />
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-semibold text-foreground">
                    47
                  </span>
                  <span className="pb-1 text-sm text-muted-foreground">
                    days
                  </span>
                </div>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-7 flex-1 rounded-md ${
                        i < 6 ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total XP
                  </span>
                  <Zap className="size-4 text-chart-3" />
                </div>
                <div className="mt-2 text-3xl font-semibold text-foreground">
                  12,840
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-primary">
                  <TrendingUp className="size-4" />
                  +320 today
                </div>
              </div>
            </div>

            {/* main panel */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Today&apos;s sessions
                </span>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                  3 of 4 done
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                {[
                  {
                    title: 'Organic Chemistry — Group',
                    meta: '4 partners · 50 min',
                    done: true,
                  },
                  {
                    title: 'Linear Algebra flashcards',
                    meta: 'Solo · 25 min',
                    done: true,
                  },
                  {
                    title: 'AI quiz: Cell Biology',
                    meta: 'Generated · 18 questions',
                    done: true,
                  },
                  {
                    title: 'Macroeconomics review',
                    meta: 'with Maya · in 2h',
                    done: false,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    {item.done ? (
                      <CheckCircle2 className="size-5 shrink-0 text-primary" />
                    ) : (
                      <Clock className="size-5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* floating badges */}
        <div className="absolute -left-2 top-24 hidden animate-float rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:flex sm:items-center sm:gap-2 [animation-delay:1s]">
          <Trophy className="size-5 text-chart-3" />
          <div>
            <p className="text-xs text-muted-foreground">Rank</p>
            <p className="text-sm font-semibold text-foreground">#2 in class</p>
          </div>
        </div>
        <div className="absolute -right-2 bottom-16 hidden animate-float rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:flex sm:items-center sm:gap-2 [animation-delay:2s]">
          <Users className="size-5 text-chart-2" />
          <div>
            <p className="text-xs text-muted-foreground">Study group</p>
            <p className="text-sm font-semibold text-foreground">5 online now</p>
          </div>
        </div>
      </div>
    </section>
  )
}
