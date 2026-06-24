'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

import { useAuth } from '@/src/hooks/useAuth'

interface RequireAuthProps {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { hasHydrated, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!hasHydrated || isAuthenticated) {
      return
    }

    const next = encodeURIComponent(pathname)
    router.replace(`/login?next=${next}`)
  }, [hasHydrated, isAuthenticated, pathname, router])

  if (!hasHydrated || !isAuthenticated) {
    return null
  }

  return children
}
