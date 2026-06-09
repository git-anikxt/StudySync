import { Crown, Medal, Flame } from 'lucide-react'

const leaders = [
  { rank: 1, name: 'Sofia Alvarez', avatar: '/avatars/avatar-1.png', xp: 18420, streak: 96, you: false },
  { rank: 2, name: 'You (Aniket)', avatar: '/avatars/avatar-2.png', xp: 17310, streak: 47, you: true },
  { rank: 3, name: 'Daniel Kim', avatar: '/avatars/avatar-4.png', xp: 16880, streak: 61, you: false },
  { rank: 4, name: 'Aisha Patel', avatar: '/avatars/avatar-3.png', xp: 15240, streak: 38, you: false },
  { rank: 5, name: 'Marcus Lee', avatar: '/avatars/avatar-5.png', xp: 14110, streak: 52, you: false },
]

function rankBadge(rank: number) {
  if (rank === 1) return <Crown className="size-4 text-chart-3" aria-label="1st place" />
  if (rank === 2) return <Medal className="size-4 text-muted-foreground" aria-label="2nd place" />
  if (rank === 3) return <Medal className="size-4 text-chart-4" aria-label="3rd place" />
  return <span className="text-sm font-semibold text-muted-foreground">{rank}</span>
}

export function LeaderboardSection() {
  const max = Math.max(...leaders.map((l) => l.xp))

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Leaderboard · Top 5
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            This week · Biology 201
          </p>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          Resets in 3d
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {leaders.map((l) => (
          <div
            key={l.rank}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${
              l.you ? 'border-primary/40 bg-accent' : 'border-border bg-background'
            }`}
          >
            <div className="flex size-7 shrink-0 items-center justify-center">
              {rankBadge(l.rank)}
            </div>
            <img
              src={l.avatar || "/placeholder.svg"}
              alt={l.name}
              className="size-9 shrink-0 rounded-full object-cover"
            />
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
  )
}
