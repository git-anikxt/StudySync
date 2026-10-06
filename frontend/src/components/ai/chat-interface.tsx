'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Sparkles, Send, FileText, Layers, HelpCircle, Lightbulb } from 'lucide-react'
import { FlashcardDeck, type Flashcard } from './flashcard-deck'
import {
  SummaryCard,
  QuizCard,
  type SummaryData,
  type QuizQuestion,
} from './result-cards'
import { sendChat } from '@/src/services/ai'
import { getMyProfile } from '@/src/services/users'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text?: string
  summary?: SummaryData
  flashcards?: { title: string; cards: Flashcard[] }
  quiz?: { title: string; questions: QuizQuestion[] }
}

function buildGreeting(firstName?: string): Message {
  return {
    id: 'greeting',
    role: 'assistant',
    text: firstName
      ? `Hi ${firstName}! Upload your notes or pick a quick action and I\u2019ll generate summaries, flashcards, or a quiz from them. You can also just ask me anything.`
      : 'Hi there! Upload your notes or pick a quick action and I\u2019ll generate summaries, flashcards, or a quiz from them. You can also just ask me anything.',
  }
}

// Tailwind's preflight strips list markers and margins, so restore the basics
// markdown output needs without touching the message bubble's own styling.
const markdownClass = [
  'text-pretty',
  '[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
  '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
  '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
  '[&_li]:my-0.5',
  '[&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-semibold',
  '[&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold',
  '[&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold',
  '[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-background/70 [&_pre]:p-3',
  '[&_code]:rounded [&_code]:bg-background/70 [&_code]:px-1',
  '[&_a]:underline',
].join(' ')


const starters = [
  { icon: FileText, label: 'Summarize my notes' },
  { icon: Layers, label: 'Make flashcards' },
  { icon: HelpCircle, label: 'Create a quiz' },
  { icon: Lightbulb, label: 'Explain a topic' },
]

const actionPrompts: Record<string, string> = {
  summary: 'Summarize my notes',
  flashcards: 'Make flashcards from my notes',
  quiz: 'Create a quiz from my notes',
  explain: 'Explain the most important concept in my notes with examples',
}

function getChatErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as {
      response?: { data?: { message?: string } }
    }).response
    if (response?.data?.message) return response.data.message
  }

  return error instanceof Error
    ? error.message
    : "I couldn't generate a response. Please try again."
}

export function ChatInterface({
  uploadedNotes,
  pendingAction,
  onActionHandled,
}: {
  uploadedNotes: string
  pendingAction: string | null
  onActionHandled: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([buildGreeting()])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Files are joined as "--- name ---\ntext" blocks by the upload panel,
  // so counting those separators gives the number of loaded note sources.
  const noteCount = uploadedNotes
    ? uploadedNotes.split('\n\n--- ').length
    : 0

  const send = async (text: string) => {
  const trimmed = text.trim()

  if (!trimmed) return

  const userMsg: Message = {
    id: `${Date.now()}-u`,
    role: 'user',
    text: trimmed,
  }

  setMessages((prev) => [...prev, userMsg])

  setInput('')
  setThinking(true)

  try {
    const history = [...messages, userMsg].map(({ role, text }) => ({
      role,
      content: text ?? '',
    }))

    // Uploaded notes are resent as context on every request (the API is
    // stateless per call) but are never added to the visible messages.
    const withNotes = uploadedNotes
      ? [
          {
            role: 'user' as const,
            content: `Here are my uploaded notes for context:\n\n${uploadedNotes}`,
          },
          ...history,
        ]
      : history

    const res = await sendChat(withNotes)

    const aiMsg: Message = {
      id: `${Date.now()}-a`,
      role: 'assistant',
    }

    if (res.type === 'summary') {
      aiMsg.summary = res.data as SummaryData
    } else if (res.type === 'flashcards') {
      aiMsg.flashcards = {
        title: 'AI Flashcards',
        cards: res.data as Flashcard[],
      }
    } else if (res.type === 'quiz') {
      aiMsg.quiz = {
        title: 'AI Quiz',
        questions: res.data as QuizQuestion[],
      }
    } else {
      aiMsg.text = res.data as string
    }

    setMessages((prev) => [...prev, aiMsg])
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-e`,
        role: 'assistant',
        text: getChatErrorMessage(err),
      },
    ])
  } finally {
    setThinking(false)
  }
}

  useEffect(() => {
    if (pendingAction) {
      send(actionPrompts[pendingAction] ?? pendingAction)
      onActionHandled()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAction])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    let isMounted = true

    getMyProfile()
      .then((res) => {
        const fullName = res?.user?.name?.trim()

        if (!isMounted || !fullName) return

        const firstName = fullName.split(/\s+/)[0]

        setMessages((prev) =>
          prev.map((m) =>
            m.id === 'greeting'
              ? { ...m, text: buildGreeting(firstName).text }
              : m,
          ),
        )
      })
      .catch(() => {
        // Keep the generic greeting when the profile can't be loaded.
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[32rem] flex-col rounded-3xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            AI Study Assistant
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Ready · {noteCount} {noteCount === 1 ? 'note' : 'notes'} loaded
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {m.text &&
                (m.role === 'user' ? (
                  <p className="text-pretty">{m.text}</p>
                ) : (
                  <div className={markdownClass}>
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                ))}
              {m.summary && (
                <div className="mt-3">
                  <SummaryCard data={m.summary} />
                </div>
              )}
              {m.flashcards && (
                <div className="mt-3">
                  <FlashcardDeck title={m.flashcards.title} cards={m.flashcards.cards} />
                </div>
              )}
              {m.quiz && (
                <div className="mt-3">
                  <QuizCard title={m.quiz.title} questions={m.quiz.questions} />
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Starters */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-1">
          {starters.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => send(s.label)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
            >
              <s.icon className="size-3.5 text-primary" />
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="border-t border-border p-4"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question from your notes…"
            className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            disabled={!input.trim()}
          >
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
