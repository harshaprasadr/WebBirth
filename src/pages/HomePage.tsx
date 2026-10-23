import { Hero } from '@/components/Hero'
import { ClientMarquee } from '@/components/ClientMarquee'
import { SparkToSystem } from '@/components/SparkToSystem'
import { ProjectShowcase } from '@/components/ProjectShowcase'
import { ServiceList } from '@/components/ServiceList'
import { ProcessTimeline } from '@/components/ProcessTimeline'
import { TechnologyNetwork } from '@/components/TechnologyNetwork'
import { AboutSection } from '@/components/AboutSection'
import { StatsSection } from '@/components/StatsSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { InsightsSection } from '@/components/InsightsSection'
import { CareersSection } from '@/components/CareersSection'
import { CTASection } from '@/components/CTASection'
import { ContactForm } from '@/components/ContactForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useOffscreenPause } from '@/hooks/useOffscreenPause'

export function HomePage() {
  useOffscreenPause()
  useDocumentTitle('WebBirth — Software Development & Digital Products')
  return (
    <main id="main">
      <Hero />
      <ClientMarquee />
      <SparkToSystem />
      <ProjectShowcase />
      <ServiceList />
      <ProcessTimeline />
      <TechnologyNetwork />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
      <InsightsSection />
      <CareersSection />
      <CTASection />
      <ContactForm />
    </main>
  )
}
