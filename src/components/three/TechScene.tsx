import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { technologies, type Tech } from '@/data/site'
import { cn } from '@/lib/cn'

const ORANGE = new THREE.Color('#ff7a3d')
const RADIUS = 2.3
const LOGO = '/brand/webbirth-mark-lg.webp?v=2'

export type DragState = { vx: number; dragging: boolean }

type SceneProps = {
  active: string | null
  onActive: (id: string | null) => void
  reduced: boolean
  started: boolean
  drag: MutableRefObject<DragState>
}

/** Even spread of N points on a sphere (Fibonacci lattice), slightly flattened. */
function fibonacci(n: number) {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    pts.push(new THREE.Vector3(Math.cos(t) * r, y * 0.78, Math.sin(t) * r).multiplyScalar(RADIUS))
  }
  return pts
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(255,122,61,0.9)')
  grad.addColorStop(0.25, 'rgba(242,87,28,0.45)')
  grad.addColorStop(1, 'rgba(242,87,28,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function Core({ reduced }: { reduced: boolean }) {
  const logo = useTexture(LOGO)
  logo.colorSpace = THREE.SRGBColorSpace
  logo.anisotropy = 8
  const glow = useMemo(glowTexture, [])
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Sprite>(null)
  const aspect = 480 / 656

  useFrame((state, delta) => {
    const d = reduced ? 0 : delta
    if (ringA.current) {
      ringA.current.rotation.z += d * 0.35
      ringA.current.rotation.x = 1.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    }
    if (ringB.current) ringB.current.rotation.z -= d * 0.22
    if (halo.current) halo.current.scale.setScalar(3.1 + Math.sin(state.clock.elapsedTime * 1.4) * (reduced ? 0 : 0.18))
  })

  return (
    <group>
      <sprite ref={halo} scale={3.1}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <Billboard>
        <mesh>
          <planeGeometry args={[1.3, 1.3 * aspect]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </Billboard>
      <mesh ref={ringA} rotation={[1.2, 0, 0]}>
        <torusGeometry args={[1.02, 0.006, 8, 160]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[0, 0.5, 0]}>
        <torusGeometry args={[1.16, 0.004, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function Constellation({ active, onActive, reduced, started, drag }: SceneProps) {
  const rig = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const net = useRef<THREE.Group>(null)
  const pulses = useRef<THREE.InstancedMesh>(null)
  const labels = useRef<(HTMLButtonElement | null)[]>([])
  const intro = useRef(reduced ? 1 : 0)
  const startAt = useRef<number | null>(null)

  const points = useMemo(() => fibonacci(technologies.length), [])
  const index = useMemo(() => Object.fromEntries(technologies.map((t, i) => [t.id, i])), [])

  // Faint spokes from the core + the real dependency links between techs.
  const baseGeo = useMemo(() => {
    const v: number[] = []
    points.forEach((p) => v.push(0, 0, 0, p.x, p.y, p.z))
    technologies.forEach((t) =>
      t.links?.forEach((l) => {
        const a = points[index[t.id]]
        const b = points[index[l]]
        v.push(a.x, a.y, a.z, b.x, b.y, b.z)
      }),
    )
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
  }, [points, index])

  const activeGeo = useMemo(() => {
    const v: number[] = []
    if (active) {
      const a = points[index[active]]
      v.push(0, 0, 0, a.x, a.y, a.z)
      technologies.forEach((t) =>
        t.links?.forEach((l) => {
          if (t.id !== active && l !== active) return
          const p = points[index[t.id]]
          const q = points[index[l]]
          v.push(p.x, p.y, p.z, q.x, q.y, q.z)
        }),
      )
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
  }, [active, points, index])
  useEffect(() => () => activeGeo.dispose(), [activeGeo])
  useEffect(() => () => baseGeo.dispose(), [baseGeo])

  const PULSES_PER = 2
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const world = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const d = Math.min(delta, 0.05)

    // Entrance: the network bursts out from the core.
    if (started && startAt.current === null) startAt.current = t
    if (!reduced && startAt.current !== null) {
      const k = Math.min(1, (t - startAt.current) / 1.8)
      intro.current = 1 - Math.pow(1 - k, 4)
    }
    const s = Math.max(0.001, intro.current)
    // Narrow (portrait) screens: pull the constellation in so labels stay on-screen.
    const fit = THREE.MathUtils.clamp(state.viewport.aspect * 0.7, 0.5, 1)
    net.current?.scale.setScalar(s * fit)

    // Spin: idle drift + drag momentum; tilt follows the pointer.
    if (spin.current) {
      const dr = drag.current
      if (!dr.dragging) dr.vx *= 0.94
      spin.current.rotation.y += (reduced ? 0 : d * 0.12) + dr.vx
    }
    if (rig.current) {
      rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, -state.pointer.y * 0.25 + 0.12, 0.05)
      rig.current.rotation.z = THREE.MathUtils.lerp(rig.current.rotation.z, state.pointer.x * 0.06, 0.05)
    }

    // Data packets stream outward along every spoke.
    if (pulses.current) {
      points.forEach((p, i) => {
        const boost = technologies[i].id === active ? 2.6 : 1
        for (let k = 0; k < PULSES_PER; k++) {
          const u = reduced ? 0.5 : ((t * 0.32 * boost + i * 0.137 + k / PULSES_PER) % 1)
          dummy.position.copy(p).multiplyScalar(0.22 + u * 0.78)
          dummy.scale.setScalar(Math.sin(u * Math.PI) * (boost > 1 ? 1.5 : 1))
          dummy.updateMatrix()
          pulses.current!.setMatrixAt(i * PULSES_PER + k, dummy.matrix)
        }
      })
      pulses.current.instanceMatrix.needsUpdate = true
    }

    // Depth cueing on the HTML labels (front = crisp, back = faded).
    points.forEach((p, i) => {
      const el = labels.current[i]
      if (!el || !net.current) return
      world.copy(p)
      net.current.localToWorld(world)
      const depth = THREE.MathUtils.clamp((world.z / RADIUS + 1) / 2, 0, 1)
      const isActive = technologies[i].id === active
      el.style.opacity = String(isActive ? 1 : 0.32 + depth * 0.68)
      el.style.transform = `scale(${(isActive ? 1.18 : 0.82 + depth * 0.22) * (0.6 + s * 0.4)})`
    })
  })

  return (
    <group ref={rig}>
      <Suspense fallback={null}>
        <Core reduced={reduced} />
      </Suspense>
      <group ref={spin}>
        <group ref={net}>
          <lineSegments geometry={baseGeo}>
            <lineBasicMaterial color="#ffffff" transparent opacity={active ? 0.06 : 0.13} />
          </lineSegments>
          <lineSegments geometry={activeGeo}>
            <lineBasicMaterial color={ORANGE} transparent opacity={0.95} toneMapped={false} />
          </lineSegments>
          <instancedMesh ref={pulses} args={[undefined, undefined, points.length * PULSES_PER]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshBasicMaterial color={ORANGE} toneMapped={false} />
          </instancedMesh>
          {technologies.map((tech, i) => (
            <group key={tech.id} position={points[i]}>
              <Html center zIndexRange={[30, 0]}>
                <NodeLabel
                  tech={tech}
                  active={active === tech.id}
                  dimmed={active !== null && active !== tech.id}
                  onActive={onActive}
                  ref={(el) => void (labels.current[i] = el)}
                />
              </Html>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}

function NodeLabel({
  tech,
  active,
  dimmed,
  onActive,
  ref,
}: {
  tech: Tech
  active: boolean
  dimmed: boolean
  onActive: (id: string | null) => void
  ref: (el: HTMLButtonElement | null) => void
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      aria-label={`${tech.label}: ${tech.description}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onActive(tech.id)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onActive(null)}
      onFocus={() => onActive(tech.id)}
      onBlur={() => onActive(null)}
      onClick={() => onActive(tech.id)}
      className={cn(
        'flex min-h-6 select-none items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.72rem] font-medium tracking-tight backdrop-blur-sm transition-[background-color,border-color,color] duration-500 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[0.82rem]',
        active
          ? 'border-accent-2 bg-accent-2 text-ink shadow-[0_0_30px_rgb(255_138_82_/_0.55)]'
          : dimmed
            ? 'border-white/10 bg-ink/70 text-paper/60'
            : 'border-white/15 bg-ink/70 text-paper/90 hover:border-accent-2/70',
      )}
    >
      <span className={cn('size-1.5 rounded-full', active ? 'bg-ink' : 'bg-accent-2')} aria-hidden="true" />
      {tech.label}
    </button>
  )
}

export default function TechScene({ active, onActive, reduced, started, drag, running, onReady }: SceneProps & { running: boolean; onReady?: () => void }) {
  return (
    <Canvas
      // Canvas re-measures itself on every scroll by default, re-rendering the whole scene ~20×/s.
      resize={{ scroll: false }}
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      frameloop={running ? (reduced ? 'demand' : 'always') : 'never'}
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
    >
      <Constellation active={active} onActive={onActive} reduced={reduced} started={started} drag={drag} />
    </Canvas>
  )
}
