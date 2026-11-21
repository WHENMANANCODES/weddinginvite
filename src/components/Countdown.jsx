import { useEffect, useState } from 'react'

const getLeft = (target) => {
  const diff = Math.max(0, new Date(target) - Date.now())
  return {
    Days: Math.floor(diff / 864e5),
    Hours: Math.floor(diff / 36e5) % 24,
    Minutes: Math.floor(diff / 6e4) % 60,
    Seconds: Math.floor(diff / 1e3) % 60,
  }
}

export default function Countdown({ target }) {
  const [left, setLeft] = useState(() => getLeft(target))

  useEffect(() => {
    const id = setInterval(() => setLeft(getLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className="flex justify-center gap-4 sm:gap-8">
      {Object.entries(left).map(([label, value]) => (
        <div key={label} className="text-center">
          <div className="font-display text-4xl text-gold sm:text-6xl">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-sm tracking-widest uppercase">{label}</div>
        </div>
      ))}
    </div>
  )
}