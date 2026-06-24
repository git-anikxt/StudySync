'use client'

import { useState, useCallback } from 'react'
import { UploadCloud, FileText, MoreVertical, CheckCircle2 } from 'lucide-react'

type UploadedFile = {
  id: string
  name: string
  size: string
  status: 'ready' | 'processing'
}

const initialFiles: UploadedFile[] = [
  { id: '1', name: 'Organic Chemistry Ch.4.pdf', size: '2.4 MB', status: 'ready' },
  { id: '2', name: 'Calculus II - Integrals.pdf', size: '1.8 MB', status: 'ready' },
  { id: '3', name: 'World History Notes.pdf', size: '3.1 MB', status: 'processing' },
]

export function UploadPanel() {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return
    const next = Array.from(list).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'ready' as const,
    }))
    setFiles((prev) => [...next, ...prev])
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Upload notes
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          PDF files up to 20 MB
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
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragging
              ? 'border-primary bg-accent'
              : 'border-border bg-background hover:border-primary/40'
          }`}
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <UploadCloud className="size-5" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Drag &amp; drop your PDF
          </span>
          <span className="text-xs text-muted-foreground">
            or <span className="font-semibold text-primary">browse files</span>
          </span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="sr-only"
            onChange={(e) => addFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Uploaded files
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {files.length}
          </span>
        </div>

        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {file.size}
                  {file.status === 'ready' ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <CheckCircle2 className="size-3" /> Ready
                    </span>
                  ) : (
                    <span className="text-amber-600">Processing…</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                aria-label="File options"
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
