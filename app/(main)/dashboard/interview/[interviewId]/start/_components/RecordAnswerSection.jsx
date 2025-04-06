'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  })

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    )
  }, [results])

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer()
    }
  }, [userAnswer])

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      startSpeechToText()
    }
  }

  const UpdateUserAnswer = async () => {
    setLoading(true)

    const feedbackPrompt = `
You are a technical interview coach. Analyze this response constructively:

Question: "${mockInterviewQuestion[activeQuestionIndex]?.question}"
Key Concepts: "${mockInterviewQuestion[activeQuestionIndex]?.answer}"

Candidate's Answer: "${userAnswer}"

Evaluation Guidelines:
1. Identify covered concepts from Key Concepts
2. Note any valuable additions beyond Key Concepts
3. Highlight strengths before suggesting improvements

Rating Scale (0-10):
9-10: Excellent - Covers all key concepts with clear examples
7-8:  Strong - Covers most concepts, minor enhancements possible
5-6:  Good - Basic understanding, needs more depth
3-4:  Developing - Partial understanding, needs significant improvement
0-2:  Needs Work - Major gaps or inaccuracies

Provide JSON response:
{
  "rating": 0-10,
  "feedback": "Encouraging analysis starting with strengths, then constructive suggestions"
}

Examples:

Question: "Explain React hooks"
Key Concepts: ["state management", "lifecycle", "reusability"]
Answer: "Hooks like useState manage state in functional components"
{
  "rating": 8,
  "feedback": "Great job explaining state management! Well done using useState as an example. To strengthen your answer, you could mention useEffect for lifecycle management and custom hooks for reusability."
}

Question: "What is virtual DOM?"
Key Concepts: ["performance optimization", "diff algorithm", "efficient updates"]
Answer: "Virtual DOM helps optimize rendering through smart comparisons"
{
  "rating": 9,
  "feedback": "Excellent understanding of performance optimization! You've captured the core purpose. For full marks, mention the diff algorithm specifically and how it enables efficient updates."
}
`

    try {
      const result = await chatSession.sendMessage(feedbackPrompt)
      const responseText = result.response.text()
      
      // Improved JSON parsing
      const jsonString = responseText
        .replace(/(```json|```)/gi, '')
        .trim()
      
      const feedback = JSON.parse(jsonString)

      // Multiply AI rating by 2 and clamp between 0-10
      const baseRating = Math.round(Number(feedback.rating) || 0)
      const finalRating = Math.min(10, Math.max(0, baseRating * 2))

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: feedback?.feedback || 'Thank you for your answer!',
        rating: finalRating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      })

      toast.success(`Answer saved with rating: ${finalRating}/10!`)
      setUserAnswer('')
      setResults([])
    } catch (err) {
      console.error('Evaluation error:', err)
      toast.error('Analysis failed - answer saved with 5 rating')
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: 'Thank you for your answer! Our analysis system encountered an issue, but your response has been saved.',
        rating: 5,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      })
    } finally {
      setLoading(false)
    }
  }

  if (error) return <p className="text-red-500">Speech recognition not supported</p>

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden">
        <Webcam 
          mirrored={true}
          className="w-full h-full object-cover"
        />
      </div>

      <Button
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        className="gap-2 text-lg px-8 py-6 rounded-full"
        onClick={StartStopRecording}
        disabled={loading}
      >
        {isRecording ? (
          <>
            <StopCircle className="h-5 w-5" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="h-5 w-5" />
            Start Answering
          </>
        )}
      </Button>

      {userAnswer && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-2xl w-full">
          <h3 className="text-sm font-semibold mb-2">Current Answer:</h3>
          <p className="text-gray-600">{userAnswer}</p>
        </div>
      )}
    </div>
  )
}

export default RecordAnswerSection