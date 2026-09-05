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

  // No explicit Content-Type: axios clears the default for FormData so
  // the browser generates the multipart boundary automatically.
  const { data } = await api.post<ExtractNotesResponse>(
    '/notes/extract',
    formData,
  )

  return { filename: data.filename, text: data.text }
}