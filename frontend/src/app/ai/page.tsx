'use client'

import { useState } from 'react'

import {
  generateSummary,
} from '@/src/services/ai'

export default function AIPage() {
  const [notes, setNotes] =
    useState('')

  const [summary, setSummary] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  async function handleSummary() {
    if (!notes.trim()) return

    setLoading(true)

    try {
      const result =
        await generateSummary(
          notes,
        )

      setSummary(result)
    } catch (err) {
      console.error(err)

      alert(
        'Failed to generate summary',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-8">

      <h1 className="mb-6 text-3xl font-bold">
        AI Study Assistant
      </h1>

      <textarea
        rows={12}
        placeholder="Paste your notes here..."
        value={notes}
        onChange={(e) =>
          setNotes(
            e.target.value,
          )
        }
        className="w-full rounded-xl border p-4"
      />

      <button
        onClick={handleSummary}
        disabled={loading}
        className="mt-4 rounded-lg border px-5 py-2"
      >
        {loading
          ? 'Generating...'
          : 'Generate Summary'}
      </button>

      {summary && (
        <div className="mt-8 rounded-xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            AI Summary
          </h2>

          <div className="whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </main>
  )
}