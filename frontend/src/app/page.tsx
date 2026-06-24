import { Navbar } from '@/src/components/landing/navbar'
import { Hero } from '@/src/components/landing/hero'
import { DashboardPreview } from '@/src/components/landing/dashboard-preview'
import { FeatureBento } from '@/src/components/landing/feature-bento'
import { LeaderboardPreview } from '@/src/components/landing/leaderboard-preview'
import { Testimonials } from '@/src/components/landing/testimonials'
import { CtaSection } from '@/src/components/landing/cta-section'
import { Footer } from '@/src/components/landing/footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <FeatureBento />
      <LeaderboardPreview />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  )
}
