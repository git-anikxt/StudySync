'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, LogOut, Radio, Send } from 'lucide-react'

import { Sidebar } from '@/src/components/dashboard/sidebar'
import { socket } from '@/src/lib/socket'
import { getRoomMessages, type ChatMessage } from '@/src/services/chat'
import { getMyProfile, type UserProfile } from '@/src/services/users'
import {
  getRoomParticipants,
  joinStudyRoom,
  leaveStudyRoom,
  type StudyRoomWithParticipants,
} from '@/src/services/studyRooms'

function isAlreadyJoined(err: unknown) {
  const e = err as {
    response?: { status?: number; data?: { message?: string } }
  }

  return (
    e.response?.status === 400 &&
    e.response.data?.message === 'Already joined'
  )
}

export default function StudyRoomDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const roomId = params?.id ?? ''

  const [room, setRoom] = useState<StudyRoomWithParticipants | null>(null)
  const [me, setMe] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load room, profile, history, and join — all in parallel on mount.
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')

      const [roomR, profileR, historyR, joinR] =
        await Promise.allSettled([
          getRoomParticipants(roomId),
          getMyProfile(),
          getRoomMessages(roomId),
          joinStudyRoom(roomId),
        ])

      if (cancelled) return

      if (roomR.status === 'rejected' || !roomR.value) {
        setError('Room not found.')
        setLoading(false)
        return
      }

      setRoom(roomR.value)

      if (profileR.status === 'rejected') {
        setError('Failed to load your profile.')
        setLoading(false)
        return
      }

      setMe(profileR.value.user ?? null)

      if (historyR.status === 'rejected') {
        setError('Failed to load messages.')
        setLoading(false)
        return
      }

      setMessages(historyR.value)

      if (joinR.status === 'rejected' && !isAlreadyJoined(joinR.reason)) {
        setError('Failed to join the room.')
        setLoading(false)
        return
      }

      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [roomId])

  // Socket lifecycle: join the room when connected, listen for incoming
  // messages, and tear everything down on unmount. The listener is removed in
  // cleanup, so React Strict Mode's double-invoke never double-subscribes.
  useEffect(() => {
    if (!roomId) return

    socket.connect()

    const joinRoom = () => socket.emit('join-room', roomId)

    if (socket.connected) {
      joinRoom()
    }

    socket.on('connect', joinRoom)

    const handleReceive = (msg: ChatMessage) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg],
      )
    }

    socket.on('receive-message', handleReceive)

    return () => {
      socket.off('connect', joinRoom)
      socket.off('receive-message', handleReceive)
      socket.emit('leave-room', roomId)
      socket.disconnect()
    }
  }, [roomId])

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()

    const text = input.trim()

    if (!text || !me) return

    // The backend persists the message and broadcasts it back via
    // 'receive-message', which is what appends it to the UI.
    socket.emit('send-message', {
      roomId,
      senderId: me._id,
      senderName: me.name,
      message: text,
    })

    setInput('')
  }

  async function handleLeave() {
    try {
      await leaveStudyRoom(roomId)
    } catch (err) {
      console.error(err)
    } finally {
      socket.emit('leave-room', roomId)
      socket.disconnect()
      router.push('/dashboard/study-rooms')
    }
  }

  const participants = Array.from(
    new Map((room?.participants ?? []).map((p) => [p._id, p])).values()
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar active="Study Rooms" />

      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pt-12 lg:pt-0">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Link
                href="/dashboard/study-rooms"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                All study rooms
              </Link>

              {room && (
                <>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground text-balance">
                    {room.name}
                  </h1>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Radio className="size-4" />
                    {room.subject}
                  </p>
                </>
              )}
            </div>

            {room && !loading && !error && (
              <button
                type="button"
                onClick={handleLeave}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
              >
                <LogOut className="size-4" />
                Leave room
              </button>
            )}
          </header>

          {loading && (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading room...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm text-destructive">{error}</p>

              <Link
                href="/dashboard/study-rooms"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="size-4" />
                Back to study rooms
              </Link>
            </div>
          )}

          {!loading && !error && room && (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Participants */}
              <div className="lg:col-span-4">
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                      Participants
                    </h2>

                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      {participants.length}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    {participants.length === 0 && (
                      <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                        No participants yet.
                      </div>
                    )}

                    {participants.map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-semibold text-primary">
                          {p.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {p.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {p.xp !== undefined ? `XP ${p.xp}` : ''}
                            {p.xp !== undefined && p.reputation !== undefined
                              ? ' · '
                              : ''}
                            {p.reputation !== undefined
                              ? `Rep ${p.reputation}`
                              : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="lg:col-span-8">
                <div className="flex h-[calc(100vh-14rem)] min-h-[24rem] flex-col rounded-3xl border border-border bg-card">
                  <div
                    ref={scrollRef}
                    className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
                  >
                    {messages.length === 0 && (
                      <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
                        No messages yet. Say hi!
                      </div>
                    )}

                    {messages.map((m) => {
                      const own = me ? m.senderId === me._id : false

                      return (
                        <div
                          key={m._id}
                          className={`flex ${own ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                              own
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            {!own && (
                              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                                {m.senderName}
                              </p>
                            )}

                            <p className="text-pretty">{m.message}</p>

                            {m.createdAt && (
                              <p
                                className={`mt-1 text-[10px] ${
                                  own
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {new Date(m.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <form onSubmit={handleSend} className="border-t border-border p-4">
                    <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message…"
                        className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />

                      <button
                        type="submit"
                        aria-label="Send message"
                        disabled={!input.trim() || !me}
                        className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                      >
                        <Send className="size-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}