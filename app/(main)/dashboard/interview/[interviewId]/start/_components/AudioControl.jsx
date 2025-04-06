'use client'
import React from 'react'
import { Volume2, VolumeOff } from 'lucide-react'
import { Play } from 'lucide-react'
import { Pause } from 'lucide-react'
import SpeakingAnimation from './SpeakingAnimation'

const AudioControl = ({ isPlaying, onToggle }) => {
  return (
    <div className="flex items-center justify-around">
      <div
        className="cursor-pointer flex items-center gap-2"
        onClick={onToggle}
      >
        {isPlaying ? (
          <Pause className="text-blue-500" />
        ) : (
          <Play className="text-blue-500" />
        )}
        <span className="text-sm">{isPlaying ? 'Stop' : 'Play'}</span>
      </div>
      {isPlaying && <SpeakingAnimation />}
    </div>
  )
}

export default AudioControl
