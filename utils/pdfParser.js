'use server'
import pdf from 'pdf-parse'

export async function extractTextFromPDF(arrayBuffer) {
  try {
    const buffer = Buffer.from(arrayBuffer)
    const data = await pdf(buffer)
    return data.text
  } catch (error) {
    console.error('Error extracting text:', error)
    throw new Error('Failed to extract text from PDF') // Re-throw the error
  }
}
