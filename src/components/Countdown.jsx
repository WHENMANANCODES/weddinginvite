import { useEffect, useState } from 'react'

/*
  <Countdown target="2027-02-14T19:00:00+05:30" />
  Optional: caption="..." (pass null to hide the line above the tiles)

  Palette follows the royal background: maroon tile, zari-gold numerals,
  peacock-turquoise inner line, ivory and rani-pink accents.
*/

const getLeft = (target) => {
  const diff = Math.max(0, new Date(target) - Date.now())
  return {
    done: diff === 0,
    parts: [
      { en: 'Days', hi: 'दिन', value: Math.floor(diff / 864e5) },
      { en: 'Hours', hi: 'घंटे', value: Math.floor(diff / 36e5) % 24 },
      { en: 'Minutes', hi: 'मिनट', value: Math.floor(diff / 6e4) % 60 },
      { en: 'Seconds', hi: 'सेकंड', value: Math.floor(diff / 1e3) % 60 },
    ],
  }
}

// Cusped Rajput arch tile (outer fill + inner dashed line)
const OUTER =
  'M4 126V58C4 38 18 28 28 22C38 16 44 10 50 3C56 10 62 16 72 22C82 28 96 38 96 58V126Z'
const INNER =
  'M10 120V60C10 42 22 33 31 27C40 21 46 15 50 10C54 15 60 21 69 27C78 33 90 42 90 60V120Z'

function Lotus({ className = 'h-6 w-6' }) {
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

export default function Countdown({ target, caption = 'शुभ घड़ी की प्रतीक्षा' }) {
  const [left, setLeft] = useState(() => getLeft(target))

  useEffect(() => {
    setLeft(getLeft(target))
    const id = setInterval(() => setLeft(getLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (Number.isNaN(new Date(target).getTime())) return null

  if (left.done) {
    return (
      <div className="text-center">
        <Lotus className="mx-auto h-9 w-9" />
        <p className="mt-2 font-display text-3xl text-[#7a1230] sm:text-4xl">शुभ विवाह</p>
        <p className="mt-1 text-sm italic text-[#8a6212]">The celebration has begun</p>
      </div>
    )
  }

  return (
    <div role="timer" aria-label="Countdown to the wedding" className="text-center">
      {/* gradient defs, shared by all tiles */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="cd-tile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a3153f" />
            <stop offset=".55" stopColor="#7a1230" />
            <stop offset="1" stopColor="#4a0a18" />
          </linearGradient>
        </defs>
      </svg>

      {caption && (
        <div className="mb-5 flex items-center justify-center gap-3" aria-hidden>
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9962f] sm:w-20" />
          <p className="font-display text-base text-[#7a1230] sm:text-lg">{caption}</p>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#c9962f] sm:w-20" />
        </div>
      )}

      <div className="flex items-start justify-center gap-2 sm:gap-5">
        {left.parts.map((p, i) => (
          <div key={p.en} className="flex items-start gap-2 sm:gap-5">
            <div className="flex w-[4.3rem] flex-col items-center sm:w-28">
              <div className="relative aspect-[100/130] w-full drop-shadow-[0_10px_18px_rgba(122,18,48,0.28)]">
                <svg aria-hidden viewBox="0 0 100 130" className="absolute inset-0 h-full w-full">
                  <path d={OUTER} fill="url(#cd-tile)" stroke="#c9962f" strokeWidth="2.2" />
                  <path d={INNER} fill="none" stroke="#0f8b8d" strokeOpacity=".75" strokeWidth="1" strokeDasharray="2.5 3" />
                  <circle cx="50" cy="3" r="2.2" fill="#f6d27a" />
                </svg>
                <div className="absolute inset-x-0 top-[32%] bottom-[10%] grid place-items-center overflow-hidden">
                  {/* key re-mounts the digits each tick so the change is animated */}
                  <span
                    key={p.value}
                    className="cd-digit font-display text-[1.65rem] leading-none sm:text-[2.9rem]"
                    style={{
                      background: 'linear-gradient(180deg,#fff3c4 0%,#e6b84a 55%,#b8862a 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {String(p.value).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <p className="mt-2.5 font-display text-sm leading-none text-[#7a1230] sm:text-lg">{p.hi}</p>
              <p className="mt-1 text-[0.6rem] tracking-[0.25em] text-[#8a6212] uppercase sm:text-xs">{p.en}</p>
            </div>

            {i < left.parts.length - 1 && (
              <span
                aria-hidden
                className="mt-[3.2rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#c9962f] sm:mt-[5.2rem] sm:h-2 sm:w-2"
              />
            )}
          </div>
        ))}
      </div>

      <style>{`
        .cd-digit { animation: cdTick .45s cubic-bezier(.2,.8,.2,1); }
        @keyframes cdTick {
          from { transform: translateY(-45%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) { .cd-digit { animation: none; } }
      `}</style>
    </div>
  )
}