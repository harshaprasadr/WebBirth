import { Route, Routes } from 'react-router'
import { SmoothScroll } from '@/components/SmoothScroll'
import { PageTransition } from '@/components/PageTransition'
import { Navbar } from '@/components/Navbar'
import { CustomCursor } from '@/components/CustomCursor'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Footer } from '@/components/Footer'
import { StickyCTA } from '@/components/StickyCTA'
import { HomePage } from '@/pages/HomePage'
import { ProjectPage } from '@/pages/ProjectPage'
import { WorkPage } from '@/pages/WorkPage'
import { WorkCategoryPage } from '@/pages/WorkCategoryPage'
import { TestimonialsPage } from '@/pages/TestimonialsPage'
import { CareersPage } from '@/pages/CareersPage'
import { LegalPage } from '@/pages/LegalPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <SmoothScroll>
      <PageTransition>
        <a
          href="#main"
          className="type-meta fixed left-4 top-4 z-[110] -translate-y-24 bg-ink px-4 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/category/:categorySlug" element={<WorkCategoryPage />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<LegalPage key="privacy" kind="privacy" />} />
          <Route path="/terms" element={<LegalPage key="terms" kind="terms" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <StickyCTA />
      </PageTransition>
      <CustomCursor />
    </SmoothScroll>
  )
}
