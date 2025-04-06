'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const AIAvatar = ({ isPlaying }) => {
  return (
    <motion.div
      animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, repeat: isPlaying ? Infinity : 0 }}
      className="flex flex-col items-center"
    >
      <Image
        src="/aitalkingimage.webp" // Correct path for images inside "public" folder
        alt="AI Avatar"
        width={100}
        height={100}
        className="rounded-full shadow-lg"
      />
      <p className="text-center text-gray-600 mt-2">AI Interviewer</p>
    </motion.div>
  )
}

export default AIAvatar
