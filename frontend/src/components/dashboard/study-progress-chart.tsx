'use client'

import { useState } from 'react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeeklyData(totalHours: number) {
  const average = totalHours / days.length

  return days.map((day) => ({
    day,
    hours: Number(average.toFixed(1)),
  }))
}

export function StudyProgressChart({ studyHours }: { studyHours: number }) {
  const data = getWeeklyData(studyHours)
  const max = Math.max(...data.map((d) => d.hours), 1)

  const [active, setActive] = useState<number | null>(3)
  const total = data.reduce((a, b) => a + b.hours, 0)

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Weekly study progress
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {total.toFixed(1)} hours total this week
          </p>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          This week
        </span>
      </div>

      <div className="mt-8 flex h-48 items-end justify-between gap-2 sm:gap-4">
        {data.map((d, i) => (
          <div
            key={d.day}
            className="flex flex-1 flex-col items-center gap-2"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(3)}
          >
            <div className="relative flex w-full flex-1 items-end">
              <div className="w-full overflow-hidden rounded-t-lg rounded-b-md bg-muted">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    active === i ? 'bg-primary' : 'bg-primary/35'
                  }`}
                  style={{ height: `${(d.hours / max) * 160}px` }}
                />
              </div>
              {active === i && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs font-medium text-background">
                  {d.hours}h
                </span>
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                active === i ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
