import Image from 'next/image'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      'My streak hit 60 days and my GPA went up half a point. StudySync made consistency feel like a game I actually want to win.',
    name: 'Maya Rodriguez',
    role: 'Pre-med, Year 2',
    avatar: '/avatars/avatar-1.png',
  },
  {
    quote:
      'Finding a study partner used to mean awkward group chats. Now I get matched with someone in my exact courses in seconds.',
    name: 'Daniel Kim',
    role: 'Computer Science',
    avatar: '/avatars/avatar-2.png',
  },
  {
    quote:
      'The AI flashcards turned my messy lecture notes into a quiz overnight. I walked into my exam genuinely prepared.',
    name: 'Priya Sharma',
    role: 'Biology Major',
    avatar: '/avatars/avatar-3.png',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Student stories
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Students don&apos;t just study more. They study better.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6"
            >
              <div>
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-pretty leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <Image
                  src={t.avatar || '/placeholder.svg'}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
