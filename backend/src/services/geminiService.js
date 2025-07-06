import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const analyzeReference = async (reference) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-latest' })
    
    const prompt = `请分析以下学术参考文献，提取其中的关键信息。请以JSON格式返回，包含以下字段：
    - authors: 作者列表（数组）
    - title: 文章标题
    - year: 发表年份
    - journal: 期刊名称（如果有）
    - publisher: 出版社（如果有）
    - doi: DOI号（如果有）
    - url: URL（如果有）
    
    参考文献：${reference}
    
    注意：只返回JSON格式的数据，不要包含其他说明文字。`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    try {
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsedData = JSON.parse(cleanedText)
      return parsedData
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      throw new Error('Failed to parse reference information')
    }
  } catch (error) {
    console.error('Gemini API error:', error.message)
    console.error('Full error:', error)
    throw new Error(`Failed to analyze reference: ${error.message}`)
  }
}