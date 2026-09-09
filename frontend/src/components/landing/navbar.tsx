'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Logo } from './logo'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Pricing', href: '#cta' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-xl">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" className="text-sm font-medium" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button className="rounded-xl text-sm font-semibold shadow-sm" render={<Link href="/register" />}>
            Start free
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-lg text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {open && (
          <div className="absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-border/70 bg-background p-3 shadow-lg md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" render={<Link href="/login" />}>
                Log in
              </Button>
              <Button className="rounded-xl font-semibold" render={<Link href="/register" />}>
                Start free
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
