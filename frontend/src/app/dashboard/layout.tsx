import { type ReactNode } from 'react'

import { RequireAuth } from '@/src/components/auth/require-auth'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>
}
