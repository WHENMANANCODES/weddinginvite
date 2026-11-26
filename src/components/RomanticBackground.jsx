import { useEffect, useRef, useState } from 'react'

// Real photos live in  src/assets/bg/  (hawa-mahal.jpg, jaisalmer.jpg, amer-fort.jpg).
// import.meta.glob picks up whichever files exist, so a missing photo never breaks the build.
const files = import.meta.glob('../assets/bg/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const url = (name) => Object.entries(files).find(([path]) => path.includes(name))?.[1]

/*
  Full-screen photographs of Rajasthan, crossfading slowly with a gentle zoom.
  The photo is the background; only a light cream veil sits on top for text, plus
  bougainvillea in two corners and drifting petals.
  Portrait photos are used on phones, landscape photos on wide screens.
*/

// pos = "x% y%" focus point. x keeps the faces centred on phones, y keeps them in frame on wide screens.
const PHOTOS = [
  { src: url('IMG1'), pos: '50% 13%' }, // pink saree and bandi, stone pillar
  { src: url('IMG2'), pos: '55% 35%' }, // close-up, looking at each other
  { src: url('IMG7'), pos: '45% 26%' }, // rooftop, laheriya saree
  { src: url('IMG4'), pos: '34% 41%' }, // garba night, glowing tree
  { src: url('IMG3'), pos: '40% 24%' }, // festival gate
  { src: url('IMG5'), pos: '36% 50%' }, // green garden
  { src: url('IMG6'), pos: '56% 30%' }, // evening balcony
].filter((p) => p.src)

const range = (n, f) => Array.from({ length: n }, (_, i) => f(i))

const COLORS = [
  ['#b5156a', '#e8509a'],
  ['#d11f86', '#f470b4'],
  ['#f4a9cb', '#ffe6f0'],
]
const FLOWERS = [
  [34, 20, 1.15, 0, 10], [84, 38, 0.95, 1, 40], [128, 66, 1.25, 0, 80], [96, 14, 0.7, 2, 20],
  [170, 108, 1.05, 1, 15], [150, 38, 0.8, 2, 60], [58, 68, 0.75, 1, 30], [196, 156, 1.2, 0, 50],
  [184, 72, 0.7, 2, 90], [222, 204, 0.95, 2, 5], [120, 118, 0.8, 0, 70],
]
const LEAVES = [
  [70, 30, -30], [112, 52, 20], [150, 92, 40], [188, 134, 10], [214, 184, 60],
  [96, 8, -50], [48, 52, 30], [160, 140, 70], [132, 96, 100], [200, 110, -10],
]

function Sprig() {
  return (
    <svg viewBox="0 0 280 250" className="rb-sway h-auto w-full overflow-visible drop-shadow-[0_4px_10px_rgba(80,20,50,0.25)]">
      <g fill="none" stroke="#6a4e3a" strokeLinecap="round">
        <path d="M-12 6C50 18 110 22 160 70S226 130 238 222" strokeWidth="3.4" />
        <path d="M120 34C146 26 168 38 176 62" strokeWidth="2" />
        <path d="M168 104C196 92 214 100 226 120" strokeWidth="2" />
      </g>
      {LEAVES.map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="15"
          ry="7"
          transform={`rotate(${r} ${x} ${y})`}
          fill={i % 2 ? '#6f9552' : '#86a864'}
          stroke="#4f7240"
          strokeOpacity=".5"
          strokeWidth=".8"
        />
      ))}
      {FLOWERS.map(([x, y, s, c, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
          {[0, 120, 240].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <ellipse cx="0" cy="-10" rx="8.5" ry="13" fill={COLORS[c][0]} fillOpacity=".95" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" />
              <ellipse cx="0" cy="-13" rx="5" ry="8" fill={COLORS[c][1]} fillOpacity=".55" />
            </g>
          ))}
          <circle r="3.2" fill="#fff6dc" />
          <circle r="1.2" fill="#f2a33a" />
        </g>
      ))}
    </svg>
  )
}

export default function RoyalBackground({ interval = 9000 }) {
  const root = useRef(null)
  const [idx, setIdx] = useState(0)
  const [portrait, setPortrait] = useState(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth
  )

  useEffect(() => {
    const onResize = () => setPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Portrait photo only on tall screens; landscape photos on wide ones
  const live = PHOTOS.filter((p) => (p.portrait ? portrait : true))

  useEffect(() => {
    if (live.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIdx((i) => (i + 1) % live.length), interval)
    return () => clearInterval(id)
  }, [live.length, interval])

  // Gentle parallax on the flowers
  useEffect(() => {
    const layers = [...root.current.querySelectorAll('[data-d]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const p = { x: 0, y: 0, tx: 0, ty: 0, touched: false }
    let raf = 0
    const onMove = (e) => {
      p.touched = true
      p.tx = (e.clientX / window.innerWidth - 0.5) * 2
      p.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const tick = (now) => {
      if (!p.touched) {
        p.tx = Math.sin(now / 5000) * 0.45
        p.ty = Math.cos(now / 7000) * 0.25
      }
      p.x += (p.tx - p.x) * 0.05
      p.y += (p.ty - p.y) * 0.05
      for (const l of layers) {
        const d = Number(l.dataset.d)
        l.style.transform = `translate3d(${(-p.x * d * 18).toFixed(2)}px,${(-p.y * d * 8).toFixed(2)}px,0)`
      }
      raf = requestAnimationFrame(tick)
    }
    if (!reduce) {
      window.addEventListener('pointermove', onMove)
      raf = requestAnimationFrame(tick)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const current = idx % live.length

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#fbd9c8]"
    >
      {/* The photographs */}
      {live.map((ph, i) => (
        <img
          key={ph.src}
          src={ph.src}
          alt=""
          decoding="async"
          className="rb-kb absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: ph.pos,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 2.6s ease-in-out',
            filter: 'saturate(1.04) brightness(1.04)',
          }}
        />
      ))}

      {/* Warm glow at the edges so it feels like an invitation, not a stock photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(122,18,48,0.28) 130%), linear-gradient(180deg, rgba(255,214,200,.25), transparent 35%)',
        }}
      />

      {/* Bougainvillea corners */}
      <div data-d="0.9" className="absolute -left-3 -top-3 w-[min(54vw,350px)]">
        <Sprig />
      </div>
      <div data-d="0.9" className="absolute -bottom-3 -right-3 w-[min(46vw,310px)] rotate-180">
        <Sprig />
      </div>

      {/* Petals and gold dust */}
      {range(12, (i) => (
        <span
          key={`p${i}`}
          className="rb-petal absolute"
          style={{
            left: `${(i * 47 + 5) % 100}%`,
            width: 8 + (i % 4) * 3,
            height: (8 + (i % 4) * 3) * 1.5,
            animationDelay: `${(i * 1.7) % 14}s`,
            animationDuration: `${14 + (i % 5) * 3}s`,
            background: ['#f48fb1', '#ffc2d4', '#f9a8c0', '#f6b25a'][i % 4],
            '--r': `${i * 37}deg`,
          }}
        />
      ))}
      {range(14, (i) => (
        <span
          key={`s${i}`}
          className="rb-dust absolute rounded-full bg-[#ffd27a]"
          style={{
            left: `${(i * 59 + 11) % 100}%`,
            top: `${(i * 31 + 7) % 75}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            animationDelay: `${(i * 0.7) % 6}s`,
          }}
        />
      ))}

      {/* Light cream veil: just enough for text, photo stays clearly visible */}
      <div className="absolute inset-0" style={{ background: 'rgba(255,248,240,0.26)' }} />

      <style>{`
        .rb-kb { animation: rbKb 24s ease-in-out infinite alternate; transform-origin: 50% 60%; }
        @keyframes rbKb { from { transform: scale(1.02); } to { transform: scale(1.1); } }
        .rb-sway { transform-origin: 0 0; animation: rbSway 9s ease-in-out infinite alternate; }
        @keyframes rbSway { from { transform: rotate(-1.8deg); } to { transform: rotate(1.8deg); } }
        .rb-petal {
          top: -8%;
          border-radius: 100% 0 100% 0;
          opacity: 0;
          animation: rbFall linear infinite;
          will-change: transform, opacity;
        }
        @keyframes rbFall {
          0% { transform: translate3d(0,-8vh,0) rotate(var(--r)); opacity: 0; }
          10% { opacity: .75; }
          90% { opacity: .5; }
          100% { transform: translate3d(70px,110vh,0) rotate(calc(var(--r) + 540deg)); opacity: 0; }
        }
        .rb-dust { opacity: 0; animation: rbTwinkle 5s ease-in-out infinite; }
        @keyframes rbTwinkle { 0%,100% { opacity: 0; } 50% { opacity: .85; } }
        @media (prefers-reduced-motion: reduce) {
          .rb-kb, .rb-sway, .rb-dust { animation: none; }
          .rb-petal { display: none; }
        }
      `}</style>
    </div>
  )
}