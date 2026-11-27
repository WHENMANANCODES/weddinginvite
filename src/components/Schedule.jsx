
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invite } from '../data/invite'

gsap.registerPlugin(ScrollTrigger)

// Royal Burgundy + Vibrant Rose + Pearl White

const C = {
  burgundy: '#6D1748',
  rose: '#E83E75',
  magenta: '#A8245A',
  pink: '#FF8DB1',
  pearl: '#FFF8FC',
  plum: '#49303F',
}

const DEV = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

const dev = (n) =>
  String(n).split('').map((c) => DEV[+c]).join('')

// Parts of the day in Hindi
const period = (t = '') => {
  const m = String(t).match(/(\d{1,2})(?::\d{2})?\s*([ap])\.?m/i)
  if (!m) return null

  let h = Number(m[1]) % 12
  if (m[2].toLowerCase() === 'p') h += 12

  if (h < 4) return 'रात्रि'
  if (h < 11) return 'प्रातः'
  if (h < 16) return 'मध्याह्न'
  if (h < 19) return 'सायं'
  return 'रात्रि'
}

// Decorative lotus
function Lotus({ className = 'h-8 w-8' }) {
  return (
    <svg
      aria-hidden
      viewBox="-30 -30 60 60"
      className={className}
      fill="none"
      stroke={C.rose}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M0-6Q9-16 0-28Q-9-16 0-6Z"
          transform={`rotate(${i * 45})`}
          fill={i % 2 ? C.pink : C.rose}
          fillOpacity=".75"
        />
      ))}
      <circle r="4.5" fill={C.burgundy} stroke="none" />
    </svg>
  )
}

// Decorative divider
function Divider() {
  return (
    <div
      aria-hidden
      className="my-12 flex items-center justify-center gap-3 sm:my-16"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#E83E75] sm:w-28" />
      <Lotus className="h-7 w-7" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#E83E75] sm:w-28" />
    </div>
  )
}

// Number medallion
function Medallion({ n, size = 'lg' }) {
  const big = size === 'lg'

  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-full border-2 border-[#E83E75] bg-[#6D1748] font-display text-[#FFF8FC] shadow-[0_0_0_3px_#FFF8FC,0_0_0_5px_#E83E75,0_5px_18px_rgba(109,23,72,0.25)] ${
        big ? 'h-16 w-16 text-3xl' : 'h-10 w-10 text-xl'
      }`}
    >
      <span className="absolute inset-1 rounded-full border border-dashed border-[#FF8DB1]" />
      {dev(n)}
    </span>
  )
}

// Smooth navigation
const jump = (id) => {
  const el = document.getElementById(id)
  if (!el) return

  const reduce = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  el.scrollIntoView({
    behavior: reduce ? 'auto' : 'smooth',
    block: 'start',
  })
}

export default function Schedule() {
  const root = useRef(null)
  const days = (invite.days || []).filter((d) => d.events?.length)

  // GSAP animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return

    const ctx = gsap.context(() => {
      gsap.from('.sch-head > *', {
        y: 24,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.sch-head',
          start: 'top 85%',
        },
      })

      gsap.from('.glance', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.glance',
          start: 'top 88%',
        },
      })

      gsap.utils.toArray('.chapter').forEach((ch) => {
        gsap.from(ch.querySelectorAll('.chapter-head > *'), {
          y: 24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ch.querySelector('.chapter-head'),
            start: 'top 85%',
          },
        })

        // Timeline thread animation
        gsap.fromTo(
          ch.querySelector('.rail-line'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top',
            scrollTrigger: {
              trigger: ch.querySelector('.events'),
              start: 'top 70%',
              end: 'bottom 65%',
              scrub: 0.5,
            },
          }
        )

        // Event animations
        ch.querySelectorAll('.event-row').forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
            },
          })

          tl.from(
            row.querySelector('.node'),
            {
              scale: 0,
              duration: 0.5,
              ease: 'back.out(2.5)',
            },
            0
          )
            .from(
              row.querySelector('.event-time'),
              {
                opacity: 0,
                x: -16,
                duration: 0.7,
                ease: 'power2.out',
              },
              0.1
            )
            .from(
              row.querySelector('.event-card'),
              {
                y: 36,
                opacity: 0,
                duration: 0.85,
                ease: 'power3.out',
              },
              0.1
            )
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  if (!days.length) return null

  return (
    <section
      ref={root}
      aria-labelledby="schedule-title"
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24"
    >
      {/* Section heading */}
      <header className="sch-head text-center">
        <Lotus className="mx-auto h-10 w-10" />

        <h2
          id="schedule-title"
          className="mt-3 font-display text-4xl text-[#6D1748] sm:text-5xl"
        >
          मांगलिक कार्यक्रम
        </h2>

        <p className="mt-2 font-display text-base italic tracking-[0.2em] text-[#A8245A]">
          Wedding Schedule
        </p>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#49303F]">
          {days.length > 1
            ? `${days.length} chapters of celebration. Each one lists the ceremonies in the order they happen, with the time beside it.`
            : 'The ceremonies in the order they happen, with the time beside each.'}
        </p>
      </header>

      {/* At a glance */}
      <nav
        aria-label="Schedule at a glance"
        className="glance relative mt-10 rounded-xl border-2 border-[#E83E75]/80 bg-[#FFF8FC]/95 p-1.5 shadow-[0_12px_40px_rgba(109,23,72,0.14)] backdrop-blur-md sm:mt-12"
      >
        <div className="rounded-lg border border-dashed border-[#A8245A]/45 px-4 py-5 sm:px-7 sm:py-6">
          <p className="mb-4 text-center font-display text-lg text-[#6D1748]">
            एक नज़र में{' '}
            <span className="ml-1 text-sm italic text-[#A8245A]">
              At a glance
            </span>
          </p>

          <ul className="divide-y divide-[#E83E75]/25">
            {days.map((d, i) => (
              <li key={d.label}>
                <button
                  type="button"
                  onClick={() => jump(`chapter-${i}`)}
                  className="group flex w-full items-start gap-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#E83E75]"
                >
                  <Medallion n={i + 1} size="sm" />

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg text-[#6D1748] transition-colors group-hover:text-[#E83E75]">
                      {d.label}
                    </span>

                    {d.date && (
                      <span className="block text-xs tracking-wide text-[#A8245A]">
                        {d.date}
                      </span>
                    )}

                    <span className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[0.8rem] text-[#49303F]">
                      {d.events.map((e) => (
                        <span key={e.title}>
                          <b className="font-semibold text-[#6D1748]">
                            {e.time}
                          </b>{' '}
                          {e.title}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Schedule chapters */}
      {days.map((d, di) => (
        <div key={d.label}>
          <Divider />

          <article
            id={`chapter-${di}`}
            className="chapter scroll-mt-6"
            aria-labelledby={`chapter-title-${di}`}
          >
            {/* Chapter heading */}
            <header className="chapter-head flex flex-col items-center text-center">
              <Medallion n={di + 1} />

              <p className="mt-4 text-xs tracking-[0.35em] text-[#A8245A] uppercase">
                अध्याय {dev(di + 1)}
              </p>

              <h3
                id={`chapter-title-${di}`}
                className="mt-2 font-display text-3xl text-[#6D1748] sm:text-4xl"
              >
                {d.label}
              </h3>

              {(d.date || d.venue) && (
                <p className="mt-3 text-sm text-[#49303F]">
                  {d.date}
                  {d.date && d.venue ? ' • ' : ''}
                  {d.venue}
                </p>
              )}

              <p className="mt-2 text-xs italic text-[#A8245A]">
                {d.events.length}{' '}
                {d.events.length === 1 ? 'ceremony' : 'ceremonies'}
              </p>
            </header>

            {/* Timeline */}
            <ol className="events relative mt-9 sm:mt-12">
              <span
                aria-hidden
                className="rail-line absolute top-4 bottom-4 left-4 w-px origin-top bg-gradient-to-b from-[#E83E75] via-[#A8245A] to-[#E83E75] sm:left-[7.5rem]"
              />

              {d.events.map((e, ei) => {
                const part = period(e.time)

                return (
                  <li
                    key={`${e.title}-${ei}`}
                    className="event-row grid grid-cols-[2rem_1fr] pb-7 last:pb-0 sm:grid-cols-[6.5rem_2rem_1fr]"
                  >
                    {/* Desktop time */}
                    <div className="event-time hidden pt-[1.15rem] pr-3 text-right sm:block">
                      <p className="font-display text-xl leading-none text-[#6D1748]">
                        {e.time}
                      </p>

                      {part && (
                        <p className="mt-1 text-xs text-[#A8245A]">
                          {part}
                        </p>
                      )}
                    </div>

                    {/* Timeline node */}
                    <div className="relative z-10 flex justify-center pt-[1.55rem]">
                      <span className="node h-3.5 w-3.5 rotate-45 border-2 border-[#E83E75] bg-[#6D1748] shadow-[0_0_0_4px_#FFF8FC]" />
                    </div>

                    {/* Event card */}
                    <div className="event-card relative ml-3 rounded-lg border-2 border-[#E83E75]/75 bg-[#FFF8FC]/95 p-1 shadow-[0_8px_28px_rgba(109,23,72,0.12)] backdrop-blur-md">
                      <div className="relative rounded-md border border-dashed border-[#A8245A]/40 px-4 py-4 sm:px-6 sm:py-5">
                        {/* Corner decorations */}
                        {[
                          'top-0.5 left-0.5 border-t border-l',
                          'top-0.5 right-0.5 border-t border-r',
                          'bottom-0.5 left-0.5 border-b border-l',
                          'bottom-0.5 right-0.5 border-b border-r',
                        ].map((c) => (
                          <span
                            key={c}
                            aria-hidden
                            className={`absolute h-2.5 w-2.5 border-[#E83E75] ${c}`}
                          />
                        ))}

                        {/* Mobile time */}
                        <p className="mb-1 text-sm font-semibold tracking-wide text-[#A8245A] sm:hidden">
                          {e.time}
                          {part && (
                            <span className="ml-2 font-normal">
                              {part}
                            </span>
                          )}
                        </p>

                        {/* Event title */}
                        <h4 className="font-display text-2xl leading-snug text-[#6D1748]">
                          {e.title}
                        </h4>

                        {/* Venue and attire */}
                        {(e.venue || e.dress) && (
                          <dl className="mt-3 grid gap-1 text-[0.82rem] text-[#49303F]">
                            {e.venue && (
                              <div className="flex gap-2">
                                <dt className="w-14 shrink-0 font-semibold text-[#A8245A]">
                                  Venue
                                </dt>
                                <dd>{e.venue}</dd>
                              </div>
                            )}

                            {e.dress && (
                              <div className="flex gap-2">
                                <dt className="w-14 shrink-0 font-semibold text-[#A8245A]">
                                  Attire
                                </dt>
                                <dd>{e.dress}</dd>
                              </div>
                            )}
                          </dl>
                        )}

                        {/* Event note */}
                        {e.note && (
                          <p className="mt-3 border-l-[3px] border-[#E83E75] pl-3 text-sm italic leading-relaxed text-[#49303F]">
                            {e.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </article>
        </div>
      ))}

      {/* Closing blessing */}
      <footer className="mt-16 text-center">
        <Lotus className="mx-auto h-8 w-8" />

        <p className="mt-3 font-display text-xl text-[#6D1748]">
          आपकी उपस्थिति हमारा सौभाग्य है
        </p>

        <p className="mt-1 text-sm italic text-[#A8245A]">
          Your presence is our blessing
        </p>
      </footer>
    </section>
  )
}
