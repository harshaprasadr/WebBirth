import { TransitionLink } from '@/components/PageTransition'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Not found — WebBirth')
  return (
    <main id="main" className="gutter flex min-h-[100svh] flex-col justify-end bg-paper pb-10 pt-32">
      <p className="type-meta text-muted">Error 404</p>
      <h1 className="type-hero mt-6 uppercase">
        Not built
        <br />
        yet<span className="text-accent">.</span>
      </h1>
      <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-body text-ink/65">The page you’re looking for doesn’t exist.</p>
        <TransitionLink to="/" className="type-meta link-reveal whitespace-nowrap">
          Back home →
        </TransitionLink>
      </div>
    </main>
  )
}
