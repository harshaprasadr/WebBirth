import { useParams } from 'react-router'
import { getProject, projects } from '@/data/projects'
import { getCaseStudy } from '@/data/caseStudies'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useOffscreenPause } from '@/hooks/useOffscreenPause'
import { CaseHero } from '@/components/CaseHero'
import { CaseShowcase } from '@/components/CaseShowcase'
import { CaseStudyFlow } from '@/components/CaseStudyFlow'
import { CaseOutro } from '@/components/CaseOutro'
import { NotFoundPage } from './NotFoundPage'

export function ProjectPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFoundPage />
  return <ProjectView key={project.slug} slug={project.slug} />
}

function ProjectView({ slug }: { slug: string }) {
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const cs = getCaseStudy(project.slug)
  useOffscreenPause()
  useDocumentTitle(`${project.name} — Case Study | WebBirth`)

  return (
    <main id="main" className="bg-paper">
      <CaseHero project={project} index={index} total={projects.length} />
      <CaseShowcase project={project} />
      {cs && <CaseStudyFlow cs={cs} resources={project.deliverables ?? []} />}
      <CaseOutro next={next} />
    </main>
  )
}
