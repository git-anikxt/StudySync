import { Flame, Crown, Medal } from 'lucide-react'

const leaders = [
  { rank: 1, name: 'Sofia Alvarez', xp: 18420, streak: 96, you: false },
  { rank: 2, name: 'You', xp: 17310, streak: 47, you: true },
  { rank: 3, name: 'Daniel Kim', xp: 16880, streak: 61, you: false },
  { rank: 4, name: 'Aisha Patel', xp: 15240, streak: 38, you: false },
  { rank: 5, name: 'Marcus Lee', xp: 14110, streak: 52, you: false },
]

function rankBadge(rank: number) {
  if (rank === 1)
    return <Crown className="size-4 text-chart-3" aria-label="1st place" />
  if (rank === 2)
    return <Medal className="size-4 text-muted-foreground" aria-label="2nd place" />
  if (rank === 3)
    return <Medal className="size-4 text-chart-4" aria-label="3rd place" />
  return <span className="text-sm font-semibold text-muted-foreground">{rank}</span>
}

export function LeaderboardPreview() {
  const max = Math.max(...leaders.map((l) => l.xp))

  return (
    <section id="leaderboard" className="px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Leaderboards
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Turn studying into a little friendly competition
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Weekly leaderboards across your friends, classes, and campus give
            you a reason to show up every day. Earn your spot at the top and keep
            it.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '1.2M', label: 'Sessions logged weekly' },
              { value: '4.8x', label: 'More consistent studying' },
              { value: '92%', label: 'Hit their weekly goal' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-semibold text-foreground">
                  {s.value}
                </p>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-2 shadow-xl shadow-foreground/5">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold text-foreground">
              This week · Biology 201
            </span>
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
              Resets in 3d
            </span>
          </div>
          <div className="flex flex-col gap-2 p-2">
            {leaders.map((l) => (
              <div
                key={l.rank}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  l.you
                    ? 'border-primary/40 bg-accent'
                    : 'border-border bg-background'
                }`}
              >
                <div className="flex size-7 shrink-0 items-center justify-center">
                  {rankBadge(l.rank)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-sm font-semibold ${
                        l.you ? 'text-accent-foreground' : 'text-foreground'
                      }`}
                    >
                      {l.name}
                    </p>
                    <p className="shrink-0 text-sm font-semibold text-foreground">
                      {l.xp.toLocaleString()} XP
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(l.xp / max) * 100}%` }}
                      />
                    </div>
                    <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                      <Flame className="size-3 text-primary" />
                      {l.streak}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
