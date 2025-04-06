'use client'
import React from 'react'

// interface QuestionNumberProps {
//   index: number
//   activeQuestionIndex: number
// }

const QuestionNumber = ({ index, activeQuestionIndex }) => {
  console.log(index, activeQuestionIndex)
  return (
    <h2
      className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
        activeQuestionIndex === index && 'bg-blue-700 text-white'
      }`}
    >
      Question #{index + 1}
    </h2>
  )
}

export default QuestionNumber
