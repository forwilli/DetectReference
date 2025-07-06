import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function testGemini() {
  try {
    console.log('Testing Gemini API...')
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set')
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = 'Say hello'
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Response:', text)
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Full error:', error)
  }
}

testGemini()