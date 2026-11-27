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
import WishLanterns from './components/WishLanterns'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [intro, setIntro] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [paused, setPaused] = useState(false)

  const lenis = useRef(null)
  const audio = useRef(null)

  // Smooth scrolling with Lenis
  useEffect(() => {
    const l = new Lenis()
    l.stop()
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

  // Background music
  useEffect(() => {
    const a = new Audio('/bgm.mp3')
    a.loop = true
    a.volume = 0
    audio.current = a

    const events = [
      'pointerdown',
      'pointerup',
      'touchend',
      'click',
      'keydown',
    ]

    const stop = () => {
      events.forEach((e) => window.removeEventListener(e, start))
    }

    function start() {
      a.play()
        .then(() => {
          gsap.to(a, {
            volume: 0.6,
            duration: 3,
            ease: 'power1.in',
          })
          stop()
        })
        .catch(() => {})
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

  // Music toggle
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

  // Reveal animation
  const rise = `transition duration-1000 ease-out ${
    revealed
      ? 'translate-y-0 opacity-100'
      : 'translate-y-8 opacity-0'
  }`

  return (
    <>
      {/* Moving Couple Background */}
      <RomanticBackground />

      {/* Envelope Intro */}
      {intro && (
        <EnvelopeIntro
          onReveal={handleReveal}
          onDone={handleDone}
        />
      )}

      <main className="relative z-10">

        {/* ================= HERO SECTION ================= */}

        <section className="grid min-h-svh place-items-center px-5 py-20 text-center">

          <div className="w-full max-w-7xl">

            {/* Sanskrit Shloka */}
            <p
              className={`${rise} font-hindi text-base font-semibold leading-relaxed tracking-wide text-[#103B40] [text-shadow:0_1px_10px_rgba(255,249,239,0.95)] sm:text-xl md:text-2xl`}
            >
              {invite.shloka[0]}
              <br />
              {invite.shloka[1]}
            </p>

            {/* Burgundy Divider */}
            <div className="mx-auto my-8 h-[2px] w-28 bg-[#762D45] shadow-[0_1px_5px_rgba(255,249,239,0.8)]" />

            {/* Couple Names */}
            <h1
              style={{ transitionDelay: '250ms' }}
              className={`${rise} my-8 flex flex-col items-center font-display text-[clamp(3.2rem,12vw,8rem)] font-bold leading-[1.1] tracking-tight text-[#103B40] [text-shadow:0_2px_12px_rgba(255,249,239,0.95),0_1px_2px_rgba(255,249,239,0.8)] sm:flex-row sm:justify-center sm:gap-5`}
            >
              <span>{invite.groom}</span>

              <span className="font-display text-[#762D45] [text-shadow:0_2px_10px_rgba(255,249,239,0.95)]">
                &amp;
              </span>

              <span>{invite.bride}</span>
            </h1>

            {/* Tagline */}
            <p
              style={{ transitionDelay: '500ms' }}
              className={`${rise} font-display text-xl font-semibold italic text-[#443B35] [text-shadow:0_1px_10px_rgba(255,249,239,0.95)] sm:text-3xl md:text-4xl`}
            >
              {invite.tagline}
            </p>

            {/* Burgundy Divider */}
            <div className="mx-auto my-8 h-[2px] w-28 bg-[#762D45] shadow-[0_1px_5px_rgba(255,249,239,0.8)]" />

            {/* Wedding Date */}
            <p
              style={{ transitionDelay: '750ms' }}
              className={`${rise} font-display text-base font-bold tracking-[0.15em] text-[#762D45] [text-shadow:0_1px_10px_rgba(255,249,239,0.98)] sm:text-xl sm:tracking-[0.22em] md:text-2xl`}
            >
              {invite.dateLabel}
            </p>

          </div>
        </section>

        {/* ================= COUNTDOWN ================= */}

        <section className="px-6 py-16 sm:py-24">

          <h2 className="mb-10 text-center font-display text-3xl font-bold text-[#103B40] [text-shadow:0_1px_8px_rgba(255,249,239,0.95)] sm:text-4xl">
            शुभ घड़ी आने में
          </h2>

          <Countdown target={invite.date} />

        </section>

        {/* ================= WEDDING SCHEDULE ================= */}

        <Schedule />

        {/* ================= VENUE SECTION ================= */}

        <section className="px-6 py-20 text-center">

          <div className="mx-auto max-w-xl rounded-3xl border border-[#762D45]/50 bg-[#FFF9EF]/90 px-6 py-12 shadow-[0_12px_40px_rgba(16,59,64,0.12)] backdrop-blur-sm">

            <p className="mb-3 font-display text-3xl font-bold text-[#103B40]">
              {invite.venue.name}
            </p>

            <p className="mb-3 text-lg font-semibold text-[#514943]">
              {invite.venue.city}
            </p>

            <p className="mb-8 text-base italic text-[#786858]">
              {invite.venue.note}
            </p>

            <a
              href={invite.venue.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#103B40] bg-[#103B40] px-9 py-3 font-semibold tracking-wide text-[#FFF9EF] shadow-md transition-all duration-300 hover:border-[#762D45] hover:bg-[#762D45] hover:text-white active:scale-95"
            >
              रास्ता देखें
            </a>

          </div>
        </section>

        {/* ================= FAMILY SECTION ================= */}

        <Families />

      </main>

      {/* ================= WISH LANTERNS ================= */}
      {/* Shown only after the envelope intro, so it never sits on top of it */}

      {!intro && <WishLanterns />}

      {/* ================= MUSIC BUTTON ================= */}

      {!intro && (
        <button
          onClick={toggleMusic}
          aria-label="Toggle music"
          className="fixed right-5 bottom-5 z-40 grid h-12 w-12 place-items-center rounded-full border-2 border-[#762D45] bg-[#103B40] text-lg text-[#FFF9EF] shadow-[0_5px_20px_rgba(16,59,64,0.3)] transition-all duration-300 hover:scale-110 hover:bg-[#762D45] active:scale-95"
        >
          {paused ? '🔇' : '🎵'}
        </button>
      )}

    </>
  )
}