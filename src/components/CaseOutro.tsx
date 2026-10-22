import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { gsap, mq, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { showcase } from "@/data/showcase";
import { ProjectMedia } from "./ProjectMedia";
import { TransitionLink } from "./PageTransition";
import { Magnetic } from "./Magnetic";

export function CaseOutro({ next }: { next: Project }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(mq.motion, () => {
        const headline = SplitText.create(q("[data-outro-title]"), {
          type: "words,chars",
          mask: "chars",
        });
        gsap
          .timeline({
            defaults: { ease: "case" },
            scrollTrigger: {
              trigger: q("[data-outro-cta]")[0],
              start: "top 75%",
              once: true,
            },
          })
          .from(
            headline.chars,
            { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.018 },
            0,
          )
          .from(
            q("[data-outro-btn]"),
            { scale: 0, rotate: -90, duration: 1.1, ease: "back.out(1.6)" },
            0.4,
          )
          .from(
            q("[data-outro-sub]"),
            { autoAlpha: 0, y: 14, duration: 0.8 },
            0.6,
          );

        // marquee: constant drift, sped up by scroll velocity
        const track = q("[data-marquee]")[0];
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
          paused: true,
        });
        ScrollTrigger.create({
          trigger: q("[data-next]")[0],
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 300, 6);
            gsap.to(loop, {
              timeScale: 1 + boost,
              duration: 0.15,
              overwrite: true,
            });
            gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.15 });
          },
        });

        // screenshot drifts gently inside its frame; card wipes in, copy rises
        const media = q("[data-next-media]")[0];
        if (media)
          gsap.fromTo(
            media,
            { yPercent: -3, scale: 1.06 },
            {
              yPercent: 3,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: q("[data-next]")[0], start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        gsap
          .timeline({
            defaults: { ease: "case" },
            scrollTrigger: { trigger: q("[data-next]")[0], start: "top 70%", once: true },
          })
          .fromTo(
            q("[data-next-card]"),
            { clipPath: "inset(18% 10% 18% 10% round 48px)", y: 40 },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", y: 0, duration: 1.3, ease: "expo.inOut", clearProps: "clipPath" },
            0,
          )
          .from(q("[data-next-copy] > *"), { autoAlpha: 0, y: 26, duration: 1, stagger: 0.08 }, 0.35);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const words = Array.from({ length: 4 }, (_, i) => i);
  const nextNo = String(
    projects.findIndex((p) => p.slug === next.slug) + 1,
  ).padStart(2, "0");
  const total = String(projects.length).padStart(2, "0");
  const hasPreview = !!showcase[next.slug] || !!next.image;

  return (
    <div ref={root}>
      {/* ── CTA ─────────────────────────────────────── */}
      <section
        data-outro-cta
        data-hides-cta
        aria-label="Start a project"
        className="gutter relative overflow-clip border-t border-line py-[clamp(4.5rem,10vw,9rem)]"
      >
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p
              data-outro-sub
              className="font-mono text-[0.68rem] uppercase tracking-widest text-muted"
            >
              Your turn
            </p>
            <h2
              data-outro-title
              className="mt-5 text-[clamp(2.8rem,8vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.055em] [text-wrap:balance]"
            >
              Building something similar?
            </h2>
          </div>
          <div className="flex lg:col-span-3 lg:justify-end">
            <Magnetic strength={0.35}>
              <TransitionLink
                to="/#contact"
                data-outro-btn
                className="group relative flex size-36 flex-col items-center justify-center gap-2 overflow-clip rounded-full bg-accent text-on-accent sm:size-44"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-100" />
                <ArrowUpRight
                  className="relative size-7 transition-all duration-500 group-hover:rotate-45 group-hover:text-paper"
                  strokeWidth={1.5}
                />
                <span className="relative text-[0.72rem] font-medium uppercase tracking-[0.08em] transition-colors duration-500 group-hover:text-paper">
                  Start a project
                </span>
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ── Next case ───────────────────────────────── */}
      <TransitionLink
        to={`/work/${next.slug}`}
        data-next
        data-cursor="view"
        data-cursor-label="Next"
        data-nav-theme="dark"
        data-hides-cta
        className="group relative block overflow-clip bg-ink text-paper"
      >
        {/* backdrop: the next project's colour as a soft glow + faint grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 70% at 78% 62%, ${next.tone} 0%, transparent 72%), radial-gradient(40% 50% at 8% 0%, rgb(242 87 28 / 0.08), transparent 70%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 70% 60%, black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 70% 60%, black 0%, transparent 70%)",
          }}
        />

        <div className="relative py-12 sm:py-16 lg:py-[clamp(4.5rem,7vw,7rem)]">
          {/* rail */}
          <div className="gutter">
            <div className="flex items-center justify-between gap-6 border-paper/10 font-mono text-[0.68rem] uppercase tracking-widest text-paper/70 sm:border-b sm:pb-5">
              <span className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                  <span className="relative size-2 rounded-full bg-accent" />
                </span>
                Next case
              </span>
              <span className="tabular-nums">
                No. {nextNo}
                <span className="text-paper/35"> / {total}</span>
              </span>
              <span className="hidden truncate lg:block">{next.industry}</span>
            </div>
          </div>

          {/* marquee */}
          <div className="relative mt-6 overflow-clip py-1 sm:mt-10" aria-hidden="true">
            <div data-marquee className="flex w-max">
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0">
                  {words.map((w) => (
                    <span
                      key={w}
                      className="flex items-center gap-[0.35em] pr-[0.35em] text-[clamp(3.5rem,10vw,10.5rem)] font-semibold uppercase leading-none tracking-[-0.055em] even:text-transparent even:[-webkit-text-stroke:2px_rgb(243_242_238_/_0.85)]"
                    >
                      {next.name}
                      <span className="inline-block size-[0.18em] rounded-full bg-accent" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* details + preview */}
          <div className="gutter relative z-10 mt-8 grid gap-8 lg:mt-4 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div data-next-card className="lg:order-2 lg:col-span-7 lg:col-start-6">
              <div
                className="relative aspect-[16/10] overflow-clip rounded-2xl border border-paper/10 shadow-[0_40px_90px_-40px_rgb(0_0_0_/_0.9)] transition-[transform,border-color] duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-1.5 group-hover:border-paper/25 lg:rounded-[1.75rem]"
                style={{
                  background: `radial-gradient(90% 80% at 75% 20%, ${next.tone} 0%, #060606 75%)`,
                }}
              >
                {hasPreview ? (
                  <div data-next-media className="absolute -inset-[4%]">
                    <ProjectMedia project={next} sizes="(min-width: 1024px) 55vw, 100vw" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-10">
                    <span className="font-mono text-[0.68rem] uppercase tracking-widest text-paper/55">
                      {next.discipline}
                    </span>
                    <span className="mt-3 text-[clamp(2.4rem,6vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em] text-transparent [-webkit-text-stroke:2px_rgb(243_242_238_/_0.85)] [text-wrap:balance]">
                      {next.name}
                    </span>
                  </div>
                )}
                <span className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100 max-lg:hidden">
                  <ArrowUpRight className="size-4" strokeWidth={1.75} />
                </span>
              </div>
            </div>

            <div data-next-copy className="min-w-0 lg:order-1 lg:col-span-5 lg:pb-2">
              <span
                aria-hidden="true"
                className="hidden text-[clamp(5rem,9vw,8.5rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(243_242_238_/_0.45)] lg:block"
              >
                {nextNo}
              </span>
              <p className="font-mono text-[0.68rem] uppercase tracking-widest text-accent-2 lg:mt-8">
                <span className="lg:hidden">{next.industry}</span>
                <span className="max-lg:hidden">{next.discipline}</span>
              </p>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-paper/70 max-sm:line-clamp-3 sm:text-base lg:text-[1.05rem] [text-wrap:pretty]">
                {next.summary}
              </p>
              <span className="relative mt-7 flex min-h-14 items-center justify-between gap-5 overflow-clip rounded-full bg-paper py-1.5 pl-6 pr-1.5 text-[0.8rem] font-medium uppercase tracking-[0.06em] text-ink sm:inline-flex lg:mt-8">
                <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                <span className="relative">View next case</span>
                <span className="relative flex size-11 items-center justify-center rounded-full bg-accent text-on-accent transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper">
                  <ArrowUpRight className="size-4" strokeWidth={1.75} />
                </span>
              </span>
            </div>
          </div>
        </div>
      </TransitionLink>
    </div>
  );
}
