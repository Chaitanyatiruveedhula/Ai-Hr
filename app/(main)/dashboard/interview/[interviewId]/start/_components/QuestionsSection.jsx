'use client'
import React, { useState } from 'react'

// import AudioControl from './AudioControl'
import QuestionNumber from './QuestionNumber'
import QuestionNote from './QuestionNote'
import AudioControl from './AudioControl'

const QuestionsSection = ({
  mockInterviewQuestion = [],
  activeQuestionIndex = 0,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        const speech = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(speech)
        setIsPlaying(true)
      }
    } else {
      alert('Sorry, your browser does not support text to speech')
    }
  }

  return (
    <div className="p-5 border rounded-lg my-10">
      {mockInterviewQuestion.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mockInterviewQuestion.map((_, index) => (
              <QuestionNumber
                key={index}
                index={index}
                activeQuestionIndex={activeQuestionIndex}
              />
            ))}
          </div>
          <h2 className="my-5 text-md md:text-lg">
            {mockInterviewQuestion[activeQuestionIndex]?.question ||
              'No question available'}
          </h2>
          <AudioControl
            isPlaying={isPlaying}
            onToggle={() =>
              toggleSpeech(
                mockInterviewQuestion[activeQuestionIndex]?.question || ''
              )
            }
          />
          <QuestionNote />
        </>
      ) : (
        <h2 className="text-center text-red-500">No questions available</h2>
      )}
    </div>
  )
}

export default QuestionsSection
