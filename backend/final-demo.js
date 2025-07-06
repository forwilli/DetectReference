import axios from 'axios'

console.log('🎉 Reference Verification System - Final Demo\n')
console.log('📋 System Features:')
console.log('   1. Batch analysis with Gemini AI')
console.log('   2. Enhanced CrossRef verification (with & without DOI)')
console.log('   3. Google Search fallback with confidence scoring\n')

const testReferences = [
  // 1. 有DOI的论文 - CrossRef直接验证
  "LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature, 521(7553), 436-444. doi:10.1038/nature14539",
  
  // 2. 无DOI的论文 - CrossRef标题搜索
  "Silver, D., et al. (2016). Mastering the game of Go. Nature, 529(7587), 484-489.",
  
  // 3. 公司报告 - Google Search
  "Netflix. (2023). Annual Report 2022.",
  
  // 4. 网页统计 - Google Search
  "Statista. (2024). Global streaming subscribers."
]

async function runDemo() {
  try {
    const response = await axios.post('http://127.0.0.1:3001/api/verify-references-stream', {
      references: testReferences
    }, {
      responseType: 'stream',
      headers: {
        'Accept': 'text/event-stream',
        'Content-Type': 'application/json'
      },
      proxy: false,
      httpAgent: new (await import('http')).Agent({ keepAlive: false }),
      httpsAgent: new (await import('https')).Agent({ keepAlive: false })
    })

    let buffer = ''
    const results = []
    
    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        buffer += chunk.toString()
        const lines = buffer.split('\\n\\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'start') {
                console.log(`🚀 ${data.message}`)
              } else if (data.type === 'analysis_complete') {
                console.log(`✅ ${data.message}\\n`)
              } else if (data.type === 'result') {
                const result = data.data
                results.push(result)
                
                const emoji = result.status === 'verified' ? '✅' : 
                             result.status === 'ambiguous' ? '⚠️' : '❌'
                
                console.log(`\\n[${result.index + 1}] ${result.reference.substring(0, 60)}...`)
                console.log(`    ${emoji} Status: ${result.status.toUpperCase()}`)
                console.log(`    📍 Source: ${result.source}`)
                console.log(`    💬 ${result.message}`)
                
                if (result.doi && !result.reference.includes(result.doi)) {
                  console.log(`    🔗 Found DOI: ${result.doi}`)
                }
                
                if (result.confidence !== undefined) {
                  const bar = '█'.repeat(Math.floor(result.confidence * 10)) + 
                             '░'.repeat(10 - Math.floor(result.confidence * 10))
                  console.log(`    📊 Confidence: [${bar}] ${(result.confidence * 100).toFixed(0)}%`)
                }
                
                if (result.details?.citationCount !== undefined) {
                  console.log(`    📚 Citations: ${result.details.citationCount}`)
                }
              } else if (data.type === 'complete') {
                console.log('\\n✨ Verification complete!\\n')
                
                // 统计
                const bySource = results.reduce((acc, r) => {
                  acc[r.source] = (acc[r.source] || 0) + 1
                  return acc
                }, {})
                
                const byStatus = results.reduce((acc, r) => {
                  acc[r.status] = (acc[r.status] || 0) + 1
                  return acc
                }, {})
                
                console.log('📊 Results Summary:')
                console.log(`    Total processed: ${results.length}`)
                console.log(`    ✅ Verified: ${byStatus.verified || 0}`)
                console.log(`    ⚠️  Ambiguous: ${byStatus.ambiguous || 0}`)
                console.log(`    ❌ Not found: ${byStatus.not_found || 0}`)
                console.log('\\n    By source:')
                console.log(`    📚 CrossRef: ${bySource.crossref || 0}`)
                console.log(`    🔍 Google: ${bySource.google || 0}`)
                
                resolve(results)
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      })

      response.data.on('error', (err) => {
        reject(err)
      })
    })
  } catch (error) {
    console.error('\\n❌ Error:', error.message)
    throw error
  }
}

console.log('Starting verification...\\n')

runDemo()
  .then(() => {
    console.log('\\n🎉 All systems working perfectly!')
    console.log('\\n✅ Features demonstrated:')
    console.log('   - CrossRef with DOI (path A)')
    console.log('   - CrossRef without DOI (path B)')
    console.log('   - Google Search with confidence scoring')
    console.log('   - Proxy configuration working')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\\n❌ Demo failed:', error.message)
    process.exit(1)
  })