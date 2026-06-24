'use client'

import { useState } from 'react'
import { RotateCw } from 'lucide-react'

export type Flashcard = {
  front: string
  back: string
}

function FlipCard({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className="group relative flex min-h-32 flex-col justify-between rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-primary/40"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {flipped ? 'Answer' : 'Question'}
      </span>
      <p className="text-sm font-medium leading-snug text-foreground text-pretty">
        {flipped ? card.back : card.front}
      </p>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
        <RotateCw className="size-3" />
        Flip
      </span>
    </button>
  )
}

export function FlashcardDeck({
  title,
  cards,
}: {
  title: string
  cards: Flashcard[]
}) {
  return (
    <div className="rounded-2xl border border-border bg-accent/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {cards.length} cards
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {cards.map((c, i) => (
          <FlipCard key={i} card={c} />
        ))}
      </div>
    </div>
  )
}
