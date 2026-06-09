const friends = [
  { name: 'Maya R.', avatar: '/avatars/avatar-1.png', status: 'In a session', online: true },
  { name: 'Leo K.', avatar: '/avatars/avatar-4.png', status: 'Studying Calculus', online: true },
  { name: 'Priya S.', avatar: '/avatars/avatar-3.png', status: 'Available', online: true },
  { name: 'Daniel K.', avatar: '/avatars/avatar-5.png', status: 'Away', online: false },
]

export function FriendsOnline() {
  const onlineCount = friends.filter((f) => f.online).length

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Friends online
        </h2>
        <span className="text-sm text-muted-foreground">
          {onlineCount} online
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {friends.map((f) => (
          <div key={f.name} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={f.avatar || "/placeholder.svg"}
                alt={f.name}
                className="size-10 rounded-full object-cover"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${
                  f.online ? 'bg-primary' : 'bg-muted-foreground/40'
                }`}
                aria-label={f.online ? 'Online' : 'Offline'}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {f.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {f.status}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-accent"
            >
              Invite
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
