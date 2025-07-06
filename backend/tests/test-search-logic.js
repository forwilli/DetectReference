// 模拟测试搜索逻辑
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

// 模拟搜索结果来测试匹配逻辑
const mockSearchResults = {
  netflix10k: [
    {
      title: "Netflix, Inc. Form 10-K Annual Report 2024",
      snippet: "Form 10-K for the fiscal year ended December 31, 2024. Netflix, Inc. filed with the U.S. Securities and Exchange Commission",
      link: "https://investor.netflix.com/financials/sec-filings/default.aspx"
    },
    {
      title: "Netflix 2024 Annual Report (10-K)",
      snippet: "Read Netflix's latest Form 10-K filing for fiscal year 2024, filed in 2025 with the SEC",
      link: "https://www.sec.gov/Archives/edgar/data/1065280/000106528025000123/nflx-20241231.htm"
    }
  ],
  ofcom: [
    {
      title: "Media Nations 2023 - Ofcom",
      snippet: "Media Nations Report 2023. Published by Ofcom on August 2023. A comprehensive report on UK media landscape",
      link: "https://www.ofcom.org.uk/research-and-data/multi-sector-research/media-nations-2023"
    }
  ],
  statista: [
    {
      title: "Netflix subscribers worldwide 2024 | Statista",
      snippet: "Netflix paid subscribers count by region 2024. As of Q4 2024, Netflix had over 260 million paid subscribers worldwide",
      link: "https://www.statista.com/statistics/1090122/netflix-global-subscribers-by-region/"
    }
  ],
  barney: [
    {
      title: "Firm Resources and Sustained Competitive Advantage",
      snippet: "Barney, J. (1991). Journal of Management, 17(1), 99-120. This paper presents a framework for understanding sources of sustained competitive advantage",
      link: "https://josephmahoney.web.illinois.edu/BA545_Fall%202022/Barney,%20(1991).pdf"
    }
  ]
}

// 从googleSearchService.js复制processSearchResults函数逻辑
const processSearchResults = (results, referenceData, hasUrl) => {
  const { title, authors, year, journal, doi, url: refUrl, publisher } = referenceData
  
  if (results.length === 0) {
    return {
      status: 'not_found',
      message: 'No matching results found'
    }
  }

  const titleLower = title ? title.toLowerCase().trim() : ''
  const firstAuthorLower = authors && authors.length > 0 ? authors[0].toLowerCase().trim() : ''
  const firstAuthorLastName = firstAuthorLower ? firstAuthorLower.split(',')[0].split(' ').pop() : ''

  // 第一步：严格的标题匹配
  let titleMatchedResults = []
  
  for (const result of results) {
    const resultTitle = result.title || ''
    const resultSnippet = result.snippet || ''
    const resultUrl = result.link || ''
    const combinedText = `${resultTitle} ${resultSnippet}`.toLowerCase()

    // 检查标题是否匹配（至少50%的标题内容）
    const titleWords = titleLower.split(' ').filter(w => w.length > 2)
    const matchedWords = titleWords.filter(word => combinedText.includes(word))
    const titleMatchRatio = titleWords.length > 0 ? matchedWords.length / titleWords.length : 0
    
    if (titleMatchRatio >= 0.5) {
      titleMatchedResults.push({
        result,
        resultUrl,
        combinedText,
        titleMatchRatio
      })
    }
  }

  // 如果没有标题匹配的结果，直接返回未找到
  if (titleMatchedResults.length === 0) {
    return {
      status: 'not_found',
      message: 'No matching title found'
    }
  }

  // 第二步：在标题匹配的结果中验证其他字段
  for (const { result, resultUrl, combinedText } of titleMatchedResults) {
    let mismatches = []
    
    // 检查作者
    if (authors && authors.length > 0) {
      const authorFound = authors.some(author => {
        const authorLastName = author.toLowerCase().split(',')[0].split(' ').pop()
        return combinedText.includes(authorLastName)
      })
      if (!authorFound) {
        mismatches.push('author')
      }
    }
    
    // 检查年份
    if (year) {
      if (!combinedText.includes(year.toString())) {
        mismatches.push('year')
      }
    }
    
    // 检查期刊（如果是学术文献）
    if (journal && !hasUrl) {
      const journalLower = journal.toLowerCase()
      const journalWords = journalLower.split(' ').filter(w => w.length > 2)
      const journalMatch = journalWords.some(word => combinedText.includes(word))
      if (!journalMatch) {
        mismatches.push('journal')
      }
    }
    
    // 检查DOI
    if (doi) {
      if (!combinedText.includes(doi.toLowerCase())) {
        mismatches.push('DOI')
      }
    }
    
    // 检查出版社（如果有）
    if (publisher && !hasUrl) {
      const publisherLower = publisher.toLowerCase()
      const publisherWords = publisherLower.split(' ').filter(w => w.length > 2)
      const publisherMatch = publisherWords.some(word => combinedText.includes(word))
      if (!publisherMatch) {
        mismatches.push('publisher')
      }
    }
    
    // 如果所有字段都匹配，返回验证成功
    if (mismatches.length === 0) {
      return {
        status: 'verified',
        url: resultUrl,
        message: 'Reference verified'
      }
    }
    
    // 如果有不匹配的字段，返回第一个最接近的结果和不匹配信息
    if (mismatches.length > 0) {
      return {
        status: 'mismatch',
        message: `Title found but ${mismatches.join(', ')} mismatch`,
        url: resultUrl,
        mismatches: mismatches
      }
    }
  }
  
  // 不应该到达这里，但以防万一
  return {
    status: 'not_found',
    message: 'Reference could not be verified'
  }
}

// 测试用例
const testCases = [
  {
    name: "Netflix 10-K - 应该验证成功",
    reference: {
      title: "Form 10-K for the fiscal year ended December 31, 2024",
      authors: ["Netflix, Inc."],
      year: "2025",
      publisher: "U.S. Securities and Exchange Commission",
      url: "https://s22.q4cdn.com/959853165/files/doc_financials/2024/ar/Netflix-10-K-01272025.pdf"
    },
    mockResults: mockSearchResults.netflix10k,
    hasUrl: true,
    expected: 'verified'
  },
  {
    name: "Ofcom Report - 应该验证成功",
    reference: {
      title: "Media Nations Report 2023",
      authors: ["Ofcom"],
      year: "2023",
      url: "https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/multi-sector/media-nations/2023/media-nations-2023-uk"
    },
    mockResults: mockSearchResults.ofcom,
    hasUrl: true,
    expected: 'verified'
  },
  {
    name: "Statista - 应该验证成功",
    reference: {
      title: "Netflix paid subscribers count by region 2024",
      authors: ["Statista"],
      year: "2024",
      publisher: "Statista",
      url: "https://www.statista.com/statistics/1090122/netflix-global-subscribers-by-region/"
    },
    mockResults: mockSearchResults.statista,
    hasUrl: true,
    expected: 'verified'
  },
  {
    name: "Barney学术文献 - 应该验证成功",
    reference: {
      title: "Firm resources and sustained competitive advantage",
      authors: ["Barney, J."],
      year: "1991",
      journal: "Journal of Management"
    },
    mockResults: mockSearchResults.barney,
    hasUrl: false,
    expected: 'verified'
  },
  {
    name: "年份不匹配的情况",
    reference: {
      title: "Media Nations Report 2023",
      authors: ["Ofcom"],
      year: "2022",  // 错误的年份
      url: "https://www.ofcom.org.uk"
    },
    mockResults: mockSearchResults.ofcom,
    hasUrl: true,
    expected: 'mismatch'
  },
  {
    name: "标题完全不匹配",
    reference: {
      title: "Some Random Title That Does Not Exist",
      authors: ["Unknown Author"],
      year: "2023"
    },
    mockResults: mockSearchResults.ofcom,
    hasUrl: false,
    expected: 'not_found'
  }
]

console.log('测试改进的搜索匹配逻辑\n')

for (const testCase of testCases) {
  console.log(`\n测试: ${testCase.name}`)
  console.log('输入:', JSON.stringify(testCase.reference, null, 2))
  
  const result = processSearchResults(testCase.mockResults, testCase.reference, testCase.hasUrl)
  console.log('结果:', JSON.stringify(result, null, 2))
  
  const passed = result.status === testCase.expected
  console.log(`期望: ${testCase.expected}, 实际: ${result.status} - ${passed ? '✅ 通过' : '❌ 失败'}`)
}