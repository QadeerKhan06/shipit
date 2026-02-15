import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

export const genAI = new GoogleGenerativeAI(apiKey)

// Models
export const flashModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0,
  }
})

// Flash model configured for JSON output
export const flashModelJSON = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0,
    responseMimeType: 'application/json',
  }
})
