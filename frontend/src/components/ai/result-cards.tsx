import { useState } from 'react'
import { FileText, CheckCircle2, XCircle } from 'lucide-react'

export type SummaryData = {
  title: string
  overview: string
  points: string[]
}

export function SummaryCard({ data }: { data: SummaryData }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <FileText className="size-4" />
        </span>
        <p className="text-sm font-semibold text-foreground">{data.title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
        {data.overview}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {data.points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="leading-snug text-pretty">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
}

export function QuizCard({
  title,
  questions,
}: {
  title: string
  questions: QuizQuestion[]
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({})

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-3 flex flex-col gap-4">
        {questions.map((item, qi) => {
          const selectedIndex = answers[qi]
          const hasAnswered = selectedIndex !== undefined
          const isCorrect = selectedIndex === item.correctIndex

          return (
            <div key={qi}>
              <p className="text-sm font-medium text-foreground text-pretty">
                {qi + 1}. {item.question}
              </p>
              <div className="mt-2 grid gap-1.5">
                {item.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    disabled={hasAnswered}
                    aria-pressed={selectedIndex === oi}
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [qi]: oi }))
                    }
                    className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default ${
                      !hasAnswered
                        ? 'border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/50'
                        : oi === item.correctIndex
                          ? 'border-primary/40 bg-accent text-accent-foreground'
                          : oi === selectedIndex
                            ? 'border-destructive/40 bg-destructive/10 text-destructive'
                            : 'border-border text-muted-foreground'
                    }`}
                  >
                    <span className="flex size-5 items-center justify-center rounded-md bg-card text-xs font-semibold">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                    {hasAnswered && oi === item.correctIndex && (
                      <CheckCircle2 className="ml-auto size-4 text-primary" />
                    )}
                    {hasAnswered && oi === selectedIndex && !isCorrect && (
                      <XCircle className="ml-auto size-4 text-destructive" />
                    )}
                  </button>
                ))}
              </div>
              {hasAnswered && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    isCorrect ? 'text-primary' : 'text-destructive'
                  }`}
                  role="status"
                >
                  {isCorrect
                    ? 'Correct!'
                    : `Not quite. The correct answer is ${String.fromCharCode(
                        65 + item.correctIndex,
                      )}.`}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
