'use client'
import { useEffect, useState, useRef } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import Draggable from 'react-draggable'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

const languageOptions = [
  { name: 'JavaScript', value: 'javascript', judge0Id: 63 },
  { name: 'Python', value: 'python', judge0Id: 71 },
  { name: 'C++', value: 'cpp', judge0Id: 54 },
  { name: 'Java', value: 'java', judge0Id: 62 },
]

// Starter code for different languages
const starterCode = {
  javascript: `// Return the result\nfunction solution(input) {\n  return;\n}`,
  python: `# Return the result\ndef solution(input):\n  return`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint solution(string input) {\n  return 0;\n}`,
  java: `public class Solution {\n  public static int solution(String input) {\n    return 0;\n  }\n}`,
}

// Example coding questions
const codingQuestions = [
  {
    id: 1,
    question:
      "Given an array of integers 'nums' and an integer 'target', return the indices of the two numbers such that they add up to 'target'.",
    testCases: [
      { input: '[2,7,11,15]\n9', expected: '[0,1]' },
      { input: '[3,2,4]\n6', expected: '[1,2]' },
      { input: '[3,3]\n6', expected: '[0,1]' },
      { input: '[1,2,3,4]\n10', expected: '[]' },
    ],
  },
  {
    id: 2,
    question:
      "Given the 'head' of a singly linked list, reverse the list and return its head.",
    testCases: [
      { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: '[1,2]', expected: '[2,1]' },
      { input: '[1]', expected: '[1]' },
      { input: '[]', expected: '[]' },
    ],
  },
]

const CodingQuestionsPage = () => {
  const router = useRouter()
  const { interviewId } = useParams()
  console.log('Interview ID:', interviewId)
  const [activeIndex, setActiveIndex] = useState(0)
  const [code, setCode] = useState(starterCode.javascript)
  const [output, setOutput] = useState([])
  const [evaluation, setEvaluation] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [isRunning, setIsRunning] = useState(false)

  const videoRef = useRef(null)

  useEffect(() => {
    enableWebcam()
  }, [])

  const enableWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (error) {
      console.error('Webcam access denied:', error)
    }
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    const selectedLang = languageOptions.find(
      (lang) => lang.value === selectedLanguage
    )

    if (!selectedLang) {
      setOutput(['Invalid language selected.'])
      setIsRunning(false)
      return
    }

    const question = codingQuestions[activeIndex]
    let results = []
    let correct = true

    // Prepare the code execution template
    let wrappedCode = ''

    if (selectedLanguage === 'javascript') {
      wrappedCode = `
      ${code}
      const testCases = ${JSON.stringify(question.testCases)};
      console.log(testCases.map(tc => JSON.stringify(solution(JSON.parse(tc.input)))).join("\\n"));
    `
    } else if (selectedLanguage === 'python') {
      wrappedCode = `
      ${code}
      import json
      test_cases = ${JSON.stringify(question.testCases)}
      results = [json.dumps(solution(json.loads(tc["input"]))) for tc in test_cases]
      print("\\n".join(results))
    `
    } else if (selectedLanguage === 'cpp') {
      wrappedCode = `
      #include <iostream>
      #include <vector>
      #include <string>
      using namespace std;
      ${code}
      int main() {
          vector<string> testCases = ${JSON.stringify(
            question.testCases.map((tc) => tc.input)
          )};
          for (string input : testCases) {
              cout << solution(input) << "\\n";
          }
          return 0;
      }
    `
    } else if (selectedLanguage === 'java') {
      wrappedCode = `
      import java.util.*;
      public class Solution {
          ${code}
          public static void main(String[] args) {
              String[] testCases = ${JSON.stringify(
                question.testCases.map((tc) => tc.input)
              )};
              for (String input : testCases) {
                  System.out.println(solution(input));
              }
          }
      }
    `
    }

    try {
      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: wrappedCode,
          language_id: selectedLang.judge0Id,
        },
        {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key':
              '6435a5a709mshf5d257c985374a7p12dccejsne5e1945d44dc',
            'Content-Type': 'application/json',
          },
        }
      )

      const token = response.data.token

      // Polling for result
      let result = null
      while (!result || result.status.id <= 2) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const statusResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
              'X-RapidAPI-Key':
                '6435a5a709mshf5d257c985374a7p12dccejsne5e1945d44dc',
            },
          }
        )
        result = statusResponse.data
      }

      const userOutputs = result.stdout?.trim().split('\n') || []
      for (let i = 0; i < question.testCases.length; i++) {
        const expectedOutput = question.testCases[i].expected
        const userOutput = userOutputs[i] || ''

        results.push({
          input: question.testCases[i].input,
          expected: expectedOutput,
          output: userOutput,
        })

        if (userOutput !== expectedOutput) {
          correct = false
        }
      }
    } catch (error) {
      console.error('Error running code:', error)
      setOutput(['Error running code. Check your internet connection.'])
      setIsRunning(false)
      return
    }

    setOutput(results)
    setEvaluation(correct ? '✅ Correct' : '❌ Incorrect')
    setIsRunning(false)
  }

  const handleNextQuestion = () => {
    if (activeIndex < codingQuestions.length - 1) {
      setActiveIndex(activeIndex + 1)
      setCode(starterCode[selectedLanguage]) // Reset code for new question
      setOutput([])
      setEvaluation('')
    } else {
      // Redirect to feedback page
      router.push(`/dashboard/interview/' + ${interviewId} + '/feedback`)
    }
  }

  return (
    <div className="p-4 relative">
      <h2 className="font-bold text-lg mb-4">Coding Challenge</h2>

      {/* Draggable Webcam */}
      <Draggable>
        <div className="absolute top-5 right-5 w-40 h-40 bg-black rounded-md">
          <video ref={videoRef} autoPlay className="w-full h-full rounded-md" />
        </div>
      </Draggable>

      <p className="mb-2">{codingQuestions[activeIndex].question}</p>

      {/* Language Selection */}
      <div className="mb-3">
        <label className="mr-2">Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value)
            setCode(starterCode[e.target.value])
          }}
          className="p-2 border rounded"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <MonacoEditor
        height="300px"
        language={selectedLanguage}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || '')}
      />

      {/* Run & Evaluate */}
      <div className="mt-3 flex gap-3">
        <Button
          onClick={handleRunCode}
          className={`${
            isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'
          }`}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>
        <p className="text-sm">{evaluation}</p>
      </div>

      {/* Test Case Results */}
      <div className="mt-3">
        {output.map((res, idx) => (
          <div key={idx} className="p-2 bg-gray-800 text-white rounded-md mb-2">
            <strong>Input:</strong> {res.input} <br />
            <strong>Expected:</strong> {res.expected} <br />
            <strong>Output:</strong> {res.output}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Button onClick={handleNextQuestion} className="mt-4">
        {activeIndex < codingQuestions.length - 1
          ? 'Next Question'
          : 'End Session'}
      </Button>
    </div>
  )
}

export default CodingQuestionsPage
