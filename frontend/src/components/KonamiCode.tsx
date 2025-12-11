'use client'

import { useEffect, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
  'Enter',
]

export function KonamiCode() {
  const [inputs, setInputs] = useState<string[]>([])
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key

      setInputs((prevInputs) => {
        const newInputs = [...prevInputs, key].slice(-KONAMI_CODE.length)

        // Check if the sequence matches
        if (newInputs.length === KONAMI_CODE.length) {
          const matches = newInputs.every((input, index) => input === KONAMI_CODE[index])
          if (matches) {
            setActivated(true)
            // Auto-dismiss after 10 seconds
            setTimeout(() => setActivated(false), 10000)
          }
        }

        return newInputs
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!activated) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-jt-emerald-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

      {/* Confetti-like elements */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          {['🏡', '🌲', '🎉', '✨', '⭐', '🎊'][Math.floor(Math.random() * 6)]}
        </div>
      ))}

      {/* Message box */}
      <div className="relative bg-white dark:bg-jt-stone-800 rounded-lg shadow-2xl p-6 max-w-md mx-4 pointer-events-auto border-4 border-jt-emerald-500 animate-bounce-once">
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold mb-3 bg-gradient-forest bg-clip-text text-transparent">
            🎉 Secret Unlocked! 🎉
          </h2>
          <p className="text-lg text-jt-stone-700 dark:text-jt-stone-300 mb-3">
            Congratulations, neighbor! You&apos;ve discovered the legendary HOA Power Mode!
          </p>
          <p className="text-sm text-jt-stone-600 dark:text-jt-stone-400 mb-3">
            You are now an honorary member of the Secret Committee of Neighborly Excellence™
          </p>
          <div className="flex justify-center my-2">
            <video
              src="/trophy_optimized.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-32 h-32 object-contain"
            />
          </div>
          <button
            onClick={() => setActivated(false)}
            className="mt-4 px-6 py-2 bg-gradient-forest text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Accept This Honor
          </button>
        </div>
      </div>
    </div>
  )
}
