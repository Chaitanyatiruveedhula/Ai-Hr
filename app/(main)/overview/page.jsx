import React from 'react'
// import { StickyScroll } from './ui/sticky-scroll-reveal'
import { FileText, Mic, Video, Star, ClipboardList } from 'lucide-react'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'

const content = [
  {
    title: '1. Submit Your Information',
    description:
      'Start by providing your preferred job role, detailed job description, and uploading your resume. This helps us tailor the interview specifically to your career goals and experience.',
    content: (
      <div className="h-full w-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center p-6">
        <FileText className="w-24 h-24 text-white opacity-80" />
      </div>
    ),
  },
  {
    title: '2. AI Question Generation',
    description:
      'Our advanced AI analyzes your inputs to generate relevant, industry-specific interview questions. Each question is crafted to assess your skills and experience effectively.',
    content: (
      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center p-6">
        <ClipboardList className="w-24 h-24 text-white opacity-80" />
      </div>
    ),
  },
  {
    title: '3. Record Your Responses',
    description:
      'Using your webcam and microphone, record your responses to each interview question. Our platform captures both video and audio to provide a comprehensive interview experience.',
    content: (
      <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center p-6 gap-4">
        <Video className="w-20 h-20 text-white opacity-80" />
        <Mic className="w-20 h-20 text-white opacity-80" />
      </div>
    ),
  },
  {
    title: '4. AI Feedback & Rating',
    description:
      'Receive detailed feedback and ratings on your responses. Our AI compares your answers with ideal responses, providing constructive feedback to help you improve your interview skills.',
    content: (
      <div className="h-full w-full bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center p-6">
        <Star className="w-24 h-24 text-white opacity-80" />
      </div>
    ),
  },
]

const InterviewOverview = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">How It Works</h1>
        <p className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto">
          Experience our AI-powered mock interview process. Follow these steps
          to practice and improve your interview skills with real-time feedback.
        </p>
        <StickyScroll content={content} />
      </div>
    </div>
  )
}
export default InterviewOverview
