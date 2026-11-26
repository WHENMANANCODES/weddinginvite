
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invite } from '../data/invite'

gsap.registerPlugin(ScrollTrigger)

/*
  Royal Wedding Theme:
  Deep Peacock Teal: #164E52
  Dark Teal:         #103B40
  Champagne Gold:    #C6A15B
  Warm Ivory:        #FFF9EF
  Muted Rose:        #C77983
  Warm Charcoal:     #514943
*/

// Decorative Lotus
function Lotus({ className = 'h-7 w-7' }) {
  return (
    <svg
      aria-hidden
      viewBox="-30 -30 60 60"
      className={className}
      fill="none"
      stroke="#C6A15B"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M0-6Q9-16 0-28Q-9-16 0-6Z"
          transform={`rotate(${i * 45})`}
          fill={i % 2 ? '#E7C77F' : '#C77983'}
          fillOpacity=".5"
        />
      ))}

      <circle r="4.5" fill="#C6A15B" stroke="none" />
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
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#C6A15B] sm:w-24" />

      {children || <Lotus className="h-6 w-6" />}

      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#C6A15B] sm:w-24" />
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
      stroke="#C6A15B"
      strokeWidth="3.2"
      className={cls}
    />
  )

  return (
    <svg
      aria-hidden
      viewBox="0 0 76 44"
      className="mx-auto h-12 w-[4.5rem] overflow-visible drop-shadow-[0_0_8px_rgba(198,161,91,0.55)]"
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
        stroke="#C6A15B"
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
        <span className="block text-lg text-[#A47F43] sm:text-xl">
          {prefix}
        </span>

        {name}
      </h3>

      <div
        aria-hidden
        className="mx-auto mt-4 flex items-center justify-center gap-2"
      >
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C6A15B]" />

        <span className="h-1.5 w-1.5 rotate-45 bg-[#C6A15B]" />

        <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C6A15B]" />
      </div>
    </div>
  )
}

// Family information card
function Card({ title, lines = [] }) {
  if (!title || !lines.length) return null

  return (
    <div className="fam relative rounded-lg border border-[#C6A15B]/65 bg-[#FFF9EF]/95 p-1.5 shadow-[0_10px_30px_rgba(16,59,64,0.10)] backdrop-blur-md">
      <div className="relative h-full rounded-md border border-dashed border-[#164E52]/35 px-5 pt-9 pb-7 sm:px-6">

        {/* Corner ornaments */}
        {[
          'top-0.5 left-0.5 border-t border-l',
          'top-0.5 right-0.5 border-t border-r',
          'bottom-0.5 left-0.5 border-b border-l',
          'bottom-0.5 right-0.5 border-b border-r',
        ].map((c) => (
          <span
            key={c}
            aria-hidden
            className={`absolute h-2.5 w-2.5 border-[#C6A15B] ${c}`}
          />
        ))}

        {/* Lotus on top border */}
        <span
          aria-hidden
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFF9EF] px-2"
        >
          <Lotus className="h-7 w-7" />
        </span>

        <h3 className="font-display text-xl text-[#164E52] sm:text-2xl">
          {title}
        </h3>

        <div
          aria-hidden
          className="mx-auto my-3 h-px w-14 bg-[#C6A15B]/70"
        />

        <div className="divide-y divide-[#C6A15B]/25">
          {lines.map((l, i) => (
            <p
              key={i}
              className="py-1.5 leading-relaxed text-[#514943]"
            >
              {l}
            </p>
          ))}
        </div>
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

        <p className="mt-4 font-display text-xl text-[#A47F43]">
          स्नेही स्वजन,
        </p>
      </div>

      {/* Groom's family */}
      <div className="mt-10">

        <p className="fam font-display text-xl leading-snug text-[#164E52] sm:text-2xl">
          {g.hosts}
        </p>

        <p className="fam mt-3 mb-9 text-[#A47F43]">
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

        <p className="fam mt-2 font-display text-2xl text-[#C77983]">
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
          <p className="fam mt-1 text-sm text-[#A47F43]">
            {b.place}
          </p>
        )}
      </div>

      {/* Invitation line */}
      <div className="fam relative mx-auto mt-14 max-w-lg rounded-lg border border-[#C6A15B]/65 bg-[#FFF9EF]/95 p-1 shadow-[0_10px_30px_rgba(16,59,64,0.10)] backdrop-blur-md sm:mt-16">
        <div className="rounded-md border border-dashed border-[#164E52]/30 px-6 py-7 sm:px-9">

          <p className="leading-loose text-[#514943]">
            के{' '}
            <span className="font-display text-2xl text-[#164E52]">
              मंगल परिणयोत्सव
            </span>{' '}
            {invite.message}
          </p>

        </div>
      </div>

      {/* Hosts of celebration */}
      <div className="mt-20 sm:mt-24">

        <Divider />

        <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-8">

          <Card
            title={invite.welcome?.title}
            lines={invite.welcome?.lines}
          />

          <Card
            title={invite.maternal?.title}
            lines={invite.maternal?.lines}
          />

        </div>
      </div>

      {/* Special regards */}
      <div className="mt-20 sm:mt-24">

        <div className="fam mb-3">

          <p className="font-display text-2xl text-[#164E52] sm:text-3xl">
            सादर निवेदन
          </p>

          <p className="mt-1 text-sm italic text-[#A47F43]">
            With warm regards
          </p>

        </div>

        <Divider />

        <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-8">

          <Card
            title={invite.specialRequest?.title}
            lines={invite.specialRequest?.lines}
          />

          <Card
            title={invite.welcomers?.title}
            lines={invite.welcomers?.lines}
          />

        </div>

        <div className="mx-auto mt-12 max-w-sm sm:mt-14">

          <Card
            title={invite.darshanabhilashi?.title}
            lines={invite.darshanabhilashi?.lines}
          />

        </div>
      </div>

      {/* Footer */}
      <footer className="fam mt-20 sm:mt-24">

        <Divider>
          <span className="h-1.5 w-1.5 rotate-45 bg-[#C6A15B]" />
        </Divider>

        <div className="relative mx-auto mt-7 inline-block rounded-lg border border-[#C6A15B]/70 bg-[#FFF9EF]/95 p-1 shadow-[0_8px_24px_rgba(16,59,64,0.12)] backdrop-blur-md">

          <div className="rounded-md border border-dashed border-[#164E52]/35 px-9 py-3.5">

            <p className="font-display text-sm italic tracking-[0.2em] text-[#A47F43]">
              Crafted with love by
            </p>

            <p className="mt-1 flex items-center justify-center gap-2 font-display text-2xl tracking-wide text-[#164E52]">

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
