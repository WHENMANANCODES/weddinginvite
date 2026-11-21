import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { invite } from '../data/invite'

const LATTICE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M32 4 60 32 32 60 4 32Z' fill='none' stroke='%23d4af37' stroke-opacity='.14'/%3E%3Ccircle cx='32' cy='32' r='2' fill='%23d4af37' fill-opacity='.18'/%3E%3C/svg%3E")`

const TRI = 'polygon(0 0, 100% 0, 50% 100%)'

const CORNERS = [
  'top-1.5 left-1.5 border-t border-l',
  'top-1.5 right-1.5 border-t border-r',
  'bottom-1.5 left-1.5 border-b border-l',
  'bottom-1.5 right-1.5 border-b border-r',
]

export default function EnvelopeIntro({ onReveal, onDone }) {
  const root = useRef(null)
  const ctx = useRef(null)
  const pulse = useRef(null)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    ctx.current = gsap.context(() => {
      gsap.from('.env', { y: 40, opacity: 0, scale: 0.92, duration: 1.2, ease: 'power3.out' })
      gsap.from('.env-hint', { opacity: 0, duration: 1, delay: 1.2 })
      pulse.current = gsap.to('.seal', { scale: 1.08, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }, root)
    return () => {
      ctx.current.revert()
      document.body.style.overflow = ''
    }
  }, [])

  const open = () => {
    if (opened) return
    setOpened(true)
    pulse.current?.kill()

    ctx.current.add(() => {
      const tl = gsap.timeline({ onComplete: onDone })
      tl.to('.env-hint', { opacity: 0, duration: 0.3 }, 0)
        .to('.seal', { scale: 1.25, duration: 0.2, ease: 'power2.out' }, 0)
        .to('.seal', { scale: 0, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.2)
        .to('.flap', { rotateX: 180, duration: 1, ease: 'power2.inOut' }, 0.45)
        .set('.flap', { zIndex: 0 }, 0.95)
        .to('.card', { yPercent: -62, duration: 0.9, ease: 'power3.out' }, 1.15)
        .call(() => onReveal?.(), null, 2.1)
        .to('.card', { scale: 2.6, yPercent: -30, duration: 0.9, ease: 'power3.in' }, 2.05)
        .to(root.current, { opacity: 0, duration: 0.7, ease: 'power1.inOut' }, 2.3)
    })
  }

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 grid touch-none place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#6e1528_0%,#3f0a17_55%,#1c040a_100%)]"
    >
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: LATTICE }} />
      <div className="pointer-events-none absolute inset-3 border border-[#d4af37]/60 sm:inset-6" />
      <div className="pointer-events-none absolute inset-5 border border-[#d4af37]/25 sm:inset-8" />

      <p className="absolute top-[8%] text-center font-display text-[0.7rem] tracking-[0.45em] text-[#e8cd8a] uppercase sm:text-sm">
        ✦ Wedding Invitation ✦
      </p>

      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="sparkle absolute rounded-full bg-[#f0d48a]"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 61) % 100}%`,
            width: 2 + (i % 3) * 2,
            height: 2 + (i % 3) * 2,
            '--d': `${3 + (i % 4)}s`,
            '--delay': `${(i % 5) * 0.7}s`,
          }}
        />
      ))}

      <button
        type="button"
        onClick={open}
        aria-label="Open invitation"
        className="env relative mt-16 block aspect-[4/3] w-[min(86vw,28rem)] cursor-pointer"
        style={{ perspective: 1400 }}
      >
        {/* inside of envelope */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(#4a0c1b,#2a0610)] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)]" />

        {/* card */}
        <div className="card absolute top-[6%] left-[6%] z-[1] grid h-[84%] w-[88%] place-items-center bg-[#fbf4e4] shadow-[0_8px_24px_rgba(0,0,0,0.4)] ring-1 ring-[#d4af37]/60">
          <div className="relative grid h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)] place-items-center border border-[#d4af37]/70 px-3">
            {CORNERS.map((c) => (
              <span key={c} className={`absolute h-3 w-3 border-[#b8893a] ${c}`} />
            ))}
            <div>
              <p className="text-[0.6rem] tracking-[0.3em] text-[#7a5a1a] uppercase sm:text-xs">
                Together with our families
              </p>
              <p className="my-2 font-display text-[clamp(1.1rem,6vw,1.7rem)] leading-tight text-[#5a0f21]">
                {invite.groom} <span className="text-[#b8893a]">&amp;</span> {invite.bride}
              </p>
              <p className="text-[0.6rem] tracking-[0.3em] text-[#7a5a1a] uppercase sm:text-xs">
                invite you to celebrate
              </p>
            </div>
          </div>
        </div>

        {/* front pocket */}
        <div
          className="absolute inset-0 z-[2] bg-[linear-gradient(160deg,#86203a,#5a0f21)]"
          style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="absolute inset-x-0 bottom-[10%] text-center text-[0.65rem] tracking-[0.4em] text-[#e8cd8a] uppercase sm:text-xs">
            You are invited
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
            stroke="#d4af37"
            strokeOpacity="0.75"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* flap */}
        <div className="flap preserve-3d absolute top-0 left-0 z-[3] h-[55%] w-full origin-top">
          <div className="backface-hidden absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(#92223d,#641227)]" style={{ clipPath: TRI }} />
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <polygon
                points="0,0 100,0 50,100"
                fill="none"
                stroke="#d4af37"
                strokeOpacity="0.85"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="backface-hidden absolute inset-0" style={{ transform: 'rotateX(180deg)' }}>
            <div className="absolute inset-0 bg-[#3a0914]" style={{ clipPath: TRI }} />
          </div>
        </div>

        {/* gold seal */}
        <div className="seal absolute top-[55%] left-1/2 z-[4] -mt-8 -ml-8 grid h-16 w-16 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbe7a1,#d4af37_55%,#8c6a14)] shadow-[0_6px_14px_rgba(0,0,0,0.55)] ring-2 ring-[#f3dc8f]/70 sm:-mt-10 sm:-ml-10 sm:h-20 sm:w-20">
          <span className="grid h-[78%] w-[78%] place-items-center rounded-full border border-[#4a0c1b]/50 font-display text-sm text-[#4a0c1b] sm:text-base">
            {invite.groom[0]}&amp;{invite.bride[0]}
          </span>
        </div>
      </button>

      <p className="env-hint absolute bottom-[9%] text-xs tracking-[0.4em] text-[#e8cd8a] uppercase">
        <span className="animate-pulse">Tap to open</span>
      </p>
    </div>
  )
}