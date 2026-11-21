import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invite } from '../data/invite'

gsap.registerPlugin(ScrollTrigger)

export default function Schedule() {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.day').forEach((day) => {
        gsap.from(day.querySelectorAll('.event-card'), {
          y: 50, opacity: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: day, start: 'top 80%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
      <h2 className="mb-12 text-center font-display text-4xl text-gold">मांगलिक कार्यक्रम</h2>
      {invite.days.map((d) => (
        <div key={d.label} className="day mb-12 last:mb-0">
          <p className="mb-6 text-center font-display text-xl text-[#5a0f21] sm:text-2xl">{d.label}</p>
          <div className="grid gap-4">
            {d.events.map((e) => (
              <div
                key={e.title}
                className="event-card rounded-2xl border border-gold/40 bg-white/50 p-5 text-center backdrop-blur-sm sm:p-6"
              >
                <p className="tracking-widest text-gold">{e.time}</p>
                <h3 className="my-1 font-display text-2xl">{e.title}</h3>
                {e.note && <p className="text-sm italic">{e.note}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}