'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, Radio, Users } from 'lucide-react'

import { Sidebar } from '@/src/components/dashboard/sidebar'
import {
  createStudyRoom,
  getStudyRooms,
  type StudyRoom,
} from '@/src/services/studyRooms'

export default function StudyRoomsPage() {
  const [rooms, setRooms] = useState<StudyRoom[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState('')

  async function loadRooms() {
    setIsLoading(true)
    setError('')

    try {
      const nextRooms = await getStudyRooms()
      setRooms(nextRooms)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load rooms.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !subject.trim()) return

    setSubmitting(true)
    setCreateError('')

    try {
      await createStudyRoom({
        name: name.trim(),
        subject: subject.trim(),
      })

      setName('')
      setSubject('')

      await loadRooms()
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : 'Failed to create room.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar active="Study Rooms" />

      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pt-12 lg:pt-0">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Study Rooms
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Browse rooms, pick a subject, and study together. Create your own
              room to invite classmates.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Create room */}
            <div className="lg:col-span-4">
              <form
                onSubmit={handleCreateRoom}
                className="rounded-3xl border border-border bg-card p-6"
              >
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Create room
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Start a new study room for you and your peers.
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Room name"
                    className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />

                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />

                  {createError && (
                    <p className="text-sm text-destructive">{createError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !subject.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                    {submitting ? 'Creating…' : 'Create room'}
                  </button>
                </div>
              </form>
            </div>

            {/* Rooms list */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    All study rooms
                  </h2>

                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                    {rooms.length} room{rooms.length === 1 ? '' : 's'}
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
                      No study rooms available. Create the first one!
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}