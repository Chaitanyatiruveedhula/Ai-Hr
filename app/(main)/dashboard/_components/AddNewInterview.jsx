'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { FileUpload } from '../../../../components/ui/file-upload'
// import { extractTextFromPDF } from './utils/pdfParser'
import { extractTextFromPDF } from '../../../../utils/pdfParser.js'
function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobExperience, setJobExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [jsonResponse, setJsonResponse] = useState([])
  const [resumeContent, setResumeContent] = useState('')
  const { user } = useUser()
  const router = useRouter()

  const handleFileUpload = async (files) => {
    // if (files && files.length > 0) {
    //   const file = files[0]
    //   try {
    //     let text = ''
    //     if (file.type === 'text/plain') {
    //       text = await file.text()
    //     } else if (file.type === 'application/pdf') {
    //       setPdfError('') // Clear any previous PDF errors
    //       const arrayBuffer = await file.arrayBuffer()
    //       text = await extractTextFromPDF(arrayBuffer)
    //     } else {
    //       throw new Error(
    //         'Unsupported file type. Please upload a TXT or PDF file.'
    //       )
    //     }
    //     setResumeContent(text)
    //   } catch (error) {
    //     console.error('Error processing file:', error)
    //     setPdfError(`Failed to process PDF: ${error.message}`) // Set an error message
    //     setResumeContent('') // Clear existing content
    //   }
    // }
    console.log('okay')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const inputPrompt = `
Job position: ${jobPosition}
Job Description: ${jobDescription}

Based on the job position, generate 17 interview questions.
Include at least 2 data structure and algorithm based medium level coding questions.

Ensure that the output is valid JSON, strictly formatted as follows:
[
  {
    "question": "Your question here",
    "answer": "Your answer here",
    "type": "text"
  },
  {
    "question": "Coding question (provide code stub)",
    "answer": "Expected code solution",
    "language": "javascript",
    "type": "coding"
  }
]
Only return the JSON array, nothing else.
`

    try {
      const result = await chatSession.sendMessage(inputPrompt)
      const responseText = await result.response.text()

      console.log('Raw AI Response:', responseText)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in the response')
      }

      const jsonResponsePart = jsonMatch[0].trim()
      console.log('Extracted JSON:', jsonResponsePart)

      let mockResponse
      try {
        mockResponse = JSON.parse(jsonResponsePart)
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        throw new Error('Invalid JSON format received from AI')
      }

      setJsonResponse(mockResponse)
      const jsonString = JSON.stringify(mockResponse)

      const res = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: jsonString,
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
        })
        .returning({ mockId: MockInterview.mockId })

      console.log('Database Insert Result:', res)

      setLoading(false)

      if (res.length > 0 && res[0]?.mockId) {
        router.push(`dashboard/interview/${res[0]?.mockId}`)
      } else {
        console.error('Database insert did not return a valid mockId')
      }
    } catch (error) {
      console.error('Error fetching interview questions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className="font-bold text-lg text-center">+ Add New</h1>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job Interview
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <p>
                  Add details about your job position/role, job description, and
                  years of experience
                </p>
                <div className="mt-7 my-3 space-y-2">
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div className="my-3 space-y-2">
                  <label>Job Description/Tech Stack (In short)</label>
                  <Textarea
                    placeholder="Ex. React, Angular, NodeJs, MySql etc"
                    required
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                {/* <div className="my-3 space-y-2">
                  <label>Years of Experience</label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    min="1"
                    max="70"
                    required
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div> */}
                <div className="my-3 space-y-2">
                  <label>Upload your Resume (TXT or PDF)</label>
                  <div className="mb-44 w-full h-52 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <FileUpload onChange={handleFileUpload} />
                  </div>
                </div>
              </div>
              <div className="flex gap-5 mt-10 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Generating from
                      AI
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview
