'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, FileText, Layers, HelpCircle, Lightbulb } from 'lucide-react'
import { FlashcardDeck, type Flashcard } from './flashcard-deck'
import {
  SummaryCard,
  QuizCard,
  type SummaryData,
  type QuizQuestion,
} from './result-cards'
import { generateSummary, generateFlashcards,
  generateQuiz
 } from '@/src/services/ai'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text?: string
  summary?: SummaryData
  flashcards?: { title: string; cards: Flashcard[] }
  quiz?: { title: string; questions: QuizQuestion[] }
}

const greeting: Message = {
  id: 'greeting',
  role: 'assistant',
  text: 'Hi Aniket! Upload your notes or pick a quick action and I\u2019ll generate summaries, flashcards, or a quiz from them. You can also just ask me anything.',
}


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
  explain: 'Explain nucleophilic addition',
}

export function ChatInterface({
  pendingAction,
  onActionHandled,
}: {
  pendingAction: string | null
  onActionHandled: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([greeting])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

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
let aiMsg: Message

const lower = trimmed.toLowerCase()

if (lower.includes('flashcard')) {
  const cards = JSON.parse(
    await generateFlashcards(trimmed),
  ) as Flashcard[]

  aiMsg = {
    id: `${Date.now()}-a`,
    role: 'assistant',
    text: 'Here are your flashcards.',
    flashcards: {
      title: 'AI Flashcards',
      cards,
    },
  }
} else if (lower.includes('quiz')) {
  const questions = JSON.parse(
    await generateQuiz(trimmed),
  ) as QuizQuestion[]

  aiMsg = {
    id: `${Date.now()}-a`,
    role: 'assistant',
    text: 'Here is your quiz.',
    quiz: {
      title: 'AI Quiz',
      questions,
    },
  }
} else {
  const summary = JSON.parse(
    await generateSummary(trimmed),
  ) as SummaryData

  aiMsg = {
    id: `${Date.now()}-a`,
    role: 'assistant',
    text: 'Here is your summary.',
    summary,
  }
}

setMessages((prev) => [...prev, aiMsg])
} catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-e`,
        role: 'assistant',
        text: 'Failed to generate summary.',
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
            Ready · 3 notes loaded
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
              {m.text && <p className="text-pretty">{m.text}</p>}
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
