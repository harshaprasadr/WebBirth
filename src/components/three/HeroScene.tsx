import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { gsap } from '@/lib/gsap'
import { sceneState } from '@/lib/webgl'

/* ────────────────────────────────────────────────────────────────────────────
 * Hero — the WebBirth mark in liquid glass, refracting the giant headline.
 *
 *  · Backdrop plane: a canvas texture that re-paints the DOM headline at its
 *    exact on-screen position (font, size, tracking, outline), plus the stage
 *    glow. The real <h1> stays in the DOM for accessibility; once this scene
 *    has painted, the page cross-fades the DOM text out.
 *  · Foreground: the logo (two bars + pin with power symbol, measured from the brand mark),
 *    merged into one mesh painted with the logo's own gradient (#dc4e2a →
 *    #e37e40), glossy clearcoat and a light glass transmission over the type.
 *  · Motion: assembles on load, sways, follows the pointer, spins on click,
 *    and pushes toward the camera as the hero scrolls away.
 * ──────────────────────────────────────────────────────────────────────────── */

export const STAGE_BG = '#080605'
const PX = 150
// Measured from public/brand/webbirth-mark-lg.webp (656×480).
const toW = (x: number, y: number): [number, number] => [(x - 328) / PX, -(y - 240) / PX]
const BAR = { len: 517 / PX, r: 66 / PX, angle: (-63.6 * Math.PI) / 180 }
const BARS: [number, number][] = [toW(154.1, 240.5), toW(363.7, 240.5)]
const PIN = { c: toW(558, 101), R: 97 / PX, tip: toW(557, 327) }
/** Power symbol cut through the pin: ring with a 40° opening at the top + vertical stem. */
const POWER = { c: toW(558, 104), r: 54 / PX, hw: 10 / PX, gap: (40 * Math.PI) / 180, stemTop: toW(558, 40)[1], stemBottom: toW(558, 82)[1] }
const DEPTH = 0.42
const extrude = { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 10, curveSegments: 64 }
// Finer bevel on the pin so the thin power-symbol strokes stay open;
// same overall thickness as the bars (thinner bevel, deeper body).
const PIN_BEVEL = 0.025
const pinExtrude = { ...extrude, depth: DEPTH + 0.08, bevelThickness: 0.08, bevelSize: PIN_BEVEL, bevelSegments: 6 }

/** Power-symbol holes (in world units), enlarged by the bevel so they read at true size. */
function powerHoles() {
  const [cx, cy] = POWER.c
  const hw = POWER.hw + PIN_BEVEL
  const ro = POWER.r + hw
  const ri = POWER.r - hw
  const a0 = Math.PI / 2 + POWER.gap
  const a1 = Math.PI / 2 - POWER.gap + Math.PI * 2
  const pts: THREE.Vector2[] = []
  const N = 64
  const C = 12
  for (let i = 0; i <= N; i++) {
    const a = a0 + ((a1 - a0) * i) / N
    pts.push(new THREE.Vector2(cx + Math.cos(a) * ro, cy + Math.sin(a) * ro))
  }
  const cap = (a: number, from: number) => {
    const px = cx + Math.cos(a) * POWER.r
    const py = cy + Math.sin(a) * POWER.r
    for (let i = 1; i < C; i++) {
      const t = from + (Math.PI * i) / C
      pts.push(new THREE.Vector2(px + Math.cos(t) * hw, py + Math.sin(t) * hw))
    }
  }
  cap(a1, a1)
  for (let i = N; i >= 0; i--) {
    const a = a0 + ((a1 - a0) * i) / N
    pts.push(new THREE.Vector2(cx + Math.cos(a) * ri, cy + Math.sin(a) * ri))
  }
  cap(a0, a0 + Math.PI)
  const ring = new THREE.Path().setFromPoints(pts)

  const stem = new THREE.Path()
  stem.moveTo(cx - hw, POWER.stemTop)
  stem.absarc(cx, POWER.stemTop, hw, Math.PI, 0, true)
  stem.lineTo(cx + hw, POWER.stemBottom)
  stem.absarc(cx, POWER.stemBottom, hw, 0, Math.PI, true)
  stem.lineTo(cx - hw, POWER.stemTop)
  return [ring, stem]
}

function logoGeometry() {
  const parts: THREE.BufferGeometry[] = []
  const a = BAR.len / 2 - BAR.r
  const r = BAR.r - 0.08
  BARS.forEach(([x, y]) => {
    const s = new THREE.Shape()
    s.moveTo(-a, -r)
    s.lineTo(a, -r)
    s.absarc(a, 0, r, -Math.PI / 2, Math.PI / 2, false)
    s.lineTo(-a, r)
    s.absarc(-a, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false)
    const g = new THREE.ExtrudeGeometry(s, extrude)
    g.rotateZ(BAR.angle)
    g.translate(x, y, 0)
    parts.push(g)
  })
  const [cx, cy] = PIN.c
  const [tx, ty] = PIN.tip
  const R = PIN.R - PIN_BEVEL
  const theta = Math.atan2(ty - cy, tx - cx)
  const phi = Math.acos(R / Math.hypot(tx - cx, ty - cy))
  const body = new THREE.Shape()
  body.moveTo(tx, ty)
  body.lineTo(cx + Math.cos(theta + phi) * R, cy + Math.sin(theta + phi) * R)
  body.absarc(cx, cy, R, theta + phi, theta - phi, false)
  body.lineTo(tx, ty)
  body.holes.push(...powerHoles())
  const pinGeo = new THREE.ExtrudeGeometry(body, pinExtrude)
  pinGeo.translate(0, 0, -0.04)
  parts.push(pinGeo)
  const merged = mergeGeometries(parts)!
  parts.forEach((p) => p.dispose())
  merged.computeBoundingBox()
  const c = new THREE.Vector3()
  merged.boundingBox!.getCenter(c)
  merged.translate(-c.x, -c.y, -c.z)
  merged.computeVertexNormals()
  return merged
}

/* ── backdrop: repaint the DOM headline into a texture ───────────────────── */

function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== root) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y }
}

function paintStage(root: HTMLElement, dpr: number) {
  const W = root.clientWidth
  const H = root.clientHeight
  const c = document.createElement('canvas')
  c.width = Math.max(2, Math.round(W * dpr))
  c.height = Math.max(2, Math.round(H * dpr))
  const ctx = c.getContext('2d')!
  ctx.scale(dpr, dpr)
  ctx.fillStyle = STAGE_BG
  ctx.fillRect(0, 0, W, H)
  // stage glow (mirrors the CSS backdrop)
  const portrait = H > W // matches the CSS `portrait:` variant
  const gx = portrait ? W * 0.5 : W * 0.7
  const gy = portrait ? H * 0.58 : H * 0.48
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.5)
  glow.addColorStop(0, 'rgba(255,120,50,0.55)')
  glow.addColorStop(0.3, 'rgba(242,87,28,0.18)')
  glow.addColorStop(1, 'rgba(242,87,28,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // The headline is no longer painted here: the DOM <h1> renders above the canvas,
  // so the glass mark sits behind the text.
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function Backdrop({ stageRef, onPainted }: { stageRef: RefObject<HTMLElement | null>; onPainted: () => void }) {
  const { width, height } = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)
  const invalidate = useThree((s) => s.invalidate)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const painted = useRef(false)

  useEffect(() => {
    const root = stageRef.current
    if (!root) return
    let alive = true
    const id = window.setTimeout(() => {
      document.fonts.ready.then(() => {
        if (!alive || !mat.current) return
        const old = mat.current.map
        mat.current.map = paintStage(root, Math.min(dpr, 2))
        mat.current.needsUpdate = true
        old?.dispose()
        invalidate()
        if (!painted.current) {
          painted.current = true
          onPainted()
        }
      })
    }, 60) // let layout settle after a resize
    return () => {
      alive = false
      window.clearTimeout(id)
    }
  }, [size.width, size.height, dpr, stageRef, invalidate, onPainted])

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial ref={mat} color="#ffffff" toneMapped={false} />
    </mesh>
  )
}

/* ── glass mark ──────────────────────────────────────────────────────────── */


const GLASS_BG = new THREE.Color(STAGE_BG)

/** Where the glass should sit (0–1 across the stage): near the end of "NEXT". */
function useAnchor(stageRef: RefObject<HTMLElement | null>) {
  const size = useThree((s) => s.size)
  return useMemo(() => {
    const root = stageRef.current
    const dots = root ? [...root.querySelectorAll<HTMLElement>('[data-seg="accent"]')].filter((d) => d.offsetParent) : []
    const dot = dots[dots.length - 1]
    if (!root || !dot) return 0.75
    const x = offsetWithin(dot, root).x / root.clientWidth
    return THREE.MathUtils.clamp(x + 0.06, 0.62, 0.80)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, stageRef])
}

function GlassMark({ play, reduced, mobile, stageRef }: { play: boolean; reduced: boolean; mobile: boolean; stageRef: RefObject<HTMLElement | null> }) {
  const anchor = useAnchor(stageRef)
  const rig = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const geo = useMemo(logoGeometry, [])
  useEffect(() => () => geo.dispose(), [geo])
  const vp = useThree((s) => s.viewport)
  const intro = useRef({ k: reduced ? 1 : 0 })

  // Layout: right of centre on wide screens, centred and lower on portrait.
  const portrait = vp.aspect < 1
  const baseScale = portrait ? (vp.width * 0.34) / 4.65 : Math.min((vp.height * 0.30) / 3.2, (vp.width * 0.26) / 4.65)
  const baseX = portrait ? 0 : (anchor - 0.5) * vp.width
  const baseY = portrait ? -vp.height * 0.0 : -vp.height * 0.02

  useEffect(() => {
    if (reduced || !play) return
    const t = gsap.to(intro.current, { k: 1, duration: 2.6, ease: 'expo.out', delay: 0.15 })
    return () => {
      t.kill()
    }
  }, [play, reduced])

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (!spin.current || reduced) return
    gsap.to(spin.current.rotation, { y: spin.current.rotation.y + Math.PI * 2, duration: 1.8, ease: 'expo.inOut' })
  }

  useFrame((state) => {
    const g = rig.current
    if (!g) return
    const k = intro.current.k
    const s = sceneState.heroScroll

    if (portrait) {
      g.rotation.x = 0
      g.rotation.y = 0
      g.rotation.z = 0
      g.scale.setScalar(baseScale * k)
      g.position.set(baseX, baseY, 1.6)
      return
    }

    const t = reduced ? 0 : state.clock.elapsedTime
    const tx = -0.08 + state.pointer.y * -0.22 + s * 0.7 + Math.sin(t * 0.5) * 0.05
    const ty = state.pointer.x * 0.5 + Math.sin(t * 0.32) * 0.28 + (1 - k) * -1.9 + s * 1.1
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tx, 0.06)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, ty, 0.06)
    g.rotation.z = Math.sin(t * 0.4) * 0.04
    const sc = baseScale * (0.35 + 0.65 * k) * (1 + s * 0.45)
    g.scale.setScalar(sc)
    g.position.set(
      baseX + state.pointer.x * 0.25,
      baseY + Math.sin(t * 0.9) * 0.08 + state.pointer.y * 0.12 + s * vp.height * 0.08,
      1.6 - (1 - k) * 4 + s * 2.2,
    )
  })

  return (
    <group ref={rig}>
      <group
        ref={spin}
        onClick={onClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <mesh geometry={geo}>
          <MeshTransmissionMaterial
            background={GLASS_BG}
            samples={mobile ? 3 : 4}
            resolution={mobile ? 256 : 512}
            transmission={1}
            thickness={0.45}
            roughness={0.03}
            ior={1.36}
            chromaticAberration={0.32}
            anisotropicBlur={0.12}
            distortion={0.28}
            distortionScale={0.45}
            temporalDistortion={reduced ? 0 : 0.08}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color="#ffd2b5"
            attenuationColor="#ff7a3a"
            attenuationDistance={3.5}
            envMapIntensity={1.6}
            emissive="#f2571c"
            emissiveIntensity={0.55}
          />
        </mesh>
      </group>
    </group>
  )
}

export default function HeroScene({
  stageRef,
  active,
  reduced,
  play,
  onReady,
}: {
  stageRef: RefObject<HTMLElement | null>
  active: boolean
  reduced: boolean
  play: boolean
  onReady: () => void
}) {
  const mobile = useMemo(() => window.innerWidth < 768, [])
  return (
    <Canvas
      // Canvas re-measures itself on every scroll by default, re-rendering the whole scene ~20×/s.
      resize={{ scroll: false }}
      className="!absolute inset-0"
      dpr={mobile ? [1, 1.25] : [1, 1.5]}
      frameloop={active ? (reduced ? 'demand' : 'always') : 'never'}
      camera={{ position: [0, 0, 10], fov: 32 }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <color attach="background" args={[STAGE_BG]} />
      <Backdrop stageRef={stageRef} onPainted={onReady} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 6]} intensity={2} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.5} position={[0, 5, 2]} scale={[10, 1.4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-6, 0, 2]} scale={[1.2, 7, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3} position={[6, -1, 1]} scale={[1.6, 6, 1]} color="#ff8a4d" />
        <Lightformer form="ring" intensity={2} position={[0, -4, 3]} scale={5} color="#f2571c" />
      </Environment>
      <GlassMark play={play} reduced={reduced} mobile={mobile} stageRef={stageRef} />
      {!reduced && !mobile && (
        <Sparkles count={mobile ? 30 : 60} scale={[14, 7, 4]} position={[0, 0, 2.5]} size={3} speed={0.3} opacity={0.6} color="#ff8a4d" noise={0.7} />
      )}
    </Canvas>
  )
}
