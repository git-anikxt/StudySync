import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { FeatureBento } from '@/components/landing/feature-bento'
import { LeaderboardPreview } from '@/components/landing/leaderboard-preview'
import { Testimonials } from '@/components/landing/testimonials'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

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
