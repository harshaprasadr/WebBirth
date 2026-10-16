import { ArrowUpRight, Lock, Smartphone } from 'lucide-react'
import { workCategories, type WorkCategory } from '@/data/categories'
import { TransitionLink } from './PageTransition'

export function WorkCategories() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="gutter relative bg-paper section-y border-t border-line"
    >
      {/* ── Refined section header ── */}
      <header className="mb-14 sm:mb-20">
        <div className="flex items-center justify-between gap-4 font-mono text-[0.68rem] uppercase tracking-widest text-muted pb-5 border-b border-line">
          <span id="categories-heading">Portfolio Categories</span>
          <span>Since 2020</span>
        </div>

        <div className="mt-8 sm:mt-10 grid gap-5 lg:grid-cols-12 lg:items-end">
          <h2 className="lg:col-span-6 text-[clamp(2.2rem,4.2vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
            Curated by{' '}
            <em className="font-serif font-normal not-italic italic text-accent">Domain.</em>
          </h2>
          <p className="lg:col-span-5 lg:col-start-8 lg:pb-1 text-sm sm:text-base text-ink/60 leading-relaxed">
            Explore our specialized digital engineering — from North American compliance platforms and financial intelligence to omnichannel commerce, education, and mobile applications.
          </p>
        </div>
      </header>

      <ol className="section-gap" aria-label="Work categories">
        {workCategories.map((category, index) => (
          <CategoryRow key={category.id} category={category} index={index} />
        ))}
      </ol>
    </section>
  )
}

function CategoryRow({ category, index }: { category: WorkCategory; index: number }) {
  return (
    <li
      className="border-t border-line first:border-t-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <TransitionLink
        to={`/work/category/${category.slug}`}
        className="group relative flex items-start gap-3 py-7 sm:items-center sm:gap-6 sm:py-10 lg:py-12 transition-all duration-500 ease-[var(--ease-expo)]"
      >
        {/* Left accent bar — appears on hover */}
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 rounded-full bg-accent transition-all duration-500 ease-[var(--ease-expo)] group-hover:h-[60%]"
        />

        {/* Number */}
        <span className="w-7 shrink-0 pt-[0.45rem] font-mono text-sm font-medium text-muted/60 sm:w-10 sm:pl-4 sm:pt-0 group-hover:text-accent transition-colors duration-400 select-none">
          {category.number}
        </span>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[clamp(1.5rem,2.8vw,2.8rem)] font-semibold tracking-[-0.035em] leading-[1.1] text-ink transition-colors duration-400 group-hover:text-accent">
              {category.title}
            </h3>

            {/* Status badge */}
            {category.isComingSoon ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 px-3 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-widest text-muted shrink-0">
                <Lock className="size-2.5" />
                Coming Soon
              </span>
            ) : category.isAppCategory ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/8 px-3 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-widest text-accent shrink-0">
                <Smartphone className="size-2.5" />
                Mobile
              </span>
            ) : null}
          </div>

          <p className="text-sm text-ink/55 leading-relaxed max-w-2xl sm:pr-4 group-hover:text-ink/70 transition-colors duration-400">
            {category.tagline}
          </p>
        </div>

        {/* Arrow */}
        <span
          aria-hidden
          className="ml-auto flex size-10 shrink-0 sm:mr-1 sm:size-12 items-center justify-center rounded-full border border-line bg-paper text-muted shadow-sm transition-all duration-500 ease-[var(--ease-expo)] group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent group-hover:scale-110"
        >
          <ArrowUpRight
            className="size-4 sm:size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </span>
      </TransitionLink>
    </li>
  )
}
