import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneState } from '@/lib/webgl'

/* Colours are passed as raw sRGB triplets: the shader writes them straight out. */
const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16)
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uOrange;
  uniform vec3 uAmber;
  uniform vec3 uDeep;
  attribute vec3 aPosB;
  attribute vec3 aPosC;
  attribute vec3 aColB;
  attribute vec4 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
  mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }

  void main() {
    // Stage weights, staggered per particle so shapes assemble organically.
    float d = aRand.x * 0.4;
    float t1 = smoothstep(0.0, 1.0, clamp((uProgress - d) / 0.6, 0.0, 1.0));
    float t2 = smoothstep(0.0, 1.0, clamp((uProgress - 1.0 - d) / 0.6, 0.0, 1.0));

    // A — a still, dense cluster. No orbiting: each particle only breathes
    // in place, so the core gently pulses and shimmers.
    float pulse = 1.0 + 0.035 * sin(uTime * 0.9 + aRand.x * 6.2831) + 0.02 * sin(uTime * 0.5 - length(position) * 1.6);
    vec3 a = position * pulse;

    // B — the WebBirth mark, gently breathing in depth.
    vec3 b = aPosB;
    b.z += sin(uTime * 1.4 + aRand.z * 6.2831) * 0.04;

    // C — a living system grid.
    vec3 c = aPosC;
    float wave = sin(c.x * 1.3 + uTime * 0.9) * 0.22
               + cos(c.z * 1.7 - uTime * 0.7) * 0.18
               + sin((c.x + c.z) * 0.6 + uTime * 0.5) * 0.12;
    c.y += wave;
    c = rotX(0.42) * c;

    vec3 pos = mix(a, b, t1);
    pos = mix(pos, c, t2);

    // Turbulence while travelling between shapes.
    float burst = sin(t1 * 3.14159) + sin(t2 * 3.14159);
    vec3 swirl = vec3(
      sin(aRand.y * 12.0 + uTime * 1.5),
      cos(aRand.z * 12.0 + uTime * 1.3),
      sin(aRand.w * 12.0 + uTime * 1.1)
    );
    pos += swirl * burst * (0.3 + aRand.y * 0.55);

    // Fewer white-hot grains and a softer overall glow: the cluster is ambient, not a flash.
    vec3 colA = mix(uOrange, vec3(0.98, 0.86, 0.72), pow(aRand.y, 14.0)) * 0.72;
    colA = mix(colA, uAmber, step(0.72, aRand.z) * 0.6);
    vec3 colC = mix(uDeep, uAmber, clamp(wave * 1.6 + 0.5, 0.0, 1.0));
    colC = mix(colC, vec3(1.0), step(0.985, aRand.w));
    vec3 col = mix(colA, aColB * 0.92, t1);
    col = mix(col, colC, t2);
    vColor = col;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.55 + aRand.w * 0.9);
    // Cluster stage: larger, glowing grains; eases back to normal size as the logo forms.
    size *= mix(1.2, 1.05, t1) * mix(1.0, 1.0 / 1.05, t2) ;
    size *= 1.0 + burst * 0.35;
    gl_PointSize = size * uPixelRatio / -mv.z;
    // The cluster is dense, so keep its additive glow softer than the later shapes.
    vAlpha = mix(mix(0.5, 0.86, t1), 0.9, t2);
  }
`

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.55 + a * 0.85), a * vAlpha);
  }
`

/** Samples opaque pixels of the logo into positions + colours. */
function sampleLogo(img: HTMLImageElement, count: number) {
  const w = 349
  const h = Math.round((img.naturalHeight / img.naturalWidth) * w)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data
  const candidates: number[] = []
  for (let i = 0; i < w * h; i++) if (data[i * 4 + 3] > 200) candidates.push(i)
  const worldW = 4.6
  const worldH = worldW * (h / w)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const idx = candidates[(Math.random() * candidates.length) | 0]
    const px = (idx % w) + Math.random()
    const py = Math.floor(idx / w) + Math.random()
    pos.set([(px / w - 0.5) * worldW, -(py / h - 0.5) * worldH, (Math.random() - 0.5) * 0.35], i * 3)
    col.set([data[idx * 4] / 255, data[idx * 4 + 1] / 255, data[idx * 4 + 2] / 255], i * 3)
  }
  return { pos, col }
}

function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null)
  const progress = useRef(0)
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)

  const geometry = useMemo(() => {
    const posA = new Float32Array(count * 3)
    const posC = new Float32Array(count * 3)
    const colB = new Float32Array(count * 3)
    const rand = new Float32Array(count * 4)

    // A — a spherical volume of particles that never reads as a solid ball:
    // an exponent of 0.45 (a uniform ball would be 1/3) thins the centre so the
    // line-of-sight pile-up doesn't make a hot core, and gaussian jitter feathers
    // the rim so there is no visible edge.
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2
      const v = Math.acos(2 * Math.random() - 1)
      const halo = i % 10 === 0
      const r = halo ? 2.3 + Math.random() * 1.8 : Math.max(0, Math.pow(Math.random(), 0.52) * 2.1 + gauss() * 0.4)
      posA.set([r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u)], i * 3)
      rand.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
    }

    // C — jittered lattice
    const cols = Math.ceil(Math.sqrt(count * 1.75))
    const rows = Math.ceil(count / cols)
    for (let i = 0; i < count; i++) {
      const cx = i % cols
      const rz = Math.floor(i / cols)
      posC.set(
        [(cx / (cols - 1) - 0.5) * 8.4 + (Math.random() - 0.5) * 0.02, -0.35, (rz / (rows - 1) - 0.5) * 4.6 + (Math.random() - 0.5) * 0.02],
        i * 3,
      )
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(posA, 3))
    g.setAttribute('aPosB', new THREE.BufferAttribute(posA.slice(), 3)) // replaced once the logo is sampled
    g.setAttribute('aPosC', new THREE.BufferAttribute(posC, 3))
    g.setAttribute('aColB', new THREE.BufferAttribute(colB.fill(0.95), 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 4))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8)
    return g
  }, [count])

  // Fill the logo targets from the real brand mark.
  useEffect(() => {
    const img = new Image()
    img.src = '/brand/webbirth-mark-lg.webp?v=2'
    let alive = true
    img.decode().then(() => {
      if (!alive) return
      const { pos, col } = sampleLogo(img, count)
      ;(geometry.getAttribute('aPosB') as THREE.BufferAttribute).copyArray(pos).needsUpdate = true
      ;(geometry.getAttribute('aColB') as THREE.BufferAttribute).copyArray(col).needsUpdate = true
      invalidate()
    })
    return () => {
      alive = false
    }
  }, [geometry, count, invalidate])

  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSize: { value: count > 10000 ? 22 : 28 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uOrange: { value: hex('#f2571c') },
          uAmber: { value: hex('#ffa45c') },
          uDeep: { value: hex('#7a2204') },
        },
      }),
    [count],
  )
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const u = material.uniforms
    u.uTime.value += reduced ? 0 : Math.min(delta, 0.05)
    u.uPixelRatio.value = gl.getPixelRatio()
    const target = reduced ? 1 : sceneState.morph
    progress.current += (target - progress.current) * (reduced ? 1 : 0.07)
    u.uProgress.value = progress.current

    const p = points.current
    if (!p) return
    // Fit the composition to narrow screens.
    const fit = THREE.MathUtils.clamp(state.viewport.width / 5.6, 0.4, 1)
    p.scale.setScalar(THREE.MathUtils.lerp(p.scale.x, fit, 0.1))
    // Portrait screens: nudge the composition slightly above centre so it
    // clears the chapter copy without overlapping the title.
    const lift = state.viewport.aspect < 1 ? state.viewport.height * 0.04 : 0
    p.position.y = THREE.MathUtils.lerp(p.position.y, lift, 0.1)
    // Pointer parallax, stronger on the logo so it feels sculptural.
    const logo = Math.max(0, 1 - Math.abs(progress.current - 1))
    p.rotation.y = THREE.MathUtils.lerp(p.rotation.y, state.pointer.x * (0.15 + logo * 0.25), 0.05)
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, -state.pointer.y * (0.1 + logo * 0.15), 0.05)
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}

export default function MorphScene({ active, reduced, onReady }: { active: boolean; reduced: boolean; onReady?: () => void }) {
  const count = useMemo(() => (window.innerWidth < 768 ? 7000 : 15000), [])
  return (
    <Canvas
      // Canvas re-measures itself on every scroll by default, re-rendering the whole scene ~20×/s.
      resize={{ scroll: false }}
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      frameloop={active ? (reduced ? 'demand' : 'always') : 'never'}
      camera={{ position: [0, 0, 7.5], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
    >
      <Particles count={count} reduced={reduced} />
    </Canvas>
  )
}
