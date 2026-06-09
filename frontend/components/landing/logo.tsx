import { Flame } from 'lucide-react'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Flame className="size-5" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        StudySync
      </span>
    </div>
  )
}
