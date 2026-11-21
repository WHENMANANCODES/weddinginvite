import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invite } from '../data/invite'

gsap.registerPlugin(ScrollTrigger)

/*
  Reads the same invite data as before:
  groomFamily {hosts, grand}, brideFamily {parents, place}, groomHi, brideHi,
  message, welcome {title, lines}, maternal {title, lines}.
  Palette: maroon #7a1230, readable gold #8a6212, zari gold #c9962f, rani #a3153f,
  peacock #0f8b8d, ivory #fffaf0, body brown #4a2a24.
*/

function Lotus({ className = 'h-7 w-7' }) {
  return (
    <svg aria-hidden viewBox="-30 -30 60 60" className={className} fill="none" stroke="#c9962f">
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M0-6Q9-16 0-28Q-9-16 0-6Z"
          transform={`rotate(${i * 45})`}
          fill={i % 2 ? '#f6d27a' : '#e0306e'}
          fillOpacity=".35"
        />
      ))}
      <circle r="4.5" fill="#c9962f" stroke="none" />
    </svg>
  )
}

function Divider({ children }) {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#c9962f] sm:w-24" />
      {children || <Lotus className="h-6 w-6" />}
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#c9962f] sm:w-24" />
    </div>
  )
}

// Two wedding rings that join when scrolled into view (echoes the opening envelope)
function Rings() {
  const ring = (cx, cls) => (
    <circle cx={cx} cy="22" r="15" fill="none" stroke="#c9962f" strokeWidth="3.2" className={cls} />
  )
  return (
    <svg aria-hidden viewBox="0 0 76 44" className="mx-auto h-12 w-[4.5rem] overflow-visible drop-shadow-[0_0_8px_rgba(230,184,74,0.6)]">
      <defs>
        <clipPath id="fm-top">
          <rect x="0" y="0" width="76" height="22" />
        </clipPath>
      </defs>
      {ring(28, 'fm-a')}
      {ring(48, 'fm-b')}
      <circle cx="28" cy="22" r="15" fill="none" stroke="#c9962f" strokeWidth="3.2" clipPath="url(#fm-top)" className="fm-a" />
    </svg>
  )
}

function Name({ prefix, name }) {
  return (
    <div className="fam">
      <h3 className="font-display text-4xl leading-tight text-[#7a1230] sm:text-5xl">
        <span className="block text-lg text-[#8a6212] sm:text-xl">{prefix}</span>
        {name}
      </h3>
      <div aria-hidden className="mx-auto mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9962f]" />
        <span className="h-1.5 w-1.5 rotate-45 bg-[#c9962f]" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9962f]" />
      </div>
    </div>
  )
}

function Card({ title, lines = [] }) {
  return (
    <div className="fam relative border border-[#c9962f]/70 bg-[#fffaf0]/90 p-1.5 shadow-[0_10px_30px_rgba(122,18,48,0.1)] backdrop-blur-sm">
      <div className="relative h-full border border-dashed border-[#0f8b8d]/45 px-5 pt-9 pb-7 sm:px-6">
        {[
          'top-0.5 left-0.5 border-t border-l',
          'top-0.5 right-0.5 border-t border-r',
          'bottom-0.5 left-0.5 border-b border-l',
          'bottom-0.5 right-0.5 border-b border-r',
        ].map((c) => (
          <span key={c} aria-hidden className={`absolute h-2.5 w-2.5 border-[#c9962f] ${c}`} />
        ))}
        {/* lotus sits on the top border */}
        <span aria-hidden className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fffaf0] px-2">
          <Lotus className="h-7 w-7" />
        </span>
        <h3 className="font-display text-xl text-[#7a1230] sm:text-2xl">{title}</h3>
        <div aria-hidden className="mx-auto my-3 h-px w-14 bg-[#c9962f]/70" />
        <div className="space-y-1.5">
          {lines.map((l, i) => (
            <p key={i} className="leading-relaxed text-[#4a2a24]">
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
  const { groomFamily: g = {}, brideFamily: b = {} } = invite

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fam').forEach((el) =>
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      )

      // Rings glide together and join
      const join = { scrollTrigger: { trigger: '.fm-rings', start: 'top 88%' } }
      gsap.from('.fm-a', { x: -34, rotate: -120, opacity: 0, duration: 1.3, ease: 'back.out(1.3)', transformOrigin: '50% 50%', ...join })
      gsap.from('.fm-b', { x: 34, rotate: 120, opacity: 0, duration: 1.3, ease: 'back.out(1.3)', transformOrigin: '50% 50%', ...join })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      aria-label="Families"
      className="mx-auto max-w-3xl px-5 py-20 text-center text-[#4a2a24] sm:px-6 sm:py-28"
    >
      {/* Salutation */}
      <div className="fam">
        <Lotus className="mx-auto h-9 w-9" />
        <p className="mt-4 font-display text-xl text-[#8a6212]">स्नेही स्वजन,</p>
      </div>

      {/* Groom's side */}
      <div className="mt-10">
        <p className="fam font-display text-xl leading-snug text-[#5a0f21] sm:text-2xl">{g.hosts}</p>
        <p className="fam mt-3 mb-9 text-[#8a6212]">अपने सुपुत्र</p>
        <Name prefix="आयुष्मान्" name={invite.groomHi} />
        {g.grand && <p className="fam mx-auto mt-5 max-w-md text-sm leading-relaxed">{g.grand}</p>}
      </div>

      {/* Union */}
      <div className="fm-rings my-12 sm:my-14">
        <Rings />
        <p className="fam mt-2 font-display text-2xl text-[#a3153f]">संग</p>
      </div>

      {/* Bride's side */}
      <div>
        <Name prefix="आयुष्मती" name={invite.brideHi} />
        {b.parents && <p className="fam mx-auto mt-5 max-w-md text-sm leading-relaxed">{b.parents}</p>}
        {b.place && <p className="fam mt-1 text-sm text-[#8a6212]">{b.place}</p>}
      </div>

      {/* Invitation line */}
      <div className="fam relative mx-auto mt-14 max-w-lg border border-[#c9962f]/60 bg-[#fffaf0]/80 p-1 backdrop-blur-sm sm:mt-16">
        <div className="border border-[#c9962f]/30 px-6 py-7 sm:px-9">
          <p className="leading-loose">
            के{' '}
            <span className="font-display text-2xl text-[#a3153f]">मंगल परिणयोत्सव</span>{' '}
            {invite.message}
          </p>
        </div>
      </div>

      {/* Hosts of the celebration */}
      <div className="mt-20 sm:mt-24">
        <Divider />
        <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-8">
          <Card title={invite.welcome?.title} lines={invite.welcome?.lines} />
          <Card title={invite.maternal?.title} lines={invite.maternal?.lines} />
        </div>
      </div>

      {/* Footer */}
      <footer className="fam mt-20 sm:mt-24">
        <Divider>
          <span className="h-1.5 w-1.5 rotate-45 bg-[#c9962f]" />
        </Divider>
        <div className="relative mx-auto mt-7 inline-block border border-[#c9962f]/70 bg-[#fffaf0]/90 p-1 shadow-[0_8px_24px_rgba(122,18,48,0.12)]">
          <div className="border border-dashed border-[#0f8b8d]/45 px-9 py-3.5">
            <p className="font-display text-sm italic tracking-[0.2em] text-[#8a6212]">
              Crafted with love by
            </p>
            <p className="mt-1 flex items-center justify-center gap-2 font-display text-2xl tracking-wide text-[#7a1230]">
              <span aria-hidden className="text-lg text-[#d6336c]">♥</span>
              Manan
              <span aria-hidden className="text-lg text-[#d6336c]">♥</span>
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}