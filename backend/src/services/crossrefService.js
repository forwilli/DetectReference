import axios from 'axios'

const CROSSREF_API_URL = 'https://api.crossref.org/works'

export const verifyWithCrossRef = async (doi) => {
  if (!doi) {
    return {
      status: 'error',
      message: 'No DOI provided'
    }
  }

  try {
    console.log(`Verifying DOI with CrossRef: ${doi}`)
    
    // CrossRef API 不需要认证，但建议添加 User-Agent
    const response = await axios.get(`${CROSSREF_API_URL}/${doi}`, {
      headers: {
        'User-Agent': 'ReferenceVerifier/1.0 (mailto:support@example.com)'
      },
      timeout: 10000 // 10秒超时
    })

    const work = response.data.message
    
    // 提取关键信息
    const result = {
      status: 'verified',
      source: 'crossref',
      doi: work.DOI,
      title: work.title?.[0] || '',
      authors: extractAuthors(work.author),
      year: work.published?.['date-parts']?.[0]?.[0] || work.created?.['date-parts']?.[0]?.[0],
      journal: work['container-title']?.[0] || '',
      publisher: work.publisher || '',
      volume: work.volume || '',
      issue: work.issue || '',
      pages: work.page || '',
      url: work.URL || `https://doi.org/${work.DOI}`,
      citationCount: work['is-referenced-by-count'] || 0
    }
    
    console.log(`CrossRef verification successful for DOI: ${doi}`)
    return result
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`DOI not found in CrossRef: ${doi}`)
      return {
        status: 'not_found',
        source: 'crossref',
        message: 'DOI not found in CrossRef'
      }
    }
    
    console.error('CrossRef API error:', error.message)
    return {
      status: 'error',
      source: 'crossref',
      message: `CrossRef API error: ${error.message}`
    }
  }
}

// 辅助函数：提取作者信息
function extractAuthors(authors) {
  if (!authors || !Array.isArray(authors)) return []
  
  return authors.map(author => {
    if (author.family && author.given) {
      return `${author.family}, ${author.given}`
    } else if (author.name) {
      return author.name
    }
    return author.family || author.given || ''
  }).filter(name => name)
}

// 通过标题和作者搜索文献
export const findPaperOnCrossRef = async (referenceData) => {
  const { title, authors, year } = referenceData
  
  if (!title) {
    return {
      status: 'error',
      message: 'No title provided for search'
    }
  }
  
  try {
    console.log(`Searching CrossRef by metadata: ${title}`)
    
    // 构建查询字符串
    let query = title
    if (authors && authors.length > 0) {
      // 提取第一作者的姓
      const firstAuthor = authors[0]
      const authorLastName = firstAuthor.split(',')[0].split(' ').pop()
      query += ` ${authorLastName}`
    }
    
    // 构建查询URL
    const searchUrl = `${CROSSREF_API_URL}`
    const params = {
      'query.bibliographic': query,
      'rows': 5, // 获取前5个结果以提高匹配准确性
      'select': 'DOI,title,author,published-print,published-online,container-title,publisher,volume,issue,page,is-referenced-by-count,URL'
    }
    
    // 如果有年份，添加年份过滤
    if (year) {
      params['filter'] = `from-pub-date:${year},until-pub-date:${year}`
    }
    
    const response = await axios.get(searchUrl, {
      params,
      headers: {
        'User-Agent': 'ReferenceVerifier/1.0 (mailto:support@example.com)'
      },
      timeout: 10000
    })
    
    const items = response.data.message.items || []
    
    if (items.length === 0) {
      console.log('No results found in CrossRef search')
      return {
        status: 'not_found',
        source: 'crossref',
        message: 'No matching papers found in CrossRef'
      }
    }
    
    // 找到最佳匹配
    const bestMatch = findBestMatch(items, referenceData)
    
    if (bestMatch) {
      console.log(`Found best match in CrossRef: ${bestMatch.DOI}`)
      const work = bestMatch
      
      return {
        status: 'verified',
        source: 'crossref',
        doi: work.DOI,
        title: work.title?.[0] || '',
        authors: extractAuthors(work.author),
        year: work.published?.['date-parts']?.[0]?.[0] || work.created?.['date-parts']?.[0]?.[0],
        journal: work['container-title']?.[0] || '',
        publisher: work.publisher || '',
        volume: work.volume || '',
        issue: work.issue || '',
        pages: work.page || '',
        url: work.URL || `https://doi.org/${work.DOI}`,
        citationCount: work['is-referenced-by-count'] || 0,
        matchScore: bestMatch.matchScore
      }
    }
    
    return {
      status: 'not_found',
      source: 'crossref',
      message: 'No sufficiently matching papers found'
    }
    
  } catch (error) {
    console.error('CrossRef search error:', error.message)
    return {
      status: 'error',
      source: 'crossref',
      message: `CrossRef search error: ${error.message}`
    }
  }
}

// 找到最佳匹配的文献
function findBestMatch(items, referenceData) {
  const { title, authors, year } = referenceData
  const titleLower = title?.toLowerCase() || ''
  
  let bestMatch = null
  let bestScore = 0
  
  for (const item of items) {
    let score = 0
    
    // 标题匹配度（最重要）
    const itemTitle = item.title?.[0]?.toLowerCase() || ''
    if (itemTitle && titleLower) {
      // 计算标题相似度
      const titleWords = titleLower.split(/\s+/).filter(w => w.length > 2)
      const matchedWords = titleWords.filter(word => itemTitle.includes(word))
      const titleScore = titleWords.length > 0 ? matchedWords.length / titleWords.length : 0
      score += titleScore * 0.6 // 标题权重60%
      
      // 完全匹配加分
      if (itemTitle === titleLower) {
        score += 0.2
      }
    }
    
    // 作者匹配度
    if (authors && authors.length > 0 && item.author) {
      const authorMatched = authors.some(author => {
        const authorLastName = author.toLowerCase().split(',')[0].split(' ').pop()
        return item.author.some(itemAuthor => {
          const itemAuthorName = (itemAuthor.family || '').toLowerCase()
          return itemAuthorName.includes(authorLastName) || authorLastName.includes(itemAuthorName)
        })
      })
      if (authorMatched) {
        score += 0.3 // 作者权重30%
      }
    }
    
    // 年份匹配度
    if (year && item.published?.['date-parts']?.[0]?.[0]) {
      if (item.published['date-parts'][0][0] === parseInt(year)) {
        score += 0.1 // 年份权重10%
      }
    }
    
    // 只考虑得分超过阈值的匹配
    if (score > bestScore && score >= 0.5) {
      bestScore = score
      bestMatch = item
      bestMatch.matchScore = score
    }
  }
  
  return bestMatch
}

// 批量验证 DOI（优化性能）
export const verifyBatchWithCrossRef = async (dois) => {
  const results = await Promise.all(
    dois.map(doi => verifyWithCrossRef(doi))
  )
  return results
}