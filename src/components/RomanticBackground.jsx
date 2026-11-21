import { useEffect, useRef } from 'react'

const PETALS = ['#f4a6b5', '#f7c1cb', '#e98aa0', '#fbd5c8', '#f2b8a2']
const wrap = (v, m) => ((v % m) + m) % m
const rand = (a, b) => a + Math.random() * (b - a)

export default function RomanticBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let w = 0, h = 0, raf = 0
    let items = [], bokeh = []

    const init = () => {
      const small = w < 640
      const petals = Array.from({ length: small ? 22 : 40 }, () => ({
        kind: 'petal', z: Math.random(), x: rand(0, w), y: rand(0, h + 80),
        sway: rand(0.4, 1.2), ph: rand(0, 6.28), spin: rand(-0.6, 0.6), rot: rand(0, 6.28),
        flip: rand(0.8, 2), color: PETALS[(Math.random() * PETALS.length) | 0],
      }))
      const hearts = Array.from({ length: small ? 5 : 9 }, () => ({
        kind: 'heart', z: rand(0.2, 1), x: rand(0, w), y: rand(0, h + 80),
        sway: rand(0.4, 1), ph: rand(0, 6.28), color: '#e98aa0',
      }))
      items = [...petals, ...hearts].sort((a, b) => a.z - b.z) // far first
      bokeh = Array.from({ length: small ? 8 : 16 }, () => ({
        x: rand(0, w), y: rand(0, h + 200), r: rand(14, 46), k: rand(0.05, 0.35),
        v: rand(4, 12), a: rand(0.12, 0.32), tw: rand(0.5, 1.5), ph: rand(0, 6.28),
      }))
    }

    const petalPath = (s) => {
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.bezierCurveTo(s * 0.9, -s * 0.5, s * 0.8, s * 0.7, 0, s)
      ctx.bezierCurveTo(-s * 0.8, s * 0.7, -s * 0.9, -s * 0.5, 0, -s)
      ctx.fill()
    }

    const heartPath = (s) => {
      ctx.beginPath()
      ctx.moveTo(0, s)
      ctx.bezierCurveTo(-s * 1.3, -s * 0.1, -s * 0.7, -s * 1.1, 0, -s * 0.35)
      ctx.bezierCurveTo(s * 0.7, -s * 1.1, s * 1.3, -s * 0.1, 0, s)
      ctx.fill()
    }

    const draw = (now) => {
      const t = reduce ? 0 : now / 1000
      const sy = window.scrollY
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      ctx.clearRect(0, 0, w, h)

      // golden bokeh lights
      for (const b of bokeh) {
        const x = b.x + pointer.x * b.k * 60
        const y = wrap(b.y - t * b.v - sy * b.k, h + 200) - 100
        const a = b.a * (0.55 + 0.45 * Math.sin(t * b.tw + b.ph))
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.r)
        g.addColorStop(0, `rgba(232,190,112,${a})`)
        g.addColorStop(1, 'rgba(232,190,112,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, b.r, 0, 6.2832)
        ctx.fill()
      }

      // petals (fall) + hearts (rise), depth via z
      for (const p of items) {
        const heart = p.kind === 'heart'
        const dir = heart ? -1 : 1
        const speed = heart ? 10 + p.z * 22 : 14 + p.z * 46
        const x = p.x + Math.sin(t * p.sway + p.ph) * (14 + p.z * 34) + pointer.x * (p.z - 0.3) * 60
        const y =
          wrap(p.y + dir * t * speed - sy * (0.08 + p.z * 0.3) + pointer.y * (p.z - 0.3) * 30, h + 80) - 40
        const s = heart ? 5 + p.z * 9 : 6 + p.z * 13

        ctx.save()
        ctx.translate(x, y)
        if (heart) {
          ctx.rotate(Math.sin(t * p.sway + p.ph) * 0.25)
          ctx.globalAlpha = 0.25 + p.z * 0.45
        } else {
          const f = Math.cos(t * p.flip + p.ph)
          ctx.rotate(p.rot + t * p.spin)
          ctx.scale(1, 0.25 + Math.abs(f) * 0.75) // 3D flip effect
          ctx.globalAlpha = (0.3 + p.z * 0.55) * (0.65 + Math.abs(f) * 0.35)
        }
        ctx.fillStyle = p.color
        if (heart) heartPath(s)
        else petalPath(s)
        ctx.restore()
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const widthChanged = window.innerWidth !== w
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (widthChanged) init()
      if (reduce) draw(0)
    }

    const onMove = (e) => {
      pointer.tx = (e.clientX / w - 0.5) * 2
      pointer.ty = (e.clientY / h - 0.5) * 2
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    resize()
    if (!reduce) raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(ellipse at 15% 8%, #fff4e8 0%, transparent 55%), radial-gradient(ellipse at 90% 35%, #fde6e8 0%, transparent 50%), radial-gradient(ellipse at 50% 105%, #f8dfc4 0%, transparent 60%), linear-gradient(180deg, #fdf8ef, #fcefe8)',
      }}
    >
      <canvas ref={ref} className="h-full w-full" />
    </div>
  )
}
