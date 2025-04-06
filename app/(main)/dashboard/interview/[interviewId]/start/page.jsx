'use client'
import { db } from '@/utils/db'
import { MockInterview, UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import AIAvatar from './_components/_components/AIAvatar'
import moment from 'moment'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { useUser } from '@clerk/nextjs'
const StartInterview = ({ params }) => {
  const [interViewData, setInterviewData] = useState()
  const [voiceQuestions, setVoiceQuestions] = useState([])
  const [codingQuestions, setCodingQuestions] = useState([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const speechSynthesisUtterance = new SpeechSynthesisUtterance()

  const { user } = useUser()
  useEffect(() => {
    GetInterviewDetails()
  }, [])

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId))

    if (result.length === 0) return

    const jsonMockResp = JSON.parse(result[0].jsonMockResp)
    const voiceBased = jsonMockResp.filter((q) => q.type === 'text')
    const codingBased = jsonMockResp.filter((q) => q.type === 'coding')

    setVoiceQuestions(voiceBased)
    setCodingQuestions(codingBased)
    setInterviewData(result[0])
  }

  const toggleSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        speechSynthesisUtterance.text = text
        window.speechSynthesis.speak(speechSynthesisUtterance)
        setIsPlaying(true)
        speechSynthesisUtterance.onend = () => setIsPlaying(false)
      }
    } else {
      alert('Sorry, your browser does not support text to speech')
    }
  }

  const SaveUserAnswer = async () => {
    if (!userAnswer.trim()) {
      toast('Please enter an answer before saving.')
      return
    }

    setLoading(true)
    try {
      const feedbackPrompt = `Question: ${voiceQuestions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the given interview question, please provide a rating and feedback in JSON format with 'rating' and 'feedback' fields.`
      const result = await chatSession.sendMessage(feedbackPrompt)
      const mockJsonResp = result.response
        .text()
        .replace('```json', '')
        .replace('```', '')
      const JsonfeedbackResp = JSON.parse(mockJsonResp)

      await db.insert(UserAnswer).values({
        mockIdRef: interViewData?.mockId,
        question: voiceQuestions[activeQuestionIndex]?.question,
        correctAns: voiceQuestions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      })

      toast('User Answer recorded successfully')
      setUserAnswer('')
    } catch (error) {
      console.error('Error saving user answer:', error)
      toast('Failed to save answer. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="font-bold text-xl mb-5">
        Section 1: Voice-Based Answering
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col items-center gap-4">
          <AIAvatar isPlaying={isPlaying} />
          <QuestionsSection
            mockInterviewQuestion={voiceQuestions}
            activeQuestionIndex={activeQuestionIndex}
          />
          <div className="flex flex-col gap-4">
          <textarea
  className="w-[95%] p-2 border rounded"
  placeholder="Type your answer here..."
  value={userAnswer}
  onChange={(e) => setUserAnswer(e.target.value)}
  rows={5} // Adjust the number of rows as needed
/>
            <Button onClick={SaveUserAnswer} disabled={loading}>
              {loading ? 'Saving...' : 'Save & Get Feedback'}
            </Button>
          </div>
        </div>
        <RecordAnswerSection
          mockInterviewQuestion={voiceQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interViewData}
        />
      </div>
      <div className="mb-10 flex justify-end gap-4">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex < voiceQuestions.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex === voiceQuestions.length - 1 && (
          <Link href={`/dashboard/interview/${interViewData?.mockId}/coding`}>
            <Button>Next Section</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default StartInterview
