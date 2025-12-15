'use client'

import { useEffect, useState, useRef } from 'react'

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
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management - focus the close button when modal opens
  useEffect(() => {
    if (activated && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [activated])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow escape key to close if modal is open
      if (event.key === 'Escape' && activated) {
        setActivated(false)
        return
      }

      // Don't track keys when modal is open
      if (activated) return

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
  }, [activated])

  if (!activated) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="konami-title"
      aria-describedby="konami-description"
    >
      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="assertive">
        Secret unlocked! Congratulations, you discovered the legendary HOA Power Mode!
      </div>

      {/* Overlay with animation */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-jt-emerald-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"
        onClick={() => setActivated(false)}
        aria-hidden="true"
      />

      {/* Confetti-like elements */}
      <div aria-hidden="true">
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
            <span role="img" aria-label="Celebration">
              {['🏡', '🌲', '🎉', '✨', '⭐', '🎊'][Math.floor(Math.random() * 6)]}
            </span>
          </div>
        ))}
      </div>

      {/* Message box */}
      <div className="relative bg-white dark:bg-jt-stone-800 rounded-lg shadow-2xl p-6 max-w-md mx-4 pointer-events-auto border-4 border-jt-emerald-500 animate-bounce-once">
        <div className="text-center">
          <div className="mb-4">
            <h2
              id="konami-title"
              className="text-4xl font-serif font-bold bg-gradient-forest bg-clip-text text-transparent inline-block"
            >
              Secret Unlocked!
            </h2>
          </div>
          <div id="konami-description">
            <p className="text-lg text-jt-stone-700 dark:text-jt-stone-300 mb-3">
              Congratulations, neighbor! You&apos;ve discovered the legendary HOA Power Mode!
            </p>
            <p className="text-sm text-jt-stone-600 dark:text-jt-stone-400 mb-3">
              You are now an honorary member of the Secret Committee of Neighborly Excellence™
            </p>
          </div>
          <div className="flex justify-center my-2">
            <img
              src="/andrewjackson.jpg"
              alt="Portrait of Andrew Jackson, 7th President of the United States, for whom Jackson Trails neighborhood is named"
              className="w-40 h-40 object-cover rounded-lg"
            />
          </div>
          <button
            ref={closeButtonRef}
            onClick={() => setActivated(false)}
            className="mt-4 px-6 py-2 bg-gradient-forest text-white rounded-lg hover:opacity-90 transition-opacity focus:ring-2 focus:ring-jt-emerald-500 focus:ring-offset-2"
            aria-label="Close and accept this honor"
          >
            Accept This Honor
          </button>
          <p className="mt-2 text-xs text-jt-stone-500 dark:text-jt-stone-400">
            Press Escape or click outside to close
          </p>
        </div>
      </div>
    </div>
  )
}
