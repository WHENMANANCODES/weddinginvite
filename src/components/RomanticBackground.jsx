import { useEffect, useRef } from 'react'

/*
  Royal Rajasthani background: layered parallax scene (viewBox 1600x1000, bottom-anchored).
  far hills + forts + distant caravan  ->  palace  ->  king & queen jharokhas  ->  elephant procession.
  Palette: sandstone #ead2b8 / #d9a98a, zari gold #c9962f, maroon #7a1230, rani #d6336c, peacock #0f8b8d.
*/

const GOLD = '#c9962f'
const STONE = '#e6c3a2'
const STONE_D = '#d4a283'
const STONE_L = '#f0d6bb'

// Rajput cusped arch
const arch = (cx, y, w, h) =>
  `M${cx - w / 2} ${y}V${y - h * 0.55}C${cx - w / 2} ${y - h * 0.75} ${cx - w * 0.3} ${y - h * 0.78} ${cx - w * 0.18} ${y - h * 0.88}C${cx - w * 0.1} ${y - h * 0.95} ${cx - w * 0.04} ${y - h * 0.98} ${cx} ${y - h}C${cx + w * 0.04} ${y - h * 0.98} ${cx + w * 0.1} ${y - h * 0.95} ${cx + w * 0.18} ${y - h * 0.88}C${cx + w * 0.3} ${y - h * 0.78} ${cx + w / 2} ${y - h * 0.75} ${cx + w / 2} ${y - h * 0.55}V${y}Z`

// Onion dome
const dome = (cx, y, r) =>
  `M${cx - r} ${y}C${cx - r} ${y - r * 1.1} ${cx - r * 0.4} ${y - r * 1.5} ${cx} ${y - r * 1.9}C${cx + r * 0.4} ${y - r * 1.5} ${cx + r} ${y - r * 1.1} ${cx + r} ${y}Z`

// Kangura battlements
const merlons = (x0, x1, y, s = 18) => {
  let d = ''
  for (let x = x0; x < x1; x += s * 1.6)
    d += `M${x} ${y}V${y - s * 0.7}L${x + s * 0.4} ${y - s * 1.1}L${x + s * 0.8} ${y - s * 0.7}V${y}Z`
  return d
}

const range = (n, f) => Array.from({ length: n }, (_, i) => f(i))

function Chhatri({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={GOLD} strokeWidth="1.5">
      <rect x="-36" y="-6" width="72" height="6" fill={STONE_D} />
      {[-28, -12, 6, 22].map((px) => (
        <rect key={px} x={px} y="-50" width="6" height="44" fill={STONE_L} />
      ))}
      <rect x="-40" y="-56" width="80" height="6" fill={STONE_D} />
      <path d={dome(0, -56, 30)} fill="#f3d9a0" />
      <path d="M0-113V-130" fill="none" />
      <circle cx="0" cy="-132" r="3.5" fill={GOLD} />
    </g>
  )
}

function Niche({ cx, who }) {
  return (
    <g>
      <path d={arch(cx, 840, 214, 350)} fill="url(#rb-niche)" stroke={GOLD} strokeWidth="3.5" />
      <path d={arch(cx, 840, 192, 322)} fill="none" stroke="#0f8b8d" strokeOpacity=".75" strokeDasharray="3 4" />
      <use href={`#rb-${who}`} transform={`translate(${cx} 842) scale(1.4)`} />
      <rect x={cx - 112} y="840" width="224" height="14" rx="3" fill={STONE_D} stroke={GOLD} strokeWidth="2" />
      <rect x={cx - 108} y="854" width="216" height="52" fill={STONE} />
      {range(5, (i) => (
        <path key={i} d={arch(cx - 80 + i * 40, 900, 22, 36)} fill="#a8644f" opacity=".7" />
      ))}
    </g>
  )
}

export default function RoyalBackground() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const layers = [...el.querySelectorAll('[data-d]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const p = { x: 0, y: 0, tx: 0, ty: 0, touched: false }
    let raf = 0

    const onMove = (e) => {
      p.touched = true
      p.tx = (e.clientX / window.innerWidth - 0.5) * 2
      p.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = (now) => {
      if (!p.touched) {
        p.tx = Math.sin(now / 5000) * 0.45 // idle sway keeps the 3D alive on touch devices
        p.ty = Math.cos(now / 7000) * 0.25
      }
      p.x += (p.tx - p.x) * 0.05
      p.y += (p.ty - p.y) * 0.05
      for (const l of layers) {
        const d = Number(l.dataset.d)
        l.style.transform = `translate3d(${(-p.x * d * 26).toFixed(2)}px,${(-p.y * d * 9).toFixed(2)}px,0)`
      }
      raf = requestAnimationFrame(tick)
    }

    if (!reduce) {
      window.addEventListener('pointermove', onMove)
      raf = requestAnimationFrame(tick)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const svgProps = { viewBox: '0 0 1600 1000', preserveAspectRatio: 'xMidYMax slice', className: 'h-full w-full' }
  const layer = 'absolute -left-[3%] -right-[3%] top-0 -bottom-[3%] will-change-transform'

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#fff6e3 0%,#fbe3c6 45%,#f3cfae 100%)' }}
    >
      {/* Shared defs */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="rb-niche" cx=".5" cy=".45" r=".7">
            <stop offset="0" stopColor="#fff3cf" />
            <stop offset=".6" stopColor="#f3c97a" />
            <stop offset="1" stopColor="#d99a3c" />
          </radialGradient>
          <linearGradient id="rb-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efd2b4" />
            <stop offset="1" stopColor="#d6a283" />
          </linearGradient>

          {/* Caparisoned elephant, faces right */}
          <symbol id="rb-ele" viewBox="0 0 320 200" overflow="visible">
            <g fill="currentColor">
              <rect x="70" y="40" width="170" height="100" rx="46" />
              <circle cx="248" cy="80" r="44" />
              {[92, 126, 196, 226].map((x) => (
                <rect key={x} x={x} y="120" width="26" height="62" rx="10" />
              ))}
              <path d="M270 100C300 104 304 150 282 170" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
              <path d="M72 70C52 90 54 120 62 142" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="224" cy="88" rx="18" ry="30" stroke="#c9962f" strokeOpacity=".6" />
            </g>
            <path d="M276 104C296 108 302 120 300 130" fill="none" stroke="#fff3d6" strokeWidth="5" strokeLinecap="round" />
            <circle cx="262" cy="70" r="2.6" fill="#fff3d6" />
            <path d="M236 44C250 38 266 44 274 58C262 62 246 62 236 54Z" fill="#e6b84a" />
            <path d="M92 48H220V128H92Z" fill="#8f1d3d" stroke="#e6b84a" strokeWidth="3" />
            <path d="M99 55H213V121H99Z" fill="none" stroke="#e6b84a" strokeOpacity=".8" strokeDasharray="3 3" />
            <path d="M156 64l13 20-13 20-13-20Z" fill="#e6b84a" />
            <circle cx="156" cy="84" r="4" fill="#0f8b8d" />
            <path d="M92 131H220" stroke="#e6b84a" strokeWidth="6" strokeDasharray="3 4" />
            <path d="M92 166h26M126 166h26M196 166h26M226 166h26" stroke="#e6b84a" strokeWidth="4" />
            <rect x="118" y="34" width="86" height="10" rx="3" fill="#e6b84a" />
            <path d="M126 34V8M161 34V8M196 34V8M118 8H204" stroke="#e6b84a" strokeWidth="3" />
            <path d="M126 8C126-6 146-12 161-26C176-12 196-6 196 8Z" fill="#d6336c" />
            <circle cx="161" cy="-29" r="3.5" fill="#e6b84a" />
          </symbol>

          {/* King: rani-pink turban with sarpech, upswept moustache, pearl necklace */}
          <g id="rb-king">
            <path d="M-66 0C-66-40-36-54 0-54S66-40 66 0Z" fill="#7a1230" stroke="#e6b84a" strokeWidth="3" />
            <path d="M-40-48L32 0" stroke="#e6b84a" strokeWidth="5" opacity=".8" />
            <rect x="-9" y="-66" width="18" height="16" fill="#c68a64" />
            <ellipse cx="0" cy="-86" rx="21" ry="26" fill="#d39d78" />
            <circle cx="-8" cy="-90" r="1.8" fill="#2a0f16" />
            <circle cx="8" cy="-90" r="1.8" fill="#2a0f16" />
            <path d="M-15-76C-8-80-3-79 0-77C3-79 8-80 15-76C8-71 4-73 0-74C-4-73-8-71-15-76Z" fill="#2a0f16" />
            <circle cx="-22" cy="-82" r="3.5" fill="#e6b84a" />
            <circle cx="22" cy="-82" r="3.5" fill="#e6b84a" />
            <ellipse cx="0" cy="-108" rx="38" ry="22" fill="#d6336c" />
            <path d="M-35-104C-12-96 12-96 35-104M-30-117C-10-109 10-109 30-117" fill="none" stroke="#e6b84a" strokeWidth="2" />
            <path d="M0-124C-9-148 9-158 2-182" fill="none" stroke="#e6b84a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="-122" r="6" fill="#0f8b8d" stroke="#e6b84a" strokeWidth="2" />
            <path d="M-34-50C-20-26 20-26 34-50" fill="none" stroke="#fff3d6" strokeWidth="3.5" strokeDasharray="1 5" strokeLinecap="round" />
            <circle cx="0" cy="-30" r="5" fill="#0f8b8d" stroke="#e6b84a" strokeWidth="1.5" />
          </g>

          {/* Queen: rani odhni veil, maang tikka, nath, layered necklace */}
          <g id="rb-queen">
            <path d="M-66 0C-66-40-36-54 0-54S66-40 66 0Z" fill="#a3153f" stroke="#e6b84a" strokeWidth="3" />
            <path d="M0-136C-44-136-52-98-54-62C-56-34-60-14-70 0H70C60-14 56-34 54-62C52-98 44-136 0-136Z" fill="#e0306e" fillOpacity=".92" stroke="#e6b84a" strokeWidth="2.5" />
            <rect x="-8" y="-66" width="16" height="16" fill="#c68a64" />
            <ellipse cx="0" cy="-86" rx="20" ry="26" fill="#d9a47e" />
            <path d="M-21-92C-18-110 18-110 21-92C12-103-12-103-21-92Z" fill="#2a0f16" />
            <path d="M0-108V-99" stroke="#e6b84a" strokeWidth="1.5" />
            <circle cx="0" cy="-96" r="3.5" fill="#e6b84a" />
            <circle cx="0" cy="-90" r="1.8" fill="#b3122f" />
            <ellipse cx="-8" cy="-84" rx="2.6" ry="1.5" fill="#2a0f16" />
            <ellipse cx="8" cy="-84" rx="2.6" ry="1.5" fill="#2a0f16" />
            <circle cx="6" cy="-73" r="2.4" fill="none" stroke="#e6b84a" strokeWidth="1.2" />
            <path d="M-6-68Q0-64 6-68" fill="none" stroke="#a3153f" strokeWidth="2" strokeLinecap="round" />
            <circle cx="-22" cy="-76" r="4" fill="#e6b84a" />
            <circle cx="22" cy="-76" r="4" fill="#e6b84a" />
            <path d="M-26-52C-14-38 14-38 26-52M-34-48C-18-26 18-26 34-48" fill="none" stroke="#e6b84a" strokeWidth="2.5" />
            <path d="M-34-48C-18-26 18-26 34-48" fill="none" stroke="#fff3d6" strokeWidth="3" strokeDasharray="1 5" strokeLinecap="round" />
            <circle cx="0" cy="-27" r="5" fill="#0f8b8d" stroke="#e6b84a" strokeWidth="1.5" />
          </g>
        </defs>
      </svg>

      {/* Sun mandala halo */}
      <div className="rb-sun absolute left-1/2 -top-[18vmin] h-[110vmin] w-[110vmin] -translate-x-1/2 opacity-60">
        <svg viewBox="-300 -300 600 600" className="h-full w-full" fill="none" stroke={GOLD}>
          <circle r="300" fill="url(#rb-niche)" fillOpacity=".25" stroke="none" />
          {[80, 140, 200, 260].map((r) => (
            <circle key={r} r={r} strokeOpacity=".35" strokeDasharray={r % 120 ? '2 6' : undefined} />
          ))}
          {range(24, (i) => (
            <path
              key={i}
              d="M0-150Q22-195 0-250Q-22-195 0-150Z"
              transform={`rotate(${i * 15})`}
              fill="#f6d27a"
              fillOpacity=".22"
              strokeOpacity=".5"
            />
          ))}
        </svg>
      </div>

      {/* Far: Aravalli hills, hill forts, distant caravan */}
      <div data-d="0.2" className={layer}>
        <svg {...svgProps}>
          <path d="M0 700L120 640L260 690L420 590L560 660L700 610L900 640L1060 580L1220 650L1380 600L1500 660L1600 620V1000H0Z" fill="#ecd3ba" />
          <path d="M0 780L180 720L360 770L560 700L760 750L980 700L1200 760L1400 710L1600 760V1000H0Z" fill="#e3bfa3" />
          {[[380, 600], [1040, 585]].map(([x, y], i) => (
            <g key={i} fill="#d9ae92" stroke={GOLD} strokeOpacity=".5">
              <path d={`M${x} ${y + 60}V${y}H${x + 170}V${y + 60}Z`} />
              <path d={merlons(x, x + 170, y, 14)} />
              <path d={dome(x + 85, y, 22)} />
              <path d={dome(x + 20, y, 14)} />
              <path d={dome(x + 150, y, 14)} />
            </g>
          ))}
          <g transform="translate(0 668) scale(.3)" color="#8a5a64" opacity=".5">
            <g className="rb-walk" style={{ '--P': '3500px' }}>
              {range(10, (i) => (
                <use key={i} href="#rb-ele" x={i * 700} width="320" height="200" />
              ))}
            </g>
          </g>
        </svg>
      </div>

      {/* Palace */}
      <div data-d="0.45" className={layer}>
        <svg {...svgProps}>
          <g fill="url(#rb-wall)" stroke={GOLD} strokeWidth="1.6" strokeOpacity=".75">
            <rect x="-60" y="740" width="210" height="260" />
            <rect x="1450" y="740" width="210" height="260" />
            <rect x="150" y="640" width="380" height="360" />
            <rect x="1070" y="640" width="380" height="360" />
            <rect x="520" y="430" width="80" height="570" />
            <rect x="1000" y="430" width="80" height="570" />
            <rect x="590" y="500" width="420" height="500" />
            <rect x="700" y="380" width="200" height="130" />
          </g>
          <g fill={STONE_D} stroke={GOLD} strokeOpacity=".7">
            <path d={merlons(150, 530, 640)} />
            <path d={merlons(1070, 1450, 640)} />
            <path d={merlons(-60, 150, 740, 16)} />
            <path d={merlons(1450, 1660, 740, 16)} />
            <rect x="580" y="492" width="440" height="10" />
            <rect x="150" y="640" width="380" height="8" />
            <rect x="1070" y="640" width="380" height="8" />
          </g>
          {/* wing windows */}
          {[0, 1].flatMap((side) =>
            range(4, (i) => {
              const cx = (side ? 1130 : 210) + i * 90
              return (
                <g key={`${side}-${i}`}>
                  <path d={arch(cx + 20, 800, 50, 90)} fill="#8f4a4f" fillOpacity=".55" stroke={GOLD} strokeOpacity=".8" />
                  <path d={arch(cx + 20, 930, 50, 90)} fill="#8f4a4f" fillOpacity=".45" stroke={GOLD} strokeOpacity=".8" />
                </g>
              )
            })
          )}
          {/* upper-floor window, tower slits */}
          <path d={arch(800, 500, 90, 100)} fill="url(#rb-niche)" stroke={GOLD} strokeWidth="2" />
          {[560, 1040].map((x) =>
            range(4, (i) => (
              <path key={`${x}-${i}`} d={arch(x, 560 + i * 90, 22, 44)} fill="#8f4a4f" fillOpacity=".6" stroke={GOLD} strokeOpacity=".7" />
            ))
          )}
          {/* roofline chhatris + dome + flag */}
          <Chhatri x="800" y="380" s="1.7" />
          <Chhatri x="650" y="500" s="1" />
          <Chhatri x="950" y="500" s="1" />
          <Chhatri x="560" y="430" s="0.9" />
          <Chhatri x="1040" y="430" s="0.9" />
          <Chhatri x="165" y="640" s="0.75" />
          <Chhatri x="1435" y="640" s="0.75" />
          <path d="M800 146V90" stroke={GOLD} strokeWidth="2.5" />
          <path d="M800 90L850 104L800 118Z" fill="#d6336c" stroke={GOLD} />
          {/* torana garland across the facade */}
          <path d="M600 520Q700 560 800 520T1000 520" fill="none" stroke="#f2a33a" strokeWidth="5" strokeDasharray="2 7" strokeLinecap="round" />
          <rect x="-60" y="900" width="1720" height="100" fill={STONE_D} stroke={GOLD} strokeOpacity=".6" />
        </svg>
      </div>

      {/* King and queen on their jharokha balconies */}
      <div data-d="0.7" className={layer}>
        <svg {...svgProps}>
          <Niche cx={690} who="king" />
          <Niche cx={910} who="queen" />
          <path d="M800 840C770 800 770 760 800 730C830 760 830 800 800 840Z" fill="#d6336c" stroke={GOLD} strokeWidth="2" />
          <circle cx="800" cy="786" r="9" fill={GOLD} />
        </svg>
      </div>

      {/* Near: royal elephant procession */}
      <div data-d="1" className={layer}>
        <svg {...svgProps}>
          <g transform="translate(0 770) scale(.85)" color="#6b3a4a" opacity=".62">
            <g className="rb-walk rb-walk-near" style={{ '--P': '2300px' }}>
              {range(10, (i) => (
                <use key={i} href="#rb-ele" x={i * 460} width="320" height="200" />
              ))}
            </g>
          </g>
        </svg>
      </div>

      {/* Marigold petals + gold dust */}
      {range(14, (i) => (
        <span
          key={`p${i}`}
          className="rb-petal absolute"
          style={{
            left: `${(i * 47 + 5) % 100}%`,
            width: 8 + (i % 4) * 3,
            height: (8 + (i % 4) * 3) * 1.5,
            animationDelay: `${(i * 1.7) % 14}s`,
            animationDuration: `${14 + (i % 5) * 3}s`,
            background: ['#f2a33a', '#e0306e', '#f6c85a'][i % 3],
            '--r': `${i * 37}deg`,
          }}
        />
      ))}
      {range(18, (i) => (
        <span
          key={`s${i}`}
          className="rb-dust absolute rounded-full bg-[#e6b84a]"
          style={{
            left: `${(i * 59 + 11) % 100}%`,
            top: `${(i * 31 + 7) % 70}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            animationDelay: `${(i * 0.7) % 6}s`,
          }}
        />
      ))}

      {/* Calm veil so invitation text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg,rgba(255,246,227,.55) 0%,rgba(255,246,227,.3) 45%,rgba(255,246,227,0) 100%), radial-gradient(ellipse at center,rgba(255,246,227,.25),transparent 70%)',
        }}
      />

      <style>{`
        .rb-walk { animation: rbWalk 110s linear infinite; }
        .rb-walk-near { animation-duration: 90s; }
        @keyframes rbWalk {
          from { transform: translateX(calc(var(--P) * -1)); }
          to { transform: translateX(0); }
        }
        .rb-sun { animation: rbSun 180s linear infinite; }
        @keyframes rbSun { to { transform: translateX(-50%) rotate(360deg); } }
        .rb-petal {
          top: -8%;
          border-radius: 100% 0 100% 0;
          opacity: 0;
          animation: rbFall linear infinite;
          will-change: transform, opacity;
        }
        @keyframes rbFall {
          0% { transform: translate3d(0,-8vh,0) rotate(var(--r)); opacity: 0; }
          10% { opacity: .65; }
          90% { opacity: .45; }
          100% { transform: translate3d(70px,110vh,0) rotate(calc(var(--r) + 540deg)); opacity: 0; }
        }
        .rb-dust { opacity: 0; animation: rbTwinkle 5s ease-in-out infinite; }
        @keyframes rbTwinkle { 0%,100% { opacity: 0; } 50% { opacity: .8; } }
        @media (prefers-reduced-motion: reduce) {
          .rb-walk, .rb-sun, .rb-dust { animation: none; }
          .rb-petal { display: none; }
          .rb-walk { transform: translateX(-600px); }
        }
      `}</style>
    </div>
  )
}