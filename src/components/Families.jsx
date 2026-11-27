import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invite } from '../data/invite'

gsap.registerPlugin(ScrollTrigger)

// Wedding palette:
// Peacock Teal: #164E52
// Deep Teal: #103B40
// Royal Burgundy: #762D45
// Muted Rose: #C77983
// Warm Ivory: #FFF9EF
// Warm Charcoal: #514943

// Decorative Lotus
function Lotus({ className = 'h-7 w-7' }) {
  return (
    <svg
      aria-hidden
      viewBox="-30 -30 60 60"
      className={className}
      fill="none"
      stroke="#762D45"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M0-6Q9-16 0-28Q-9-16 0-6Z"
          transform={`rotate(${i * 45})`}
          fill={i % 2 ? '#C77983' : '#762D45'}
          fillOpacity=".65"
        />
      ))}

      <circle r="4.5" fill="#762D45" stroke="none" />
    </svg>
  )
}

// Decorative divider
function Divider({ children }) {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center gap-3"
    >
      <span className="h-[2px] w-14 bg-gradient-to-r from-transparent to-[#762D45] sm:w-24" />

      {children || <Lotus className="h-6 w-6" />}

      <span className="h-[2px] w-14 bg-gradient-to-l from-transparent to-[#762D45] sm:w-24" />
    </div>
  )
}

// Wedding rings animation
function Rings() {
  const ring = (cx, cls) => (
    <circle
      cx={cx}
      cy="22"
      r="15"
      fill="none"
      stroke="#762D45"
      strokeWidth="3.2"
      className={cls}
    />
  )

  return (
    <svg
      aria-hidden
      viewBox="0 0 76 44"
      className="mx-auto h-12 w-[4.5rem] overflow-visible drop-shadow-[0_2px_5px_rgba(118,45,69,0.2)]"
    >
      <defs>
        <clipPath id="fm-top">
          <rect x="0" y="0" width="76" height="22" />
        </clipPath>
      </defs>

      {ring(28, 'fm-a')}
      {ring(48, 'fm-b')}

      <circle
        cx="28"
        cy="22"
        r="15"
        fill="none"
        stroke="#C77983"
        strokeWidth="3.2"
        clipPath="url(#fm-top)"
        className="fm-a"
      />
    </svg>
  )
}

// Family member names
function Name({ prefix, name }) {
  return (
    <div className="fam">
      <h3 className="font-display text-4xl leading-tight text-[#164E52] sm:text-5xl">
        <span className="block text-lg font-semibold text-[#762D45] sm:text-xl">
          {prefix}
        </span>

        {name}
      </h3>

      <div
        aria-hidden
        className="mx-auto mt-4 flex items-center justify-center gap-2"
      >
        <span className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#762D45]" />

        <span className="h-2 w-2 rotate-45 bg-[#C77983]" />

        <span className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#762D45]" />
      </div>
    </div>
  )
}

export default function Families() {
  const root = useRef(null)

  const {
    groomFamily: g = {},
    brideFamily: b = {},
  } = invite

  // GSAP animations
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    const ctx = gsap.context(() => {

      // Family sections fade and slide in
      gsap.utils.toArray('.fam').forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
        })
      })

      // Wedding rings glide together
      const join = {
        scrollTrigger: {
          trigger: '.fm-rings',
          start: 'top 88%',
        },
      }

      gsap.from('.fm-a', {
        x: -34,
        rotate: -120,
        opacity: 0,
        duration: 1.3,
        ease: 'back.out(1.3)',
        transformOrigin: '50% 50%',
        ...join,
      })

      gsap.from('.fm-b', {
        x: 34,
        rotate: 120,
        opacity: 0,
        duration: 1.3,
        ease: 'back.out(1.3)',
        transformOrigin: '50% 50%',
        ...join,
      })

    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      aria-label="Families"
      className="mx-auto max-w-3xl px-5 py-20 text-center text-[#514943] sm:px-6 sm:py-28"
    >

      {/* Salutation */}
      <div className="fam">
        <Lotus className="mx-auto h-9 w-9" />

        <p className="mt-4 font-display text-xl font-semibold text-[#762D45]">
          स्नेही स्वजन,
        </p>
      </div>

      {/* Groom's family */}
      <div className="mt-10">

        <p className="fam font-display text-xl leading-snug text-[#164E52] sm:text-2xl">
          {g.hosts}
        </p>

        <p className="fam mt-3 mb-9 font-semibold text-[#762D45]">
          अपने सुपुत्र
        </p>

        <Name
          prefix="आयुष्मान्"
          name={invite.groomHi}
        />

        {g.grand && (
          <p className="fam mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#514943]">
            {g.grand}
          </p>
        )}
      </div>

      {/* Union */}
      <div className="fm-rings my-12 sm:my-14">
        <Rings />

        <p className="fam mt-2 font-display text-2xl font-semibold text-[#762D45]">
          संग
        </p>
      </div>

      {/* Bride's family */}
      <div>

        <Name
          prefix="आयुष्मती"
          name={invite.brideHi}
        />

        {b.parents && (
          <p className="fam mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#514943]">
            {b.parents}
          </p>
        )}

        {b.place && (
          <p className="fam mt-1 text-sm font-semibold text-[#762D45]">
            {b.place}
          </p>
        )}
      </div>

      {/* Invitation line */}
      <div className="fam relative mx-auto mt-14 max-w-lg rounded-xl border border-[#762D45]/55 bg-[#FFF9EF]/95 p-1.5 shadow-[0_5px_18px_rgba(22,78,82,0.10)] backdrop-blur-sm sm:mt-16">
        <div className="rounded-lg border border-dashed border-[#164E52]/35 px-6 py-7 sm:px-9">

          <p className="leading-loose text-[#514943]">
            के{' '}
            <span className="font-display text-2xl font-semibold text-[#164E52]">
              मंगल परिणयोत्सव
            </span>{' '}
            {invite.message}
          </p>

        </div>
      </div>

      {/* Footer */}
      <footer className="fam mt-20 sm:mt-24">

        <Divider>
          <span className="h-2 w-2 rotate-45 bg-[#C77983]" />
        </Divider>

        <div className="relative mx-auto mt-7 inline-block rounded-xl border border-[#762D45]/55 bg-[#FFF9EF]/95 p-1.5 shadow-[0_5px_18px_rgba(22,78,82,0.10)] backdrop-blur-sm">

          <div className="rounded-lg border border-dashed border-[#164E52]/35 px-9 py-3.5">

            <p className="font-display text-sm font-semibold italic tracking-[0.2em] text-[#762D45]">
              Crafted with love by
            </p>

            <p className="mt-1 flex items-center justify-center gap-2 font-display text-2xl font-semibold tracking-wide text-[#164E52]">

              <span
                aria-hidden
                className="text-lg text-[#C77983]"
              >
                ♥
              </span>

              Manan

              <span
                aria-hidden
                className="text-lg text-[#C77983]"
              >
                ♥
              </span>

            </p>
          </div>
        </div>
      </footer>

    </section>
  )
}