'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { UploadPanel } from '@/components/ai/upload-panel'
import { RecentSessions } from '@/components/ai/recent-sessions'
import { ChatInterface } from '@/components/ai/chat-interface'
import { QuickActions } from '@/components/ai/quick-actions'

export default function AiAssistantPage() {
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar active="AI Tools" />
      <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pt-12 lg:pt-0">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              AI Assistant
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your notes and turn them into summaries, flashcards, and
              quizzes.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left */}
            <div className="flex flex-col gap-6 lg:col-span-3">
              <UploadPanel />
              <RecentSessions />
            </div>

            {/* Center */}
            <div className="lg:col-span-6">
              <ChatInterface
                pendingAction={pendingAction}
                onActionHandled={() => setPendingAction(null)}
              />
            </div>

            {/* Right */}
            <div className="lg:col-span-3">
              <QuickActions onAction={(key) => setPendingAction(key)} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
