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

type Message = {
  id: string
  role: 'user' | 'assistant'
  text?: string
  summary?: SummaryData
  flashcards?: { title: string; cards: Flashcard[] }
  quiz?: { title: string; questions: QuizQuestion[] }
}

const sampleFlashcards: Flashcard[] = [
  { front: 'What is an aldehyde?', back: 'A carbonyl group (C=O) bonded to at least one hydrogen atom.' },
  { front: 'Define a nucleophile', back: 'An electron-rich species that donates a pair of electrons to form a bond.' },
  { front: 'What is Markovnikov\u2019s rule?', back: 'In addition reactions, H attaches to the carbon with more hydrogens.' },
  { front: 'What is a racemic mixture?', back: 'An equal mix of two enantiomers, optically inactive overall.' },
]

const sampleSummary: SummaryData = {
  title: 'Organic Chemistry Ch.4 — Summary',
  overview:
    'This chapter covers carbonyl chemistry, focusing on the reactivity of aldehydes and ketones and the mechanisms of nucleophilic addition reactions.',
  points: [
    'Carbonyl carbons are electrophilic and attract nucleophiles.',
    'Aldehydes are more reactive than ketones due to less steric hindrance.',
    'Nucleophilic addition forms tetrahedral alkoxide intermediates.',
    'Reduction with NaBH4 yields primary or secondary alcohols.',
  ],
}

const sampleQuiz: { title: string; questions: QuizQuestion[] } = {
  title: 'Practice Quiz — Carbonyl Chemistry',
  questions: [
    {
      q: 'Which is more reactive toward nucleophilic addition?',
      options: ['Ketones', 'Aldehydes', 'Carboxylic acids', 'Esters'],
      answer: 1,
    },
    {
      q: 'What reagent reduces an aldehyde to a primary alcohol?',
      options: ['NaBH4', 'KMnO4', 'HCl', 'O3'],
      answer: 0,
    },
  ],
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

function responseFor(text: string): Message {
  const lower = text.toLowerCase()
  const id = `${Date.now()}-a`
  if (lower.includes('flashcard')) {
    return { id, role: 'assistant', text: 'Here\u2019s a flashcard deck from your notes:', flashcards: { title: 'Chemistry flashcards', cards: sampleFlashcards } }
  }
  if (lower.includes('quiz')) {
    return { id, role: 'assistant', text: 'I generated a quick practice quiz for you:', quiz: sampleQuiz }
  }
  if (lower.includes('explain')) {
    return { id, role: 'assistant', text: 'Nucleophilic addition happens when an electron-rich nucleophile attacks the electrophilic carbonyl carbon, breaking the C=O pi bond and forming a tetrahedral alkoxide intermediate that is then protonated to give an alcohol.' }
  }
  return { id, role: 'assistant', text: 'Here\u2019s a summary of your notes:', summary: sampleSummary }
}

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

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: Message = { id: `${Date.now()}-u`, role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, responseFor(trimmed)])
      setThinking(false)
    }, 900)
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
