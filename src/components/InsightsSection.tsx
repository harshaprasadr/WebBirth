import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { blogUrl, posts, type Post } from '@/data/posts'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { SectionHeader } from './SectionHeader'

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))

/**
 * Latest articles from blog.webbirth.in (synced by `npm run sync:blog`).
 * Links open the original posts on the blog.
 */
export function InsightsSection() {
  const scope = useRef<HTMLElement>(null)
  useGSAP(() => registerReveals(scope.current!), { scope })

  if (posts.length === 0) return null
  const [lead, ...rest] = posts

  return (
    <section ref={scope} id="blogs" aria-labelledby="journal-title" className="gutter relative bg-paper section-y">
      <div id="journal" className="sr-only" aria-hidden="true" />
      <SectionHeader
        id="journal-title"
        label="Blogs"
        title={['Latest', 'insights.']}
        titleClassName="uppercase"
        aside={
          <a href={blogUrl} target="_blank" rel="noreferrer" className="group inline-flex min-h-11 items-center gap-1.5">
            <span className="link-reveal">All articles</span>
            <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          </a>
        }
        intro="Practical notes from our team on web, mobile, design and growth - written for business owners, not just developers."
      />

      <div className="section-gap grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-12 lg:grid-cols-12">
        <LeadPost post={lead} />
        <ul className="border-t border-line lg:col-span-6">
          {rest.slice(0, 4).map((p) => (
            <li key={p.slug} data-reveal="fade" data-start="top 94%" className="border-b border-line">
              <PostRow post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="type-meta flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
      <span className="text-accent">{post.topic}</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span>{post.readingMinutes} min read</span>
    </p>
  )
}

function LeadPost({ post }: { post: Post }) {
  return (
    <article className="group relative lg:col-span-6">
      <a
        href={post.url}
        target="_blank"
        rel="noreferrer"
        aria-label={post.title}
        data-cursor="view"
        data-cursor-label="Read"
        className="block"
      >
        {post.image && (
          <div data-reveal="clip" className="relative aspect-[16/10] overflow-clip bg-paper-2">
            <div data-reveal-inner className="absolute inset-0">
              <img
                src={post.image}
                alt=""
                loading="lazy"
                decoding="async"
                width={960}
                height={600}
                className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
              />
            </div>
          </div>
        )}
        <div className="mt-6" data-reveal="fade">
          <Meta post={post} />
          <h3 className="mt-4 text-[clamp(1.6rem,2.8vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] transition-colors duration-500 group-hover:text-accent-deep">
            {post.title}
          </h3>
          <p className="type-body mt-4 max-w-xl text-ink/65">{post.excerpt}</p>
          <span className="type-meta mt-6 inline-flex items-center gap-1.5">
            <span className="link-reveal">Read article</span>
            <ArrowUpRight
              className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </span>
        </div>
      </a>
    </article>
  )
}

function PostRow({ post }: { post: Post }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="group grid grid-cols-[1fr_auto] items-center gap-5 py-6 sm:grid-cols-[7.5rem_1fr_auto] sm:gap-6"
    >
      {post.image && (
        <div className="relative hidden aspect-[4/3] overflow-clip bg-paper-2 sm:block">
          <img
            src={post.image}
            alt=""
            loading="lazy"
            decoding="async"
            width={240}
            height={180}
            className="size-full object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110"
          />
        </div>
      )}
      <div className="min-w-0">
        <Meta post={post} />
        <h3 className="mt-2.5 text-[clamp(1.1rem,1.5vw,1.4rem)] font-medium leading-snug tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-1.5">
          {post.title}
        </h3>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 transition-[transform,color] duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
        strokeWidth={1.25}
      />
    </a>
  )
}
