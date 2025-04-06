'use client'
import React from 'react'
import { Lightbulb } from 'lucide-react'

const QuestionNote = () => {
  return (
    <div className="border rounded-lg p-5 bg-blue-100 mt-20">
      <h2 className="flex gap-2 items-center text-neutral-950">
        <Lightbulb />
        <strong>Note:</strong>
      </h2>
      <h2 className="text-sm text-neutral-950 my-2">
        {process.env.NEXT_PUBLIC_QUESTION_NOTE || 'No note available'}
      </h2>
    </div>
  )
}

export default QuestionNote
