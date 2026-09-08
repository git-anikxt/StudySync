import { api } from '@/src/lib/api'

export interface SummaryResponse {
  success: boolean
  summary: string
}

export interface FlashcardsResponse {
  success: boolean
  flashcards: string
}

export interface QuizResponse {
  success: boolean
  quiz: string
}

export async function generateSummary(notes: string) {
  const { data } = await api.post<SummaryResponse>(
    '/ai/summary',
    { notes },
  )

  return data.summary
}

export async function generateFlashcards(notes: string) {
  const { data } = await api.post<FlashcardsResponse>(
    '/ai/flashcards',
    { notes },
  )

  return data.flashcards
}

export async function generateQuiz(notes: string) {
  const { data } = await api.post<QuizResponse>(
    '/ai/quiz',
    { notes },
  )

  return data.quiz
}

export async function sendChat(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const { data } = await api.post('/ai/chat', { messages })

  return data // { success, type: 'chat'|'summary'|'flashcards'|'quiz', data }
}

interface ExtractNotesResponse {
  success: boolean
  filename: string
  text: string
}

export async function extractNotes(file: File) {
  const formData = new FormData()

  formData.append('file', file)

  // Per-request Content-Type override: the shared api instance sets a
  // default 'application/json' explicitly, so axios must be told this
  // request is multipart or it will JSON-stringify the FormData.
  const { data } = await api.post<ExtractNotesResponse>(
    '/notes/extract',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )

  return { filename: data.filename, text: data.text }
}