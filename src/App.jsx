import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invite } from './data/invite'
import RomanticBackground from './components/RomanticBackground'
import EnvelopeIntro from './components/EnvelopeIntro'
import Countdown from './components/Countdown'
import Schedule from './components/Schedule'
import Families from './components/Families'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [intro, setIntro] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [paused, setPaused] = useState(false)
  const lenis = useRef(null)
  const audio = useRef(null)

  useEffect(() => {
    const l = new Lenis()
    l.stop() // locked until the invitation opens
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (t) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
    }
  }, [])

  // Music: tries immediately, otherwise starts on the first tap/click/key
  useEffect(() => {
    const a = new Audio('/bgm.mp3') // put your file in /public/bgm.mp3
    a.loop = true
    a.volume = 0
    audio.current = a

    const events = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']
    const stop = () => events.forEach((e) => window.removeEventListener(e, start))
    function start() {
      a.play()
        .then(() => {
          gsap.to(a, { volume: 0.6, duration: 3, ease: 'power1.in' })
          stop()
        })
        .catch(() => {}) // browser blocked it, will retry on the next tap
    }

    start()
    events.forEach((e) => window.addEventListener(e, start))
    return () => {
      stop()
      gsap.killTweensOf(a)
      a.pause()
    }
  }, [])

  const handleReveal = () => setRevealed(true)
  const handleDone = () => {
    setIntro(false)
    lenis.current?.start()
  }

  const toggleMusic = () => {
    const a = audio.current
    if (!a) return
    if (a.paused) {
      a.play().catch(() => {})
      setPaused(false)
    } else {
      a.pause()
      setPaused(true)
    }
  }

  const rise = `transition duration-1000 ease-out ${
    revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
  }`

  return (
    <>
      <RomanticBackground />
      {intro && <EnvelopeIntro onReveal={handleReveal} onDone={handleDone} />}

      <main className="relative z-10">
        <section className="grid min-h-svh place-items-center px-6 text-center">
          <div>
            <p className={`${rise} text-sm leading-relaxed tracking-wide sm:text-base`}>
              {invite.shloka[0]}
              <br />
              {invite.shloka[1]}
            </p>
            <h1
              style={{ transitionDelay: '250ms' }}
              className={`${rise} my-6 flex flex-col items-center font-display text-[clamp(2.75rem,13vw,6rem)] leading-tight sm:flex-row sm:justify-center sm:gap-4`}
            >
              <span>{invite.groom}</span>
              <span className="text-gold">&amp;</span>
              <span>{invite.bride}</span>
            </h1>
            <p style={{ transitionDelay: '500ms' }} className={`${rise} font-display text-xl italic`}>
              {invite.tagline}
            </p>
            <p style={{ transitionDelay: '750ms' }} className={`${rise} mt-6 tracking-[0.25em] text-gold`}>
              {invite.dateLabel}
            </p>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-24">
          <h2 className="mb-10 text-center font-display text-4xl text-gold">शुभ घड़ी आने में</h2>
          <Countdown target={invite.date} />
        </section>

        <Schedule />

        <section className="px-6 pb-16 text-center sm:pb-24">
          <p className="mb-2 font-display text-2xl">{invite.venue.name}</p>
          <p className="mb-2">{invite.venue.city}</p>
          <p className="mb-6 text-sm italic">{invite.venue.note}</p>
          <a
            href={invite.venue.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block min-h-12 rounded-full border border-gold px-8 py-3 text-gold transition active:bg-gold active:text-ivory sm:hover:bg-gold sm:hover:text-ivory"
          >
            रास्ता देखें
          </a>
        </section>

        <Families />
      </main>

      {!intro && (
        <button
          onClick={toggleMusic}
          aria-label="Toggle music"
          className="fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/50 bg-ivory/80 backdrop-blur"
        >
          {paused ? '🔇' : '🎵'}
        </button>
      )}
    </>
  )
}