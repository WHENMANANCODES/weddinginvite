import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invite } from '../data/invite'

gsap.registerPlugin(ScrollTrigger)

function Block({ title, lines }) {
  return (
    <div className="fam">
      <h3 className="mb-3 font-display text-xl text-gold">{title}</h3>
      {lines.map((l) => (
        <p key={l} className="leading-relaxed">{l}</p>
      ))}
    </div>
  )
}

export default function Families() {
  const root = useRef(null)
  const { groomFamily: g, brideFamily: b } = invite

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fam').forEach((el) =>
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
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-24"
    >
      <p className="fam">स्नेही स्वजन,</p>

      <p className="fam mt-2 font-display text-xl text-[#5a0f21] sm:text-2xl">
        {g.hosts}
      </p>

      <p className="fam mb-8">अपने सुपुत्र</p>

      <h3 className="fam font-display text-4xl text-[#5a0f21] sm:text-5xl">
        आयुष्मान् {invite.groomHi}
      </h3>

      <p className="fam mx-auto mt-2 max-w-md text-sm">
        {g.grand}
      </p>

      <p className="fam my-6 font-display text-2xl text-gold">
        संग
      </p>

      <h3 className="fam font-display text-4xl text-[#5a0f21] sm:text-5xl">
        आयुष्मती {invite.brideHi}
      </h3>

      <p className="fam mx-auto mt-2 max-w-md text-sm">
        {b.parents}
      </p>

      <p className="fam text-sm">
        {b.place}
      </p>

      <p className="fam mx-auto mt-10 max-w-md leading-relaxed">
        के <span className="font-display text-gold">मंगल परिणयोत्सव</span> {invite.message}
      </p>

      <div className="mt-16 grid gap-12 sm:grid-cols-2">
        <Block
          title={invite.welcome.title}
          lines={invite.welcome.lines}
        />

        <Block
          title={invite.maternal.title}
          lines={invite.maternal.lines}
        />
      </div>

      {/* Footer */}
{/* Footer */}
<div className="mt-16">
  <p className="font-display text-sm italic tracking-widest text-gold">
    Crafted with love by ♥ Manan
  </p>
</div>

    </section>
  )
}   