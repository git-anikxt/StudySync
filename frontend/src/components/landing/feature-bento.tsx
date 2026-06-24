import {
  Users,
  Flame,
  Sparkles,
  Trophy,
  Zap,
  UserPlus,
  Brain,
} from 'lucide-react'

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export function FeatureBento() {
  return (
    <section id="features" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Everything you need"
          title="A complete toolkit for serious studying"
          description="From finding the right study partner to acing exam day, StudySync keeps every part of your routine in one delightful place."
        />

        <div className="mt-14 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          {/* Find partners — large */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 md:col-span-2 md:row-span-2">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <UserPlus className="size-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                Find your perfect study partner
              </h3>
              <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
                Smart matching pairs you with students in your courses, on your
                schedule, and at your level. No more studying alone.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { name: 'Maya R.', course: 'Organic Chem', match: '98%' },
                { name: 'Leo K.', course: 'Calculus II', match: '95%' },
                { name: 'Priya S.', course: 'Biology', match: '92%' },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-border bg-background p-3"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.course}</p>
                  <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    {p.match} match
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Streaks */}
          <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Flame className="size-5" />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Build unbreakable streaks
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Daily goals and reminders keep momentum going strong.
              </p>
            </div>
          </div>

          {/* XP */}
          <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-chart-3/15 text-chart-3">
              <Zap className="size-5" />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Earn XP for every win
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Level up, unlock badges, and watch your progress compound.
              </p>
            </div>
          </div>

          {/* AI tools — wide */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 md:col-span-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-primary/10 blur-2xl"
            />
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Brain className="size-5" />
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-sm">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  AI study tools that do the heavy lifting
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Turn any notes into flashcards, quizzes, and summaries in
                  seconds. Ask follow-up questions and get instant explanations.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Flashcards', 'Quizzes', 'Summaries', 'Explain'].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                  >
                    <Sparkles className="size-3 text-primary" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Groups */}
          <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-chart-2/15 text-chart-2">
              <Users className="size-5" />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Join focused study groups
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Shared timers, notes, and goals keep everyone accountable.
              </p>
            </div>
          </div>

          {/* Leaderboard teaser */}
          <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-chart-3/15 text-chart-3">
              <Trophy className="size-5" />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Compete on leaderboards
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Climb weekly rankings with friends, classes, and your campus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
