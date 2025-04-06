import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Securely access the API key server-side
})

const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { errorDetails } = req.body

    try {
      // Create a prompt based on the error details
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Provide a user-friendly error message based on the following details: ${errorDetails}`,
        max_tokens: 50,
      })

      const message = response.data.choices[0].text.trim()
      res.status(200).json({ message })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch a response from OpenAI.' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
