import axios from 'axios'
import dotenv from 'dotenv'
import { httpsAgent } from '../config/agent.js'

// 确保加载环境变量
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-flash-lite-preview-06-17'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`

console.log('Gemini API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No')

export const analyzeReferencesBatch = async (references) => {
  try {
    console.log('Analyzing batch of references:', references.length)
    const requestData = {
      contents: [{
        parts: [{
          text: `请分析以下 JSON 数组中每一篇学术参考文献，为每一项提取关键信息。请以一个 JSON 对象的数组形式返回，每个对象包含以下字段：
- originalReference: 原始的参考文献字符串
- authors: 作者列表（数组）
- title: 文章标题
- year: 发表年份
- journal: 期刊名称（如果有）
- publisher: 出版社（如果有）
- doi: DOI号（如果有，请务必提取）
- url: URL（如果有）
- type: 文献类型（例如: 'journal_article', 'book', 'report', 'webpage', 'conference_paper', 'other'）

参考文献数组：
${JSON.stringify(references)}

注意：严格按照请求的 JSON 数组格式返回，不要包含任何额外的说明文字。`
        }]
      }]
    }

    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        httpsAgent: httpsAgent
      }
    )

    const text = response.data.candidates[0].content.parts[0].text
    
    try {
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsedData = JSON.parse(cleanedText)
      
      // 确保返回的是数组
      if (!Array.isArray(parsedData)) {
        throw new Error('Expected array response from Gemini')
      }
      
      console.log(`Successfully parsed ${parsedData.length} references`)
      return parsedData
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      throw new Error('Failed to parse reference information')
    }
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message)
    console.error('Status:', error.response?.status)
    console.error('Full error response:', JSON.stringify(error.response?.data, null, 2))
    throw new Error(`Failed to analyze references: ${error.message}`)
  }
}

// 保留原有的单个分析函数以保持向后兼容
export const analyzeReference = async (reference) => {
  const results = await analyzeReferencesBatch([reference])
  return results[0]
}