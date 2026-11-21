import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { invite } from '../data/invite'

let bgMusic = null

/*
  Rajasthani palette
  maroon  #4a0a18  deep Marwari maroon (pheras)
  ruby    #9b1237  bridal red
  rani    #e0306e  rani pink
  saffron #f2a33a  marigold / kesariya
  gold    #e6b84a  zari
  peacock #0f8b8d  Jodhpur / mor turquoise
  ivory   #fbf1dc  card
*/

// Bandhani (tie-dye) dot clusters
const BANDHANI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cg fill='%23f2a33a' fill-opacity='.28'%3E%3Ccircle cx='14' cy='14' r='1.6'/%3E%3Ccircle cx='9' cy='14' r='1'/%3E%3Ccircle cx='19' cy='14' r='1'/%3E%3Ccircle cx='14' cy='9' r='1'/%3E%3Ccircle cx='14' cy='19' r='1'/%3E%3C/g%3E%3Cg fill='%23e0306e' fill-opacity='.3'%3E%3Ccircle cx='42' cy='42' r='1.6'/%3E%3Ccircle cx='37' cy='42' r='1'/%3E%3Ccircle cx='47' cy='42' r='1'/%3E%3Ccircle cx='42' cy='37' r='1'/%3E%3Ccircle cx='42' cy='47' r='1'/%3E%3C/g%3E%3C/svg%3E")`

const TRI = 'polygon(0 0, 100% 0, 50% 100%)'

const CORNERS = [
  'top-1.5 left-1.5 border-t border-l',
  'top-1.5 right-1.5 border-t border-r',
  'bottom-1.5 left-1.5 border-b border-l',
  'bottom-1.5 right-1.5 border-b border-r',
]

// Marigold toran (door garland)
const TORAN_COLORS = ['#f2a33a', '#e0306e', '#e6b84a', '#0f8b8d', '#f2a33a']
const TORAN = Array.from({ length: 17 }, (_, i) => TORAN_COLORS[i % 5])

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 43 + 7) % 100}%`,
  delay: `${(i * 1.3) % 12}s`,
  duration: `${9 + (i % 7) * 2}s`,
  rotate: `${i * 31}deg`,
  size: `${8 + (i % 4) * 4}px`,
}))

const SPARKS = Array.from({ length: 30 }, (_, i) => {
  const a = (i / 30) * Math.PI * 2 + (i % 3) * 0.12
  const r = 120 + (i % 5) * 55
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r, size: 3 + (i % 3) * 2 }
})

const RING_STYLE = {
  filter:
    'drop-shadow(0 0 10px rgba(255,214,120,.85)) drop-shadow(0 0 26px rgba(242,163,58,.55))',
}

function Ring({ className, clip, z }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={`${className} pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(30vw,140px)] opacity-0`}
      style={{
        ...RING_STYLE,
        zIndex: z,
        clipPath: clip ? 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' : undefined,
      }}
    >
      <defs>
        <linearGradient id="band" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset=".35" stopColor="#e6b84a" />
          <stop offset=".7" stopColor="#b8862a" />
          <stop offset="1" stopColor="#f6dc8a" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#band)" strokeWidth="9" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff6d6" strokeOpacity=".55" strokeWidth=".8" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#7a5512" strokeOpacity=".5" strokeWidth=".8" />
      <path d="M50 3 55 9 50 15 45 9Z" fill="#fff" stroke="#e6b84a" strokeWidth=".8" />
    </svg>
  )
}

export default function EnvelopeIntro({ onReveal, onDone }) {
  const root = useRef(null)
  const ctx = useRef(null)
  const pulse = useRef(null)
  const timeline = useRef(null)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    ctx.current = gsap.context(() => {
      // Hidden starting states for the "enter heaven" sequence
      gsap.set('.ringL, .ringR', { xPercent: -50, yPercent: -50 })
      gsap.set('.flood', { clipPath: 'circle(0% at 50% 50%)' })
      gsap.set('.spark', { opacity: 0 })
      gsap.set('.shock', { opacity: 0, scale: 0.2 })
      gsap.set('.cloud', { opacity: 0 })

      gsap.from('.env', { y: 45, opacity: 0, scale: 0.9, duration: 1.4, ease: 'power3.out' })
      gsap.from('.heading', { y: -15, opacity: 0, duration: 1.2, delay: 0.3, ease: 'power2.out' })
      gsap.from('.env-hint', { opacity: 0, y: 10, duration: 0.9, delay: 1.2 })

      gsap.to('.portal-glow', {
        scale: 1.12, opacity: 0.8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
      gsap.to('.gold-ring', { rotation: 360, duration: 50, repeat: -1, ease: 'none' })
      gsap.to('.gold-ring-inner', { rotation: -360, duration: 65, repeat: -1, ease: 'none' })
      gsap.to('.light-rays', { rotation: 360, duration: 90, repeat: -1, ease: 'none' })
      gsap.to('.floating-light', {
        y: -18, opacity: 0.75, duration: 3, repeat: -1, yoyo: true, stagger: 0.25, ease: 'sine.inOut',
      })

      pulse.current = gsap.to('.seal', {
        scale: 1.08, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
    }, root)

    return () => {
      timeline.current?.kill()
      ctx.current?.revert()
      document.body.style.overflow = ''
    }
  }, [])

  const open = () => {
    if (opened) return
    setOpened(true)
    pulse.current?.kill()
    if (root.current) root.current.style.pointerEvents = 'none'

    if (!bgMusic) {
      bgMusic = new Audio('/music/wedding.mp3')
      bgMusic.loop = true
      bgMusic.volume = 0.4
    }
    bgMusic.play().catch(() => {})

    ctx.current.add(() => {
      gsap.killTweensOf([
        '.portal-glow', '.gold-ring', '.gold-ring-inner', '.light-rays', '.floating-light',
      ])

      const ringW = root.current.querySelector('.ringR').offsetWidth
      const off = window.innerWidth * 0.7
      const tl = gsap.timeline({ onComplete: () => onDone?.() })
      timeline.current = tl

      // 1. Seal cracks open
      tl.to('.env-hint', { opacity: 0, duration: 0.25 }, 0)
      tl.to('.seal', { scale: 1.3, duration: 0.15, ease: 'power2.out' }, 0)
      tl.to('.seal', { scale: 0, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.15)

      // 2. Flap lifts, card slides out, heaven starts to glow
      tl.to('.flap', { rotateX: 180, duration: 0.8, ease: 'power2.inOut' }, 0.15)
      tl.set('.flap', { zIndex: 0 }, 0.85)
      tl.to('.card', { yPercent: -26, duration: 0.9, ease: 'power2.out' }, 0.5)
      tl.to('.portal-glow', { scale: 2, opacity: 1, duration: 1.6, ease: 'power2.inOut' }, 0.3)
      tl.to('.light-rays', { scale: 1.5, opacity: 0.7, duration: 1.6, ease: 'power2.out' }, 0.3)
      tl.to('.gold-ring', { scale: 1.6, opacity: 0, duration: 1.2, ease: 'power2.in' }, 0.4)
      tl.to('.gold-ring-inner', { scale: 1.4, opacity: 0, duration: 1.2, ease: 'power2.in' }, 0.4)
      tl.to('.arch', { opacity: 0.2, duration: 1, ease: 'power1.out' }, 0.5)

      // 3. Two golden rings sweep in from either side and interlock
      tl.fromTo('.ringL', { x: -off, rotate: -200, opacity: 0, scale: 0.6 },
        { x: -ringW * 0.3, rotate: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.3)' }, 0.55)
      tl.fromTo('.ringR', { x: off, rotate: 200, opacity: 0, scale: 0.6 },
        { x: ringW * 0.3, rotate: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.3)' }, 0.55)

      // 4. The moment they join: shockwave, sparkles, ring pulse
      tl.fromTo('.shock', { opacity: 0.9, scale: 0.2 },
        { opacity: 0, scale: 5, duration: 1.1, ease: 'power2.out' }, 1.65)
      tl.fromTo('.spark', { x: 0, y: 0, opacity: 1, scale: 1 }, {
        x: (i) => SPARKS[i].dx,
        y: (i) => SPARKS[i].dy,
        opacity: 0,
        scale: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, 1.65)
      tl.to('.ringL, .ringR', { scale: 1.14, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.7)

      // 4b. Rings lift up and tilt together into the light
      tl.to('.ringL, .ringR', { y: -ringW * 0.1, duration: 0.5, ease: 'sine.inOut' }, 2.15)

      // 5. Pass through: rings grow around us, golden light floods, clouds part
      tl.to('.ringL', { x: -ringW * 0.3 - 40, scale: 9, opacity: 0, duration: 1.2, ease: 'power3.in' }, 2.3)
      tl.to('.ringR', { x: ringW * 0.3 + 40, scale: 9, opacity: 0, duration: 1.2, ease: 'power3.in' }, 2.3)
      tl.to('.env', { scale: 1.9, opacity: 0, duration: 1, ease: 'power2.in' }, 2.3)
      tl.to('.flood', { clipPath: 'circle(150% at 50% 50%)', duration: 1.1, ease: 'power2.in' }, 2.4)
      tl.fromTo('.cloud', { opacity: 0, x: 0 }, {
        opacity: 0.9,
        x: (i) => (i % 2 ? 1 : -1) * window.innerWidth * 0.55,
        duration: 1.3,
        ease: 'power2.out',
        stagger: 0.06,
      }, 3.0)

      // 6. Reveal the actual invitation underneath, then lift the veil
      tl.call(() => onReveal?.(), null, 3.4)
      tl.to(root.current, { opacity: 0, duration: 0.9, ease: 'power1.inOut' }, 3.7)
    })
  }

  return (
    <div
      ref={root}
      className="ambient fixed inset-0 z-50 grid touch-none place-items-center overflow-hidden bg-[#17040b]"
    >
      {/* Base: Marwari maroon fading to ruby and rani pink */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#9b1237_0%,#650d28_32%,#33071a_65%,#14030a_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,163,58,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(224,48,110,0.38),transparent_60%)]" />

      {/* Bandhani dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ backgroundImage: BANDHANI }}
      />

      {/* Heavenly glow + rays */}
      <div className="portal-glow absolute left-1/2 top-1/2 h-[min(90vw,750px)] w-[min(90vw,750px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,224,157,0.5)_0%,rgba(242,163,58,0.18)_30%,rgba(224,48,110,0.1)_55%,transparent_75%)] blur-2xl" />

      <div className="light-rays pointer-events-none absolute left-1/2 top-1/2 h-[130vmax] w-[130vmax] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,225,160,0.12)_15deg,transparent_35deg,rgba(255,235,180,0.16)_60deg,transparent_90deg,rgba(255,225,160,0.09)_120deg,transparent_180deg,rgba(255,235,180,0.13)_240deg,transparent_300deg)]" />
      </div>

      {/* Rotating rings: gold, saffron, peacock */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(80vw,600px)] w-[min(80vw,600px)] -translate-x-1/2 -translate-y-1/2">
        <div className="gold-ring absolute inset-0 rounded-full border border-[#e6b84a]/35 shadow-[0_0_40px_rgba(230,184,74,0.15)]" />
        <div className="gold-ring-inner absolute inset-[8%] rounded-full border border-dashed border-[#0f8b8d]/50" />
        <div className="absolute inset-[16%] rounded-full border border-dashed border-[#f2a33a]/30" />
        <div className="absolute inset-[23%] rounded-full border border-[#e0306e]/20" />
      </div>

      {/* Rajput cusped arch (jharokha) behind the envelope */}
      <svg
        aria-hidden
        viewBox="0 0 200 240"
        className="arch pointer-events-none absolute left-1/2 top-[48%] h-[78vh] -translate-x-1/2 -translate-y-1/2 opacity-60"
        fill="none"
      >
        <path
          d="M12 236V120C12 92 30 78 46 70C64 61 76 48 84 32C90 20 96 12 100 4C104 12 110 20 116 32C124 48 136 61 154 70C170 78 188 92 188 120V236"
          stroke="#e6b84a"
          strokeOpacity=".7"
          strokeWidth="1.2"
        />
        <path
          d="M22 236V122C22 98 38 86 52 79C72 69 84 55 92 40C96 32 99 27 100 22C101 27 104 32 108 40C116 55 128 69 148 79C162 86 178 98 178 122V236"
          stroke="#0f8b8d"
          strokeOpacity=".8"
          strokeWidth=".8"
          strokeDasharray="2 3"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      {/* Gold dust */}
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={`light-${i}`}
          className="floating-light absolute rounded-full bg-[#ffe8a5] blur-[1px]"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 61) % 100}%`,
            width: `${2 + (i % 4) * 2}px`,
            height: `${2 + (i % 4) * 2}px`,
            opacity: 0.4,
          }}
        />
      ))}

      {/* Rose petals */}
      {PETALS.map((p, i) => (
        <span
          key={`petal-${i}`}
          className="petal pointer-events-none absolute"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: `${Number.parseInt(p.size) * 1.5}px`,
            '--petal-rotation': p.rotate,
          }}
        />
      ))}

      {/* Borders */}
      <div className="pointer-events-none absolute inset-3 border border-[#e6b84a]/55 sm:inset-6" />
      <div className="pointer-events-none absolute inset-5 border border-[#0f8b8d]/40 sm:inset-8" />

      {/* Marigold toran */}
      <div className="pointer-events-none absolute inset-x-4 top-3 z-[9] flex justify-between sm:inset-x-8 sm:top-6">
        {TORAN.map((c, i) => (
          <span
            key={i}
            className="toran-item flex flex-col items-center"
            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
          >
            <i className="block w-px bg-[#e6b84a]/70" style={{ height: 8 + (i % 2) * 10 }} />
            <i
              className="block h-3 w-3 rounded-full sm:h-3.5 sm:w-3.5"
              style={{ background: c, boxShadow: `0 0 8px ${c}` }}
            />
          </span>
        ))}
      </div>

      {/* Heading */}
      <div className="heading absolute top-[10%] z-10 text-center">
        <p className="font-display text-sm text-[#f6dfaa] sm:text-base">॥ श्री गणेशाय नमः ॥</p>
        <p className="mt-2 font-display text-[0.65rem] tracking-[0.5em] text-[#f6dfaa] uppercase sm:text-sm">
          ✦ A Celebration of Love ✦
        </p>
        <p className="mt-2 font-display text-xs italic tracking-[0.25em] text-[#f2a33a]/90 sm:text-sm">
          Wedding Invitation
        </p>
      </div>

      {/* Envelope */}
      <button
        type="button"
        onClick={open}
        disabled={opened}
        aria-label="Open invitation"
        className="env relative z-[5] mt-20 block aspect-[4/3] w-[min(86vw,28rem)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#f6dfaa] disabled:cursor-default"
        style={{ perspective: 1400 }}
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(145deg,#4a0a18,#1e040c)] shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_70px_rgba(242,163,58,0.18)]" />

        {/* Card */}
        <div className="card absolute top-[6%] left-[6%] z-[1] grid h-[84%] w-[88%] place-items-center bg-[#fbf1dc] shadow-[0_12px_40px_rgba(0,0,0,0.5)] ring-1 ring-[#e6b84a]/80">
          <div className="relative grid h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)] place-items-center border border-[#b8862a]/70 px-3">
            {CORNERS.map((c) => (
              <span key={c} className={`absolute h-3 w-3 border-[#0f8b8d] ${c}`} />
            ))}
            <div>
              <p className="text-[0.6rem] tracking-[0.3em] text-[#7a5a1a] uppercase sm:text-xs">
                Together with our families
              </p>
              <p className="my-2 font-display text-[clamp(1.1rem,6vw,1.7rem)] leading-tight text-[#7a0f2c]">
                {invite.groom} <span className="text-[#0f8b8d]">&amp;</span> {invite.bride}
              </p>
              <p className="text-[0.6rem] tracking-[0.3em] text-[#7a5a1a] uppercase sm:text-xs">
                invite you to celebrate
              </p>
            </div>
          </div>
        </div>

        {/* Pocket */}
        <div
          className="absolute inset-0 z-[2] bg-[linear-gradient(145deg,#c2185b_0%,#8a1236_45%,#4a0a18_100%)] shadow-[inset_0_0_35px_rgba(0,0,0,0.25)]"
          style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,220,140,0.1)_50%,transparent_80%)]" />
          <div className="absolute inset-x-[6%] bottom-[5%] h-px bg-[#0f8b8d]/70" />
          <p className="absolute inset-x-0 bottom-[10%] text-center text-[0.65rem] tracking-[0.4em] text-[#f6dfaa] uppercase sm:text-xs">
            Padharo Sa
          </p>
        </div>

        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        >
          <polygon
            points="0,0 50,55 100,0 100,100 0,100"
            fill="none"
            stroke="#e6b84a"
            strokeOpacity="0.9"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Flap */}
        <div className="flap preserve-3d absolute top-0 left-0 z-[3] h-[55%] w-full origin-top">
          <div className="backface-hidden absolute inset-0">
            <div
              className="absolute inset-0 bg-[linear-gradient(145deg,#e0306e,#a3153f,#6a0d27)]"
              style={{ clipPath: TRI }}
            />
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <polygon
                points="0,0 100,0 50,100"
                fill="none"
                stroke="#f2cf72"
                strokeOpacity="0.95"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div
            className="backface-hidden absolute inset-0"
            style={{ transform: 'rotateX(180deg)' }}
          >
            <div
              className="absolute inset-0 bg-[linear-gradient(#4a0a18,#2b0611)]"
              style={{ clipPath: TRI }}
            />
          </div>
        </div>

        {/* Seal with peacock rim */}
        <div className="seal absolute top-[55%] left-1/2 z-[4] -mt-8 -ml-8 grid h-16 w-16 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#fff1bd,#e6c458_35%,#bd9129_65%,#785513)] shadow-[0_0_25px_rgba(255,215,100,0.4),0_8px_20px_rgba(0,0,0,0.6)] ring-2 ring-[#0f8b8d]/90 sm:-mt-10 sm:-ml-10 sm:h-20 sm:w-20">
          <span className="grid h-[78%] w-[78%] place-items-center rounded-full border border-[#4a0a18]/50 font-display text-sm text-[#4a0a18] sm:text-base">
            {invite.groom[0]}&amp;{invite.bride[0]}
          </span>
        </div>
      </button>

      {/* Interlocking rings (right ring sits above left; the clipped copy of left
          covers the top crossing so they weave like real linked rings) */}
      <Ring className="ringL" z={6} />
      <Ring className="ringR" z={7} />
      <Ring className="ringL" z={8} clip />

      {/* Shockwave + sparkles at the moment the rings join */}
      <span className="shock pointer-events-none absolute left-1/2 top-1/2 z-[8] -ml-24 -mt-24 h-48 w-48 rounded-full border-2 border-[#ffe8a5] shadow-[0_0_40px_rgba(255,224,157,0.8)]" />
      {SPARKS.map((s, i) => (
        <span
          key={`spark-${i}`}
          className="spark pointer-events-none absolute left-1/2 top-1/2 z-[8] rounded-full bg-[#fff3c4]"
          style={{
            width: s.size,
            height: s.size,
            marginLeft: -s.size / 2,
            marginTop: -s.size / 2,
            boxShadow: '0 0 10px 2px rgba(255,214,120,.9)',
          }}
        />
      ))}

      {/* Heaven: golden-white light floods the screen, clouds part */}
      <div className="flood pointer-events-none absolute inset-0 z-[10] bg-[radial-gradient(circle_at_center,#fffaf0_0%,#ffeeb8_30%,#f6c76a_62%,#d99432_100%)]" />
      {[0, 1, 2, 3].map((i) => (
        <span
          key={`cloud-${i}`}
          className="cloud pointer-events-none absolute left-1/2 z-[11] -ml-[30vw] h-[28vh] w-[60vw] rounded-full bg-[#fffdf5] blur-3xl"
          style={{ top: `${18 + i * 18}%` }}
        />
      ))}

      <p className="env-hint absolute bottom-[9%] z-10 text-xs tracking-[0.4em] text-[#f6dfaa] uppercase">
        <span className="animate-pulse">✦ Tap to open ✦</span>
      </p>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; -webkit-transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }

        .toran-item { transform-origin: top center; animation: toranSway 3.2s ease-in-out infinite; }
        @keyframes toranSway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .petal {
          top: -10%;
          border-radius: 100% 0 100% 0;
          background: linear-gradient(135deg, rgba(255,225,190,0.85), rgba(224,48,110,0.6));
          opacity: 0;
          animation: fallingPetal linear infinite;
          will-change: transform, opacity;
        }
        @keyframes fallingPetal {
          0% { transform: translate3d(0,-10vh,0) rotate(var(--petal-rotation)); opacity: 0; }
          10% { opacity: 0.6; }
          85% { opacity: 0.4; }
          100% { transform: translate3d(80px,110vh,0) rotate(calc(var(--petal-rotation) + 720deg)); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .petal { display: none; animation: none; }
          .toran-item { animation: none; }
        }
      `}</style>
    </div>
  )
}