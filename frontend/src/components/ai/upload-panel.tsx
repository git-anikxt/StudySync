'use client'

import { useState, useCallback } from 'react'
import {
  UploadCloud,
  FileText,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import { extractNotes } from '@/src/services/ai'

type UploadedFile = {
  id: string
  name: string
  size: string
  status: 'ready' | 'processing' | 'failed'
  error?: string
}

type UploadPanelProps = {
  onNotesLoaded: (notes: string) => void
}

const initialFiles: UploadedFile[] = []

export function UploadPanel({
  onNotesLoaded,
}: UploadPanelProps) {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback(
    async (list: FileList | null) => {
      if (!list || list.length === 0) return

      const extracted: { name: string; text: string }[] = []

      await Promise.all(
        Array.from(list).map(async (f, i) => {
          const id = `${Date.now()}-${i}`

          setFiles((prev) => [
            {
              id,
              name: f.name,
              size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
              status: 'processing' as const,
            },
            ...prev,
          ])

          try {
            const { text } = await extractNotes(f)

            extracted.push({ name: f.name, text })

            setFiles((prev) =>
              prev.map((file) =>
                file.id === id
                  ? { ...file, status: 'ready' as const }
                  : file,
              ),
            )
          } catch (err: any) {
            const message =
              err?.response?.data?.message ??
              `Couldn't extract text from ${f.name}`

            setFiles((prev) =>
              prev.map((file) =>
                file.id === id
                  ? { ...file, status: 'failed' as const, error: message }
                  : file,
              ),
            )
          }
        }),
      )

      if (extracted.length > 0) {
        onNotesLoaded(
          extracted
            .map((f) => `--- ${f.name} ---\n${f.text}`)
            .join('\n\n'),
        )
      }
    },
    [onNotesLoaded],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold tracking-tight">
          Upload notes
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          Upload TXT or PDF
        </p>

        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 ${
            dragging
              ? 'border-primary bg-accent'
              : 'border-border bg-background hover:border-primary/40'
          }`}
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent">
            <UploadCloud className="size-5" />
          </span>

          <span className="text-sm font-medium">
            Drag & drop your file
          </span>

          <span className="text-xs text-muted-foreground">
            or <span className="text-primary font-semibold">browse files</span>
          </span>

          <input
            type="file"
            accept=".txt,.pdf"
            multiple
            className="sr-only"
            onChange={(e) => addFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Uploaded files
          </h2>

          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {files.length}
          </span>
        </div>

        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent">
                <FileText className="size-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {file.name}
                </p>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {file.size}

                  {file.status === 'ready' ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <CheckCircle2 className="size-3" />
                      Ready
                    </span>
                  ) : file.status === 'failed' ? (
                    <span
                      className="inline-flex items-center gap-1 text-destructive"
                      title={file.error}
                    >
                      <XCircle className="size-3" />
                      Failed
                    </span>
                  ) : (
                    <span>Processing...</span>
                  )}
                </p>

                {file.status === 'failed' && file.error && (
                  <p className="mt-0.5 truncate text-xs text-destructive">
                    {file.error}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-lg hover:bg-muted"
              >
                <MoreVertical className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
