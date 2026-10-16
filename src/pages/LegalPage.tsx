import { useRef } from 'react'
import { company } from '@/data/site'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

type Doc = { title: string; updated: string; sections: { h: string; p: string[] }[] }

/**
 * Plain-language baseline copy. Have it reviewed by counsel before relying on it.
 */
const docs: Record<'privacy' | 'terms', Doc> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'October 2026',
    sections: [
      {
        h: 'What we collect',
        p: [
          'When you send an inquiry we receive the details you choose to share — your name, email, phone number, company, project type and message.',
          'This website does not use advertising trackers. Basic, anonymous server logs may be kept by our hosting provider for security and performance.',
        ],
      },
      {
        h: 'How we use it',
        p: [
          'We use inquiry details only to respond to you, discuss your project and, we work together, to deliver it. We do not sell or rent personal information.',
        ],
      },
      {
        h: 'Retention & your rights',
        p: [
          `You can ask us to access, correct or delete the information you have shared at any time by writing to ${company.email}.`,
        ],
      },
      {
        h: 'Contact',
        p: [`WebBirth, ${company.address.join(', ')}. Email: ${company.email}.`],
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: 'October 2026',
    sections: [
      {
        h: 'Using this website',
        p: [
          'This website presents information about WebBirth and its services. By using it you agree to these terms. Content may change without notice.',
        ],
      },
      {
        h: 'Intellectual property',
        p: [
          'The WebBirth name, wordmark, site design and original content belong to WebBirth. Client names and project visuals are shown with reference to work delivered and remain the property of their respective owners.',
        ],
      },
      {
        h: 'No warranty',
        p: [
          'Information on this site is provided as-is for general purposes. Project engagements are governed by the separate agreement signed with each client.',
        ],
      },
      {
        h: 'Governing law',
        p: ['These terms are governed by the laws of India, with courts in Bengaluru, Karnataka having jurisdiction.'],
      },
    ],
  },
}

export function LegalPage({ kind }: { kind: keyof typeof docs }) {
  const scope = useRef<HTMLElement>(null)
  const doc = docs[kind]
  useDocumentTitle(`${doc.title} — WebBirth`)
  useGSAP(() => registerReveals(scope.current!), { scope, dependencies: [kind], revertOnUpdate: true })

  return (
    <main ref={scope} id="main" className="gutter bg-paper section-pb pt-32 lg:pt-40">
      <p className="type-meta flex items-center gap-4 text-muted">
        <span>Legal</span>
        <span className="flex-1" aria-hidden="true" />
        <span>Updated {doc.updated}</span>
      </p>
      <h1 data-reveal="lines" className="type-display mt-12 uppercase">
        {doc.title}
      </h1>
      <div className="section-gap grid gap-y-14 lg:grid-cols-12">
        {doc.sections.map((s, i) => (
          <section key={s.h} data-reveal="fade" className="grid gap-4 border-t border-line pt-6 lg:col-span-12 lg:grid-cols-12">
            <h2 className="flex gap-4 text-xl font-medium tracking-tight lg:col-span-4">
              <span className="type-meta pt-1.5 text-muted">{String(i + 1).padStart(2, '0')}</span>
              {s.h}
            </h2>
            <div className="type-body flex max-w-2xl flex-col gap-4 text-ink/75 lg:col-span-7 lg:col-start-6">
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
