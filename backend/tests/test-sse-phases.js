import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

import { analyzeReferencesBatch } from '../src/services/geminiServiceAxios.js'
import { verifyWithCrossRef } from '../src/services/crossrefService.js'

async function testPhases() {
  console.log('Testing three-phase verification process\n')
  
  const testReferences = [
    // 有DOI的期刊文章
    'Teece, D. J., Pisano, G., & Shuen, A. (1997). Dynamic capabilities and strategic management. Strategic Management Journal, 18(7), 509–533. https://doi.org/10.1002/(SICI)1097-0266(199708)18:7<509::AID-SMJ882>3.0.CO;2-Z',
    // 无DOI的期刊文章
    'Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99–120.',
    // 报告类型
    'Netflix, Inc. (2025). Form 10-K for the fiscal year ended December 31, 2024. U.S. Securities and Exchange Commission.',
    // 网页类型
    'Statista. (2024, January 25). Netflix paid subscribers count by region 2024. https://www.statista.com/statistics/1090122/netflix-global-subscribers-by-region/'
  ]
  
  try {
    // Phase 1: Batch Analysis
    console.log('PHASE 1: Batch Analysis with Gemini')
    console.log('====================================')
    const analyzed = await analyzeReferencesBatch(testReferences)
    
    analyzed.forEach((ref, idx) => {
      console.log(`\n${idx + 1}. ${ref.title}`)
      console.log(`   Type: ${ref.type}`)
      console.log(`   DOI: ${ref.doi || 'N/A'}`)
    })
    
    // Phase 2: Classification and CrossRef
    console.log('\n\nPHASE 2: Classification and CrossRef Verification')
    console.log('================================================')
    
    const crossrefCandidates = analyzed.filter(ref => 
      ref.doi || ref.type === 'journal_article' || ref.type === 'conference_paper'
    )
    
    console.log(`\nFound ${crossrefCandidates.length} candidates for CrossRef verification`)
    
    for (const ref of crossrefCandidates) {
      if (ref.doi) {
        console.log(`\nVerifying with CrossRef: ${ref.title}`)
        const result = await verifyWithCrossRef(ref.doi)
        
        if (result.status === 'verified') {
          console.log(`✅ VERIFIED via CrossRef`)
          console.log(`   DOI: ${result.doi}`)
          console.log(`   Citations: ${result.citationCount}`)
        } else {
          console.log(`❌ Not found in CrossRef: ${result.message}`)
        }
      } else {
        console.log(`\n⚠️  No DOI for: ${ref.title} (type: ${ref.type})`)
      }
    }
    
    // Phase 3 would be Google Search (not implemented in this test)
    console.log('\n\nPHASE 3: Google Search (for remaining references)')
    console.log('===============================================')
    const remaining = analyzed.filter(ref => 
      !ref.doi && ref.type !== 'journal_article' && ref.type !== 'conference_paper'
    )
    console.log(`${remaining.length} references would go to Google Search`)
    remaining.forEach(ref => {
      console.log(`- ${ref.title} (${ref.type})`)
    })
    
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

testPhases().catch(console.error)