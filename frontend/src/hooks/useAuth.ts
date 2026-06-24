'use client'

import { useEffect, useState } from 'react'

import { useAuthStore } from '@/src/store/authStore'

export function useAuth() {
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setToken = useAuthStore((state) => state.setToken)
  const logout = useAuthStore((state) => state.logout)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true)
    })

    setHasHydrated(useAuthStore.persist.hasHydrated())

    return unsubscribe
  }, [])

  return {
    token,
    isAuthenticated: Boolean(token) || isAuthenticated,
    hasHydrated,
    setToken,
    logout,
  }
}
