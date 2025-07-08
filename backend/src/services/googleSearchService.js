import axios from 'axios'
import dotenv from 'dotenv'
// 移除代理导入

// 确保加载环境变量
dotenv.config()

// 延迟获取环境变量，确保在使用时才读取
const getGoogleSearchConfig = () => {
  return {
    apiKey: process.env.GOOGLE_SEARCH_API_KEY,
    cseId: process.env.GOOGLE_CSE_ID
  }
}

console.log('Google Search Service initialized')

// 置信度权重配置
const CONFIDENCE_WEIGHTS = {
  titleMatch: 0.35,        // 标题匹配权重
  authorMatch: 0.25,       // 作者匹配权重
  yearMatch: 0.15,         // 年份匹配权重
  sourceAuthority: 0.15,   // 来源权威性权重
  multipleEvidence: 0.10   // 多重证据权重
}

// 权威来源域名列表
const AUTHORITATIVE_SOURCES = {
  'scholar.google.com': 1.0,
  'ieee.org': 0.9,
  'acm.org': 0.9,
  'springer.com': 0.9,
  'sciencedirect.com': 0.9,
  'wiley.com': 0.9,
  'nature.com': 0.9,
  'jstor.org': 0.8,
  'academia.edu': 0.7,
  'researchgate.net': 0.7,
  'arxiv.org': 0.7,
  'sec.gov': 0.9,  // 对于财报
  'statista.com': 0.8,  // 对于统计数据
  'ofcom.org.uk': 0.9   // 对于政府报告
}

export const searchReference = async (referenceData) => {
  try {
    const { title, authors, year, journal, doi, url: refUrl, publisher, type } = referenceData
    
    // 构建搜索查询 - 首先尝试精确搜索
    let searchQuery = ''
    if (title) {
      // 清理标题中的特殊字符
      const cleanTitle = title.replace(/&/g, 'and').replace(/[:]/g, ' ').replace(/[^\w\s,.-]/g, ' ').replace(/\s+/g, ' ').trim()
      searchQuery += cleanTitle + ' '
    }
    if (authors && authors.length > 0) {
      const cleanAuthor = authors[0].replace(/[^\w\s.-]/g, ' ').replace(/\s+/g, ' ').trim()
      searchQuery += cleanAuthor + ' '
    }
    if (year) searchQuery += year + ' '
    if (journal) {
      const cleanJournal = journal.replace(/&/g, 'and').replace(/[:]/g, ' ').replace(/[^\w\s,.-]/g, ' ').replace(/\s+/g, ' ').trim()
      searchQuery += cleanJournal + ' '
    }
    if (doi) searchQuery += 'doi:' + doi

    console.log('Search query:', searchQuery.trim())
    
    let response = await searchForReference(searchQuery.trim(), 10) // Google API 免费版最多10个结果
    
    // 如果精确搜索没有结果，尝试更宽松的搜索
    if (response.length === 0 && title) {
      console.log('No results with exact search, trying relaxed search...')
      
      // 基于文献类型调整搜索策略
      let relaxedQuery = ''
      
      if (type === 'webpage' || type === 'report') {
        // 对于网页和报告，使用更灵活的搜索
        const cleanTitle = title.replace(/&/g, 'and').replace(/[:]/g, ' ').replace(/[^\w\s.-]/g, ' ').trim()
        const keyWords = cleanTitle.split(' ').filter(w => w.length > 4).slice(0, 4).join(' ')
        relaxedQuery = keyWords
        if (year) relaxedQuery += ` ${year}`
        
        // 如果有特定域名，添加域名作为关键词
        if (refUrl) {
          try {
            const domain = new URL(refUrl).hostname
            // 不使用 site: 操作符，因为可能不被 CSE 支持
            const siteName = domain.replace('www.', '').split('.')[0]
            if (siteName && siteName.length > 2) {
              relaxedQuery += ` ${siteName}`
            }
          } catch (e) {
            // 忽略无效URL
          }
        }
      } else {
        // 学术文献使用标准策略
        const cleanTitle = title.replace(/&/g, 'and').replace(/[:]/g, ' ').replace(/[^\w\s.-]/g, ' ').trim()
        const titleWords = cleanTitle.split(' ').filter(w => w.length > 3)
        const keyWords = titleWords.slice(0, 5).join(' ')
        relaxedQuery = keyWords
        if (authors && authors.length > 0) {
          const cleanAuthor = authors[0].replace(/[^\w\s.-]/g, ' ').trim()
          relaxedQuery += ` ${cleanAuthor}`
        }
        if (year) relaxedQuery += ` ${year}`
      }
      
      console.log('Relaxed search query:', relaxedQuery)
      response = await searchForReference(relaxedQuery, 10)
    }
    
    // 使用新的置信度评分系统处理结果
    return processSearchResultsWithConfidence(response, referenceData)
  } catch (error) {
    console.error('Google Search API error:', error)
    throw new Error('Failed to search for reference')
  }
}

// 执行搜索的辅助函数
const searchForReference = async (searchQuery, numResults) => {
  // 在使用时获取配置
  const { apiKey, cseId } = getGoogleSearchConfig()
  
  if (!apiKey || !cseId) {
    console.error('Google Search API credentials not found')
    console.error('API Key:', apiKey ? '✓ Present' : '✗ Missing')
    console.error('CSE ID:', cseId ? '✓ Present' : '✗ Missing')
    throw new Error('Search API not configured')
  }
  
  // 最小查询长度检查
  if (!searchQuery || searchQuery.trim().length < 3) {
    console.log('Query too short, skipping search:', searchQuery)
    return []
  }
  
  console.log('Making direct Google Search request (no proxy)')
  
  const url = 'https://www.googleapis.com/customsearch/v1'
  const params = {
    key: apiKey,
    cx: cseId,
    q: searchQuery,
    num: numResults
  }

  try {
    const config = {
      params,
      timeout: 3000,  // 3秒超时，适合Vercel 10秒限制
      headers: {
        'Connection': 'close'  // 避免socket hang up问题
      }
    }
    
    console.log(`Making Google Search request with 3s timeout for: ${searchQuery}`)
    
    const response = await axios.get(url, config)
    console.log(`Google Search completed successfully for: ${searchQuery}`)
    return response.data.items || []
  } catch (error) {
    // 处理超时错误
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      console.error(`Google Search request timed out after 3s for query: ${searchQuery}`)
      return []
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused to Google API')
      return []
    }
    
    // 处理网络错误
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
      console.error(`Network error (${error.code}) for Google Search:`, searchQuery)
      return []
    }
    
    // 处理API限制
    if (error.response?.status === 429) {
      console.error('Google Search API rate limited. Query:', searchQuery)
      return []
    }
    
    if (error.response?.status === 400) {
      console.error('Bad request to Google Search API. Query:', searchQuery)
      console.error('Error details:', JSON.stringify(error.response.data, null, 2))
      return []
    }
    
    if (error.response?.status === 403) {
      console.error('Google Search API access denied. Check API key and permissions.')
      return []
    }
    
    console.error('Google Search API error:', error.message, 'Query:', searchQuery)
    return []
  }
}

// 新的基于置信度的处理函数
const processSearchResultsWithConfidence = (results, referenceData) => {
  const { title, authors, year, journal, doi, url: refUrl, publisher, type } = referenceData
  
  if (results.length === 0) {
    return {
      status: 'not_found',
      confidence: 0,
      message: 'No search results found',
      evidence: []
    }
  }

  const titleLower = title ? title.toLowerCase().trim() : ''
  const evidenceList = []
  
  // 分析每个搜索结果并计算置信度分数
  for (const result of results) {
    const evidence = analyzeSearchResult(result, referenceData)
    if (evidence.totalScore > 0.3) { // 只考虑有意义的证据
      evidenceList.push(evidence)
    }
  }
  
  // 按置信度分数排序
  evidenceList.sort((a, b) => b.totalScore - a.totalScore)
  
  // 计算综合置信度
  const overallConfidence = calculateOverallConfidence(evidenceList)
  
  // 根据置信度和证据确定状态
  let status, message
  let foundDoi = null
  
  if (overallConfidence >= 0.75) {
    status = 'verified'
    message = 'Verified with high confidence'
    
    // 尝试从最佳证据中提取DOI
    if (!doi && evidenceList.length > 0) {
      foundDoi = evidenceList[0].doi
    }
  } else if (overallConfidence >= 0.5) {
    status = 'ambiguous'
    message = 'Ambiguous - partial matches found'
  } else {
    status = 'not_found'
    message = 'Not found or low confidence'
  }
  
  const response = {
    status,
    confidence: overallConfidence,
    message,
    evidence: evidenceList.slice(0, 3).map(e => ({
      url: e.url,
      score: e.totalScore,
      matches: e.matches
    }))
  }
  
  if (foundDoi) {
    response.doi = foundDoi
    response.message += ` - DOI: ${foundDoi}`
  }
  
  return response
}

// 分析单个搜索结果
const analyzeSearchResult = (result, referenceData) => {
  const { title, authors, year, type } = referenceData
  const resultTitle = result.title || ''
  const resultSnippet = result.snippet || ''
  const resultUrl = result.link || ''
  const combinedText = `${resultTitle} ${resultSnippet}`.toLowerCase()
  
  const evidence = {
    url: resultUrl,
    title: resultTitle,
    snippet: resultSnippet,
    scores: {},
    matches: [],
    totalScore: 0
  }
  
  // 1. 标题匹配分数（使用更智能的匹配）
  const titleScore = calculateTitleSimilarity(title, combinedText)
  evidence.scores.title = titleScore
  if (titleScore > 0.5) {
    evidence.matches.push('title')
  }
  
  // 2. 作者匹配分数
  if (authors && authors.length > 0) {
    const authorScore = calculateAuthorMatch(authors, combinedText)
    evidence.scores.author = authorScore
    if (authorScore > 0.5) {
      evidence.matches.push('author')
    }
  }
  
  // 3. 年份匹配分数
  if (year) {
    const yearMatch = combinedText.includes(year.toString())
    evidence.scores.year = yearMatch ? 1.0 : 0.0
    if (yearMatch) {
      evidence.matches.push('year')
    }
  }
  
  // 4. 来源权威性分数
  const authorityScore = calculateSourceAuthority(resultUrl)
  evidence.scores.authority = authorityScore
  
  // 5. 提取DOI（如果存在）
  const doiMatch = combinedText.match(/10\.\d{4,}(?:\.\d+)*\/[-._;()\/:a-zA-Z0-9]+/i)
  if (doiMatch) {
    evidence.doi = doiMatch[0]
    evidence.matches.push('doi')
  }
  
  // 计算加权总分
  evidence.totalScore = 
    (evidence.scores.title || 0) * CONFIDENCE_WEIGHTS.titleMatch +
    (evidence.scores.author || 0) * CONFIDENCE_WEIGHTS.authorMatch +
    (evidence.scores.year || 0) * CONFIDENCE_WEIGHTS.yearMatch +
    (evidence.scores.authority || 0) * CONFIDENCE_WEIGHTS.sourceAuthority
  
  return evidence
}

// 计算标题相似度（使用更智能的算法）
const calculateTitleSimilarity = (originalTitle, searchText) => {
  if (!originalTitle) return 0
  
  const titleLower = originalTitle.toLowerCase()
  const titleWords = titleLower.split(' ').filter(w => w.length > 2)
  
  // 检查完整标题
  if (searchText.includes(titleLower)) {
    return 1.0
  }
  
  // 检查关键词匹配
  const matchedWords = titleWords.filter(word => searchText.includes(word))
  const wordMatchRatio = titleWords.length > 0 ? matchedWords.length / titleWords.length : 0
  
  // 检查连续词组匹配（更高权重）
  let phraseBonus = 0
  for (let i = 0; i < titleWords.length - 2; i++) {
    const phrase = titleWords.slice(i, i + 3).join(' ')
    if (searchText.includes(phrase)) {
      phraseBonus = 0.2
      break
    }
  }
  
  return Math.min(wordMatchRatio + phraseBonus, 1.0)
}

// 计算作者匹配分数
const calculateAuthorMatch = (authors, searchText) => {
  let maxScore = 0
  
  for (const author of authors) {
    const authorLower = author.toLowerCase()
    const lastName = authorLower.split(',')[0].split(' ').pop()
    
    if (searchText.includes(authorLower)) {
      maxScore = 1.0
    } else if (searchText.includes(lastName)) {
      maxScore = Math.max(maxScore, 0.7)
    }
  }
  
  return maxScore
}

// 计算来源权威性
const calculateSourceAuthority = (url) => {
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    
    // 检查是否是已知的权威来源
    for (const [authDomain, score] of Object.entries(AUTHORITATIVE_SOURCES)) {
      if (domain.includes(authDomain)) {
        return score
      }
    }
    
    // 对于edu域名给予基础信任
    if (domain.endsWith('.edu')) {
      return 0.6
    }
    
    // 对于gov域名给予较高信任
    if (domain.endsWith('.gov')) {
      return 0.8
    }
    
    return 0.3 // 默认基础分数
  } catch {
    return 0.3
  }
}

// 计算综合置信度
const calculateOverallConfidence = (evidenceList) => {
  if (evidenceList.length === 0) return 0
  
  // 最高分数的权重最大
  const topScore = evidenceList[0].totalScore
  
  // 多重证据加成
  let multipleEvidenceBonus = 0
  if (evidenceList.length >= 3 && evidenceList[2].totalScore > 0.5) {
    multipleEvidenceBonus = CONFIDENCE_WEIGHTS.multipleEvidence
  }
  
  // 如果有多个高质量证据，增加置信度
  const highQualityCount = evidenceList.filter(e => e.totalScore > 0.6).length
  const consistencyBonus = highQualityCount > 1 ? 0.1 : 0
  
  return Math.min(topScore + multipleEvidenceBonus + consistencyBonus, 1.0)
}