import axios from 'axios'

// 使用延迟加载模式获取配置
const getGeminiConfig = () => {
  const apiKey = process.env.GEMINI_API_KEY
  const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-flash-lite-preview-06-17'
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`
  
  return { apiKey, modelName, apiUrl }
}

export const analyzeReferencesBatch = async (references) => {
  try {
    const { apiKey, apiUrl } = getGeminiConfig()
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }
    
    console.log('Analyzing batch of references:', references.length)
    console.log('Gemini API Key:', apiKey ? `${apiKey.substring(0, 10)}... (${apiKey.length} chars)` : 'Not configured')
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
      `${apiUrl}?key=${apiKey}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
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