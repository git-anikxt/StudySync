import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

export function CtaSection() {
  return (
    <section id="cta" className="px-4 py-20 sm:py-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-16 text-center shadow-xl shadow-foreground/5 sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:28px_28px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        </div>

        <h2 className="mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your best semester starts today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Join 120,000+ students building streaks, earning XP, and studying
          smarter together. Free to start, no credit card required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="group h-12 rounded-xl px-6 text-base font-semibold shadow-sm"
            render={<Link href="/register" />}
          >
            Start studying free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-xl px-6 text-base font-semibold"
          >
            Book a campus demo
          </Button>
        </div>
      </div>
    </section>
  )
}
