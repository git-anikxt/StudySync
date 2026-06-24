import { Sparkles, FileText, Layers, HelpCircle, ArrowRight } from 'lucide-react'

const tools = [
  {
    icon: FileText,
    title: 'Generate summary',
    desc: 'Condense your notes into key takeaways',
  },
  {
    icon: Layers,
    title: 'Create flashcards',
    desc: 'Turn any topic into a study deck',
  },
  {
    icon: HelpCircle,
    title: 'Generate quiz',
    desc: 'Test yourself with smart questions',
  },
]

export function AiWidget() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-primary/10 blur-2xl"
      />
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            AI study assistant
          </h2>
          <p className="text-sm text-muted-foreground">
            Create study material in seconds
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {tools.map((t) => (
          <button
            key={t.title}
            type="button"
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <t.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {t.desc}
              </p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Start
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background p-3">
        <input
          type="text"
          placeholder="Ask anything or paste your notes…"
          className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Sparkles className="size-4" />
          Generate
        </button>
      </div>
    </div>
  )
}
