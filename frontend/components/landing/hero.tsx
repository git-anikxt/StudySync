import { ArrowRight, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const avatars = [
  '/avatars/avatar-1.png',
  '/avatars/avatar-2.png',
  '/avatars/avatar-3.png',
]

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* subtle gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[10%] top-40 h-64 w-64 rounded-full bg-chart-2/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:32px_32px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
          <Sparkles className="size-4 text-primary" />
          New: AI flashcards that grade themselves
        </div>

        <h1
          className="animate-fade-up mt-6 text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl"
          style={{ animationDelay: '60ms' }}
        >
          Study together.{' '}
          <span className="text-primary">Level up faster.</span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: '120ms' }}
        >
          Find study partners, join focused groups, keep your streak alive, and
          earn XP for every session. StudySync turns studying into something you
          actually look forward to.
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: '180ms' }}
        >
          <Button
            size="lg"
            className="group h-12 rounded-xl px-6 text-base font-semibold shadow-sm"
          >
            Start studying free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-xl px-6 text-base font-semibold"
          >
            See how it works
          </Button>
        </div>

        <div
          className="animate-fade-up mt-10 flex items-center gap-3"
          style={{ animationDelay: '240ms' }}
        >
          <div className="flex -space-x-2.5">
            {avatars.map((src, i) => (
              <Image
                key={src}
                src={src || '/placeholder.svg'}
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-full border-2 border-background object-cover"
              />
            ))}
          </div>
          <div className="text-left text-sm">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-muted-foreground">
              Loved by{' '}
              <span className="font-semibold text-foreground">120,000+</span>{' '}
              students
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
