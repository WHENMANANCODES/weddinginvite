import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { invite } from '../data/invite'

let bgMusic = null

const LATTICE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M32 4 60 32 32 60 4 32Z' fill='none' stroke='%23d4af37' stroke-opacity='.16'/%3E%3Ccircle cx='32' cy='32' r='2' fill='%23d4af37' fill-opacity='.22'/%3E%3C/svg%3E")`

const TRI = 'polygon(0 0, 100% 0, 50% 100%)'

const CORNERS = [
  'top-1.5 left-1.5 border-t border-l',
  'top-1.5 right-1.5 border-t border-r',
  'bottom-1.5 left-1.5 border-b border-l',
  'bottom-1.5 right-1.5 border-b border-r',
]

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 43 + 7) % 100}%`,
  delay: `${(i * 1.3) % 12}s`,
  duration: `${9 + (i % 7) * 2}s`,
  rotate: `${i * 31}deg`,
  size: `${8 + (i % 4) * 4}px`,
}))

export default function EnvelopeIntro({ onReveal, onDone }) {
  const root = useRef(null)
  const ctx = useRef(null)
  const pulse = useRef(null)
  const timeline = useRef(null)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    ctx.current = gsap.context(() => {
      // Envelope entrance
      gsap.from('.env', {
        y: 45,
        opacity: 0,
        scale: 0.9,
        duration: 1.4,
        ease: 'power3.out',
      })

      // Heading entrance
      gsap.from('.heading', {
        y: -15,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power2.out',
      })

      // Hint entrance
      gsap.from('.env-hint', {
        opacity: 0,
        y: 10,
        duration: 0.9,
        delay: 1.2,
      })

      // Background portal breathing animation
      gsap.to('.portal-glow', {
        scale: 1.12,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Rotating decorative rings
      gsap.to('.gold-ring', {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.gold-ring-inner', {
        rotation: -360,
        duration: 65,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.light-rays', {
        rotation: 360,
        duration: 90,
        repeat: -1,
        ease: 'none',
      })

      // Floating light animation
      gsap.to('.floating-light', {
        y: -18,
        opacity: 0.75,
        duration: 3,
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
        ease: 'sine.inOut',
      })

      // Wax seal pulse
      pulse.current = gsap.to('.seal', {
        scale: 1.08,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
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

    // Disable further interaction
    if (root.current) {
      root.current.style.pointerEvents = 'none'
    }

    // Start wedding music on user interaction
    if (!bgMusic) {
      bgMusic = new Audio('/music/wedding.mp3')
      bgMusic.loop = true
      bgMusic.volume = 0.4
    }

    bgMusic.play().catch(() => {})

    ctx.current.add(() => {
      // Stop all infinite background animations
      // to prevent conflicts with opening animation.
      gsap.killTweensOf([
        '.portal-glow',
        '.gold-ring',
        '.gold-ring-inner',
        '.light-rays',
        '.floating-light',
      ])

      const tl = gsap.timeline({
        onComplete: () => {
          onDone?.()
        },
      })

      timeline.current = tl

      // 1. Hide instruction
      tl.to('.env-hint', {
        opacity: 0,
        duration: 0.25,
        ease: 'power1.out',
      }, 0)

      // 2. Wax seal animation
      tl.to('.seal', {
        scale: 1.3,
        duration: 0.2,
        ease: 'power2.out',
      }, 0)

      tl.to('.seal', {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 0.2)

      // 3. Heavenly portal expands
      tl.to('.portal-glow', {
        scale: 2.2,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
      }, 0.3)

      tl.to('.light-rays', {
        scale: 1.5,
        opacity: 0.65,
        duration: 1.4,
        ease: 'power2.out',
      }, 0.35)

      // 4. Decorative rings fade away
      tl.to('.gold-ring', {
        scale: 1.8,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.in',
      }, 0.45)

      tl.to('.gold-ring-inner', {
        scale: 1.5,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.in',
      }, 0.45)

      // 5. Envelope flap opens ONCE
      tl.to('.flap', {
        rotateX: 180,
        duration: 0.85,
        ease: 'power2.inOut',
      }, 0.45)

      // Put the opened flap behind the card
      tl.set('.flap', {
        zIndex: 0,
      }, 1.32)

      // 6. Card comes out and zooms in
      // One tween only — prevents reverse movement/flicker
      tl.to('.card', {
        yPercent: -90,
        scale: 2.2,
        duration: 1.35,
        ease: 'power3.in',
        transformOrigin: '50% 50%',
      }, 1.2)

      // 7. Trigger the actual invitation reveal
      tl.call(() => {
        onReveal?.()
      }, null, 2.1)

      // 8. Final cinematic fade
      tl.to(root.current, {
        opacity: 0,
        duration: 0.65,
        ease: 'power1.inOut',
      }, 2.5)
    })
  }

  return (
    <div
      ref={root}
      className="ambient fixed inset-0 z-50 grid touch-none place-items-center overflow-hidden bg-[#17040b]"
    >
      {/* Main background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#8b2443_0%,#541226_32%,#270713_65%,#100208_100%)]" />

      {/* Top golden atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,150,0.16),transparent_50%)]" />

      {/* Bottom rose atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(160,30,80,0.35),transparent_60%)]" />

      {/* Central heavenly glow */}
      <div className="portal-glow absolute left-1/2 top-1/2 h-[min(90vw,750px)] w-[min(90vw,750px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,224,157,0.45)_0%,rgba(255,190,105,0.16)_30%,rgba(180,55,100,0.08)_55%,transparent_75%)] blur-2xl" />

      {/* Light rays */}
      <div className="light-rays pointer-events-none absolute left-1/2 top-1/2 h-[130vmax] w-[130vmax] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,225,160,0.1)_15deg,transparent_35deg,rgba(255,235,180,0.15)_60deg,transparent_90deg,rgba(255,225,160,0.08)_120deg,transparent_180deg,rgba(255,235,180,0.12)_240deg,transparent_300deg)]" />
      </div>

      {/* Outer ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(80vw,600px)] w-[min(80vw,600px)] -translate-x-1/2 -translate-y-1/2">
        <div className="gold-ring absolute inset-0 rounded-full border border-[#e9c66b]/30 shadow-[0_0_40px_rgba(212,175,55,0.12)]" />

        <div className="gold-ring-inner absolute inset-[8%] rounded-full border border-[#f7d98a]/20" />

        <div className="absolute inset-[16%] rounded-full border border-dashed border-[#f7d98a]/20" />

        <div className="absolute inset-[23%] rounded-full border border-[#d4af37]/10" />
      </div>

      {/* Background lattice */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ backgroundImage: LATTICE }}
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      {/* Floating golden particles */}
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

      {/* Falling rose petals */}
      {PETALS.map((petal, i) => (
        <span
          key={`petal-${i}`}
          className="petal absolute pointer-events-none"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: `${Number.parseInt(petal.size) * 1.5}px`,
            '--petal-rotation': petal.rotate,
          }}
        />
      ))}

      {/* Decorative borders */}
      <div className="pointer-events-none absolute inset-3 border border-[#d4af37]/55 sm:inset-6" />
      <div className="pointer-events-none absolute inset-5 border border-[#d4af37]/20 sm:inset-8" />

      {/* Heading */}
      <div className="heading absolute top-[8%] z-10 text-center">
        <p className="font-display text-[0.65rem] tracking-[0.5em] text-[#f6dfaa] uppercase sm:text-sm">
          ✦ A Celebration of Love ✦
        </p>

        <p className="mt-3 font-display text-xs italic tracking-[0.25em] text-[#e9c66b]/80 sm:text-sm">
          Wedding Invitation
        </p>
      </div>

      {/* Envelope button */}
      <button
        type="button"
        onClick={open}
        disabled={opened}
        aria-label="Open invitation"
        className="env relative mt-16 block aspect-[4/3] w-[min(86vw,28rem)] cursor-pointer outline-none disabled:cursor-default"
        style={{ perspective: 1400 }}
      >
        {/* Inside envelope */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(145deg,#4a0c1b,#21050d)] shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_70px_rgba(212,175,55,0.12)]" />

        {/* Invitation card */}
        <div className="card absolute top-[6%] left-[6%] z-[1] grid h-[84%] w-[88%] place-items-center bg-[#fbf4e4] shadow-[0_12px_40px_rgba(0,0,0,0.5)] ring-1 ring-[#d4af37]/70">
          <div className="relative grid h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)] place-items-center border border-[#d4af37]/70 px-3">
            {CORNERS.map((c) => (
              <span
                key={c}
                className={`absolute h-3 w-3 border-[#b8893a] ${c}`}
              />
            ))}

            <div>
              <p className="text-[0.6rem] tracking-[0.3em] text-[#7a5a1a] uppercase sm:text-xs">
                Together with our families
              </p>

              <p className="my-2 font-display text-[clamp(1.1rem,6vw,1.7rem)] leading-tight text-[#5a0f21]">
                {invite.groom}{' '}
                <span className="text-[#b8893a]">&amp;</span>{' '}
                {invite.bride}
              </p>

              <p className="text-[0.6rem] tracking-[0.3em] text-[#7a5a1a] uppercase sm:text-xs">
                invite you to celebrate
              </p>
            </div>
          </div>
        </div>

        {/* Front envelope pocket */}
        <div
          className="absolute inset-0 z-[2] bg-[linear-gradient(145deg,#a52b4d_0%,#75162f_45%,#4a0c1b_100%)] shadow-[inset_0_0_35px_rgba(0,0,0,0.25)]"
          style={{
            clipPath:
              'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,220,140,0.08)_50%,transparent_80%)]" />

          <p className="absolute inset-x-0 bottom-[10%] text-center text-[0.65rem] tracking-[0.4em] text-[#f6dfaa] uppercase sm:text-xs">
            You are invited
          </p>
        </div>

        {/* Envelope outline */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        >
          <polygon
            points="0,0 50,55 100,0 100,100 0,100"
            fill="none"
            stroke="#e5c46d"
            strokeOpacity="0.85"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Envelope flap */}
        <div className="flap preserve-3d absolute top-0 left-0 z-[3] h-[55%] w-full origin-top">
          {/* Flap front */}
          <div className="backface-hidden absolute inset-0">
            <div
              className="absolute inset-0 bg-[linear-gradient(145deg,#b43558,#84203d,#591125)]"
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
                stroke="#e8cb79"
                strokeOpacity="0.9"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Flap reverse side */}
          <div
            className="backface-hidden absolute inset-0"
            style={{ transform: 'rotateX(180deg)' }}
          >
            <div
              className="absolute inset-0 bg-[linear-gradient(#4a0c1b,#2b0611)]"
              style={{ clipPath: TRI }}
            />
          </div>
        </div>

        {/* Wax seal */}
        <div className="seal absolute top-[55%] left-1/2 z-[4] -mt-8 -ml-8 grid h-16 w-16 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#fff1bd,#e6c458_35%,#bd9129_65%,#785513)] shadow-[0_0_25px_rgba(255,215,100,0.35),0_8px_20px_rgba(0,0,0,0.6)] ring-2 ring-[#f3dc8f]/70 sm:-mt-10 sm:-ml-10 sm:h-20 sm:w-20">
          <span className="grid h-[78%] w-[78%] place-items-center rounded-full border border-[#4a0c1b]/50 font-display text-sm text-[#4a0c1b] sm:text-base">
            {invite.groom[0]}&amp;{invite.bride[0]}
          </span>
        </div>
      </button>

      {/* Tap hint */}
      <p className="env-hint absolute bottom-[9%] z-10 text-xs tracking-[0.4em] text-[#f6dfaa] uppercase">
        <span className="animate-pulse">
          ✦ Tap to open ✦
        </span>
      </p>

      {/* CSS */}
      <style>{`
        .preserve-3d {
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .petal {
          position: absolute;
          top: -10%;
          border-radius: 100% 0 100% 0;
          background: linear-gradient(
            135deg,
            rgba(255,225,190,0.8),
            rgba(190,80,110,0.6)
          );
          box-shadow: 0 0 10px rgba(255,210,170,0.1);
          opacity: 0;
          animation: fallingPetal linear infinite;
          will-change: transform, opacity;
        }

        @keyframes fallingPetal {
          0% {
            transform: translate3d(0,-10vh,0) rotate(var(--petal-rotation));
            opacity: 0;
          }

          10% {
            opacity: 0.6;
          }

          85% {
            opacity: 0.4;
          }

          100% {
            transform: translate3d(80px,110vh,0) rotate(calc(var(--petal-rotation) + 720deg));
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .petal {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  )
}