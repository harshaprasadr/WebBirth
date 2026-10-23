import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Physics2DPlugin } from 'gsap/Physics2DPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase, MotionPathPlugin, Physics2DPlugin, useGSAP)
gsap.defaults({ ease: 'expo.out', duration: 1.1 })
CustomEase.create('case', 'M0,0 C0.12,0.72 0.18,1 1,1')

/** Media queries shared by every gsap.matchMedia() call. In rem so they track Tailwind's md/lg breakpoints exactly. */
export const mq = {
  desktop: '(min-width: 64rem) and (prefers-reduced-motion: no-preference)',
  tablet: '(min-width: 48rem) and (max-width: 63.98rem) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 47.98rem) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

const LABELLABLE = 'h1,h2,h3,h4,h5,h6,[role]'
const create = SplitText.create.bind(SplitText)
type CreateArgs = Parameters<typeof SplitText.create>
SplitText.create = ((target: CreateArgs[0], vars?: CreateArgs[1]) => {
  if (vars?.aria === undefined) {
    const els = gsap.utils.toArray<Element>(target)
    const ok = els.length > 0 && els.every((el) => el.matches(LABELLABLE))
    vars = { ...vars, aria: ok ? 'auto' : 'none' } as CreateArgs[1]
  }
  return create(target, vars)
}) as typeof SplitText.create

export { gsap, ScrollTrigger, SplitText, useGSAP }
