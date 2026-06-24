import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const AUTH_TOKEN_KEY = 'studysync-token'

interface AuthStore {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, token)
        }

        set({ token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_TOKEN_KEY)
        }

        set({ token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'studysync-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        state.isAuthenticated = Boolean(state.token)

        if (typeof window !== 'undefined') {
          if (state.token) {
            localStorage.setItem(AUTH_TOKEN_KEY, state.token)
          } else {
            localStorage.removeItem(AUTH_TOKEN_KEY)
          }
        }
      },
    },
  ),
)
