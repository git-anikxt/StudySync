'use client'

import { Radio, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {  useEffect, useState } from 'react'

import {
  getStudyRooms,
  type StudyRoom,
} from '@/src/services/studyRooms'

export function ActiveStudyRooms() {
 
  const[rooms, setRooms] = useState<StudyRoom[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  

 async function loadRooms() {
  setIsLoading(true)
  setError('')

  try {
    const nextRooms =
      await getStudyRooms()

    setRooms(nextRooms)
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Unable to load rooms.'
    )
  } finally {
    setIsLoading(false)
  }
}

  useEffect(() => {
    loadRooms()
  }, [])


  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/study-rooms">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Active study rooms
          </h2>
        </Link>
        <span className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {isLoading && (
          <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
            Loading rooms...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-border bg-background p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!isLoading && !error && rooms.length === 0 && (
          <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
            No study rooms available.
          </div>
        )}

        {rooms.map((room) => (
  <Link
    key={room.id}
    href={`/dashboard/study-rooms/${room.id}`}
    className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:border-primary/40"
  >
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
      <Radio className="size-5" />
    </div>

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-foreground">
        {room.name}
      </p>

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Users className="size-3" />
        {room.subject}
      </p>
    </div>

    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
  </Link>
))}
      </div>
    </div>
  )
}
