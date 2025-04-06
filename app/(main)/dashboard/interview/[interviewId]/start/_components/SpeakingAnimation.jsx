'use client'
import React from 'react'

const SpeakingAnimation = () => {
  const bars = 32 // Number of bars in the line

  return (
    <div className="relative w-full h-[200px] flex items-center justify-center bg-background">
      {/* Ripple effects */}
      <div className="absolute w-40 h-40 rounded-full bg-neutral-400 animate-ripple-1" />
      <div className="absolute w-40 h-40 rounded-full bg-neutral-600 animate-ripple-2" />

      {/* Audio visualization bars */}
      <div className="relative flex items-center gap-1">
        {Array.from({ length: bars }).map((_, i) => {
          const animationDelay = `${(i * 100) % 1000}ms`

          return (
            <div
              key={i}
              className="w-[5px] h-[40px] bg-gradient-to-t from-blue-200 to-orange-200 rounded-full animate-wave-1"
              style={{
                animationDelay,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default SpeakingAnimation
