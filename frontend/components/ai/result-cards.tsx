import { FileText, CheckCircle2 } from 'lucide-react'

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
  q: string
  options: string[]
  answer: number
}

export function QuizCard({
  title,
  questions,
}: {
  title: string
  questions: QuizQuestion[]
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-3 flex flex-col gap-4">
        {questions.map((item, qi) => (
          <div key={qi}>
            <p className="text-sm font-medium text-foreground text-pretty">
              {qi + 1}. {item.q}
            </p>
            <div className="mt-2 grid gap-1.5">
              {item.options.map((opt, oi) => (
                <div
                  key={oi}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                    oi === item.answer
                      ? 'border-primary/40 bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <span className="flex size-5 items-center justify-center rounded-md bg-card text-xs font-semibold">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                  {oi === item.answer && (
                    <CheckCircle2 className="ml-auto size-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
