
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { invite } from '../data/invite'

// Couple logo
const logoFiles = import.meta.glob('../assets/jc-logo.png', {
  eager: true,
  import: 'default',
})

const LOGO = Object.values(logoFiles)[0]

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ================= ELEGANT LANTERN =================

function Lantern({ d, onDone }) {
  const el = useRef(null)
  const done = useRef(onDone)

  done.current = onDone

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(el.current, {
        xPercent: -50,
        opacity: 0,
        scale: 0.5,
        y: 0,
      })

      if (reduceMotion()) {
        gsap.timeline({
          onComplete: () => done.current(),
        })
          .to(el.current, {
            opacity: 1,
            scale: 1,
            y: -90,
            duration: 1.2,
            ease: 'power2.out',
          })
          .to(el.current, {
            opacity: 0,
            duration: 1.6,
          })

        return
      }

      const duration = d.dur
      const rise = window.innerHeight + 300

      const tl = gsap.timeline({
        onComplete: () => done.current(),
      })

      // Gentle entrance
      tl.to(el.current, {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power2.out',
      }, 0)

      // Floating upward
      tl.to(el.current, {
        y: -rise,
        duration,
        ease: 'power1.in',
      }, 0.2)

      // Natural breeze
      tl.to(el.current, {
        x: `+=${d.sway}`,
        duration: duration / 3,
        repeat: 3,
        yoyo: true,
        ease: 'sine.inOut',
      }, 0.2)

      // Gradually become distant
      tl.to(el.current, {
        scale: 0.42,
        duration: duration - 1.2,
        ease: 'none',
      }, 1.2)

      // Fade into the sky
      tl.to(el.current, {
        opacity: 0,
        duration: 2.2,
        ease: 'power1.in',
      }, duration - 2)

      // Gentle tilt
      gsap.fromTo(
        el.current,
        { rotation: -d.tilt },
        {
          rotation: d.tilt,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }
      )
    }, el)

    return () => ctx.revert()
  }, [d])

  const w = d.size
  const h = w * 1.28

  return (
    <div
      ref={el}
      aria-hidden="true"
      className="absolute"
      style={{
        left: d.x,
        bottom: 84,
        width: w,
        height: h + 12,
      }}
    >
      {/* Soft ambient champagne glow */}
      <div
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: w * 2.5,
          height: w * 2.5,
          background:
            'radial-gradient(circle, rgba(255,219,165,.24) 0%, rgba(255,204,135,.12) 38%, transparent 72%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Main ivory lantern body */}
      <div
        className="relative overflow-hidden"
        style={{
          width: w,
          height: h,
          borderRadius: '35% 35% 23% 23% / 18% 18% 12% 12%',
          background:
            'linear-gradient(90deg, #d9c6a8 0%, #f5ead5 10%, #fff9ed 28%, #fffdf5 50%, #f8ecd7 76%, #d9c5a5 100%)',
          boxShadow: `
            0 0 28px rgba(255,218,165,.32),
            0 0 65px rgba(255,202,135,.16),
            inset 7px 0 12px rgba(131,91,52,.08),
            inset -7px 0 12px rgba(131,91,52,.08),
            inset 0 -14px 20px rgba(183,139,85,.12)
          `,
        }}
      >
        {/* Translucent paper texture */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 65%, rgba(255,211,150,.52), transparent 65%)',
          }}
        />

        {/* Soft vertical paper folds */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(159,122,81,.10) 12%, transparent 19%, rgba(255,255,255,.55) 29%, transparent 38%, rgba(169,130,87,.10) 50%, transparent 61%, rgba(255,255,255,.45) 72%, transparent 82%, rgba(155,117,78,.10) 94%, transparent 100%)',
          }}
        />

        {/* Top elegant rim */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: '72%',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(168,132,91,.45)',
            boxShadow: '0 2px 5px rgba(116,82,48,.12)',
          }}
        />

        {/* Bottom paper rim */}
        <div
          className="absolute bottom-[2%] left-1/2 -translate-x-1/2"
          style={{
            width: '75%',
            height: '5px',
            borderRadius: '50%',
            border: '1px solid rgba(172,133,89,.4)',
            background: 'rgba(255,248,232,.7)',
          }}
        />

        {/* Inner warm light */}
        <div
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '70%',
            height: '65%',
            background:
              'radial-gradient(ellipse, rgba(255,222,165,.38), transparent 72%)',
            filter: 'blur(9px)',
          }}
        />

        {/* Wedding monogram */}
        <div
          className="absolute left-1/2 top-[46%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{
            width: '58%',
            height: '28%',
            opacity: 0.88,
          }}
        >
          {LOGO ? (
            <img
              src={LOGO}
              alt=""
              className="max-h-full max-w-full object-contain"
              style={{
                filter: 'sepia(.35) saturate(.65)',
                mixBlendMode: 'multiply',
              }}
            />
          ) : (
            <span
              className="font-display"
              style={{
                color: '#986c4e',
                fontSize: w * 0.28,
                letterSpacing: '-0.08em',
              }}
            >
              {invite.groom?.[0]}
              <span style={{ fontSize: '0.7em', margin: '0 2px' }}>&</span>
              {invite.bride?.[0]}
            </span>
          )}
        </div>

        {/* Delicate decorative line */}
        <div
          className="absolute left-1/2 top-[65%] -translate-x-1/2"
          style={{
            width: '22%',
            height: '1px',
            background: 'rgba(169,125,80,.5)',
          }}
        />
      </div>

      {/* Minimal glowing base */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 0,
          width: w * 0.42,
          height: 5,
          borderRadius: '50%',
          background: 'rgba(205,161,106,.7)',
          boxShadow: '0 0 12px 4px rgba(255,205,144,.38)',
        }}
      />

      {/* Subtle warm internal light */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: 3,
          width: w * 0.16,
          height: w * 0.13,
          background:
            'radial-gradient(circle, #fff9e9 0%, #ffe3b7 55%, #e9b77d 100%)',
          boxShadow: '0 0 14px 5px rgba(255,214,163,.5)',
        }}
      />
    </div>
  )
}

// ================= WISH LANTERNS =================

export default function WishLanterns() {
  const [lanterns, setLanterns] = useState([])

  const btn = useRef(null)
  const uid = useRef(0)

  // Exactly one lantern per click
  const release = () => {
    const jitter = Math.min(window.innerWidth * 0.08, 25)

    const newLantern = {
      id: ++uid.current,
      x:
        window.innerWidth / 2 +
        (Math.random() - 0.5) * jitter * 2,
      size: 82,
      dur: 12,
      sway: Math.random() > 0.5 ? 35 : -35,
      tilt: 4,
    }

    setLanterns((previous) => [...previous, newLantern])

    if (btn.current && !reduceMotion()) {
      gsap.fromTo(
        btn.current,
        { scale: 0.94 },
        {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(3)',
        }
      )
    }
  }

  // Remove only the completed lantern
  const removeLantern = (id) => {
    setLanterns((previous) =>
      previous.filter((lantern) => lantern.id !== id)
    )
  }

  return (
    <>
      {/* Floating lanterns */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      >
        {lanterns.map((d) => (
          <Lantern
            key={d.id}
            d={d}
            onDone={() => removeLantern(d.id)}
          />
        ))}
      </div>

      {/* Wish button */}
      <div
        className="pointer-events-none fixed inset-x-0 z-[70] flex justify-center"
        style={{
          bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        }}
      >
        <button
          ref={btn}
          type="button"
          onClick={release}
          className="
            pointer-events-auto
            flex min-h-12 items-center gap-3
            rounded-full
            border border-[#B99A78]/50
            bg-[#FFFAF1]/95
            px-5 py-2.5
            shadow-[0_8px_28px_rgba(64,45,30,0.16)]
            backdrop-blur-md
            transition-all duration-300
            hover:border-[#A7835E]
            hover:scale-105
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#A7835E]
          "
        >
          {/* Minimal lantern icon */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 30"
            className="h-6 w-5"
          >
            <path
              d="M12 2.5C7 2.5 4 8 4 14c0 6 3 9 8 9s8-3 8-9c0-6-3-11.5-8-11.5Z"
              fill="#F4E6CE"
              stroke="#A7835E"
              strokeWidth="1"
            />
            <path
              d="M7 5.5v14M17 5.5v14"
              stroke="#C7A982"
              strokeWidth=".65"
              opacity=".7"
            />
            <path
              d="M8 24h8l-1 3H9Z"
              fill="#B99A78"
            />
            <circle
              cx="12"
              cy="28"
              r="1.3"
              fill="#EBC38E"
            />
          </svg>

          <span className="text-left leading-tight">
            <span className="block font-display text-base font-semibold text-[#76533D]">
              शुभकामनाएँ दें
            </span>
            <span className="block text-[0.62rem] tracking-[0.28em] text-[#A7835E] uppercase">
              Wish them
            </span>
          </span>
        </button>
      </div>
    </>
  )
}
