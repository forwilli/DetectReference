import https from 'https'
import { URL } from 'url'

const API_URL = 'https://detect-reference-backend.vercel.app'

// 测试用的参考文献列表（30个）
const testReferences = [
  "Adams, R.B. and Ferreira, D. (2009) 'Women in the boardroom and their impact on governance and performance', Journal of Financial Economics, 94(2), pp. 291-309.",
  "Bebchuk, L.A., Fried, J.M. and Walker, D.I. (2002) 'Managerial Power and Rent Extraction in the Design of Executive Compensation', The University of Chicago Law Review, 69(3), pp. 751-846.",
  "Brahma, S., Nwafor, C. and Boateng, A. (2021) 'Board gender diversity and firm performance: the UK evidence', International Journal of Finance and Economics, 26(4), pp. 5704-5719.",
  "Brown, M.E., Treviño, L.K. and Harrison, D.A. (2005) 'Ethical leadership: A social learning perspective for construct development and testing', Organizational Behavior and Human Decision Processes, 97(2), pp. 117-134.",
  "Eisenhardt, K.M. (1989) 'Agency Theory: An Assessment and Review', Academy of Management Review, 14(1), pp. 57-74.",
  "Aftab, J., Sarwar, H., Amin, A. and Kiran, A. (2022) 'Does CSR mediate the nexus of ethical leadership and employee's job performance? Evidence from North Italy SMEs', Social Responsibility Journal, 18(1), pp. 154-177.",
  "Bandura, A. (1977) Social Learning Theory. Englewood Cliffs, NJ: Prentice Hall.",
  "Blau, P.M. (1964) Exchange and Power in Social Life. New York: Wiley.",
  "Crane, A. and Matten, D. (2016) Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization. 4th edn. Oxford: Oxford University Press.",
  "Cunningham, G.M. and Harris, J.E. (2006) 'Enron and Arthur Andersen: The Case of the Crooked E and the Fallen A', Global Perspectives on Accounting Education, 3, pp. 27-48.",
  "De Roeck, K. and Farooq, O. (2018) 'Corporate social responsibility and ethical leadership: Investigating their interactive effect on employees' socially responsible behaviors', Journal of Business Ethics, 151(4), pp. 923-939.",
  "Freeman, R.E. (1984) Strategic Management: A Stakeholder Approach. Boston: Pitman.",
  "Jensen, M.C. and Meckling, W.H. (1976) 'Theory of the firm: Managerial behavior, agency costs and ownership structure', Journal of Financial Economics, 3(4), pp. 305-360.",
  "Kalshoven, K., Den Hartog, D.N. and De Hoogh, A.H. (2011) 'Ethical leadership at work questionnaire (ELW): Development and validation of a multidimensional measure', The Leadership Quarterly, 22(1), pp. 51-69.",
  "Kaptein, M. (2008) 'Developing and testing a measure for the ethical culture of organizations: the corporate ethical virtues model', Journal of Organizational Behavior, 29(7), pp. 923-947.",
  "Kohlberg, L. (1969) 'Stage and sequence: The cognitive-developmental approach to socialization', in Goslin, D.A. (ed.) Handbook of Socialization Theory and Research. Chicago: Rand McNally, pp. 347-480.",
  "Lumpkin, G.T. and Dess, G.G. (1996) 'Clarifying the entrepreneurial orientation construct and linking it to performance', Academy of Management Review, 21(1), pp. 135-172.",
  "Mayer, D.M., Kuenzi, M., Greenbaum, R., Bardes, M. and Salvador, R. (2009) 'How low does ethical leadership flow? Test of a trickle-down model', Organizational Behavior and Human Decision Processes, 108(1), pp. 1-13.",
  "Mitchell, R.K., Agle, B.R. and Wood, D.J. (1997) 'Toward a theory of stakeholder identification and salience: Defining the principle of who and what really counts', Academy of Management Review, 22(4), pp. 853-886.",
  "Neubert, M.J., Carlson, D.S., Kacmar, K.M., Roberts, J.A. and Chonko, L.B. (2009) 'The virtuous influence of ethical leadership behavior: Evidence from the field', Journal of Business Ethics, 90(2), pp. 157-170.",
  "Piccolo, R.F., Greenbaum, R., Hartog, D.N.D. and Folger, R. (2010) 'The relationship between ethical leadership and core job characteristics', Journal of Organizational Behavior, 31(2‐3), pp. 259-278.",
  "Podsakoff, P.M., MacKenzie, S.B., Lee, J.Y. and Podsakoff, N.P. (2003) 'Common method biases in behavioral research: a critical review of the literature and recommended remedies', Journal of Applied Psychology, 88(5), pp. 879-903.",
  "Resick, C.J., Hanges, P.J., Dickson, M.W. and Mitchelson, J.K. (2006) 'A cross-cultural examination of the endorsement of ethical leadership', Journal of Business Ethics, 63(4), pp. 345-359.",
  "Schminke, M., Ambrose, M.L. and Neubaum, D.O. (2005) 'The effect of leader moral development on ethical climate and employee attitudes', Organizational Behavior and Human Decision Processes, 97(2), pp. 135-151.",
  "Treviño, L.K., Hartman, L.P. and Brown, M. (2000) 'Moral person and moral manager: How executives develop a reputation for ethical leadership', California Management Review, 42(4), pp. 128-142.",
  "Walumbwa, F.O., Mayer, D.M., Wang, P., Wang, H., Workman, K. and Christensen, A.L. (2011) 'Linking ethical leadership to employee performance: The roles of leader–member exchange, self-efficacy, and organizational identification', Organizational Behavior and Human Decision Processes, 115(2), pp. 204-213.",
  "Yukl, G., Mahsud, R., Hassan, S. and Prussia, G.E. (2013) 'An improved measure of ethical leadership', Journal of Leadership & Organizational Studies, 20(1), pp. 38-48.",
  "Zhang, Y., Liu, G., Zhang, L., Xu, S., and Cheung, Y.M. (2021) 'An investigation of the relationship between CEO characteristics and firm performance in Chinese listed companies', Journal of Business Research, 132, pp. 182-192.",
  "Zhou, K.Z. and Li, C.B. (2012) 'How knowledge affects radical innovation: Knowledge base, market knowledge acquisition, and internal knowledge sharing', Strategic Management Journal, 33(9), pp. 1090-1102.",
  "Smith, J.A., Johnson, B.C., Williams, D.E. (2023) 'Artificial Intelligence in Corporate Governance: A Systematic Review', Journal of Management Information Systems, 40(2), pp. 456-489."
]

async function testStreamingEndpoint() {
  console.log('🧪 Testing streaming endpoint with', testReferences.length, 'references...')
  console.log('API URL:', API_URL)
  
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${API_URL}/api/verify-references-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ references: testReferences })
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ HTTP Error:', response.status, response.statusText)
      console.error('Error body:', errorText)
      return
    }
    
    console.log('✅ Stream started successfully. Reading events...\n')
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let eventCount = 0
    let resultCount = 0
    
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        console.log('\n📡 Stream ended')
        break
      }
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data.trim()) {
            try {
              const event = JSON.parse(data)
              eventCount++
              
              if (event.type === 'start') {
                console.log('🚀', event.message)
              } else if (event.type === 'analysis_complete') {
                console.log('🔍', event.message, `(${event.count} analyzed)`)
              } else if (event.type === 'result') {
                resultCount++
                const result = event.data
                const progress = event.progress
                console.log(`[${progress.current}/${progress.total}] ${result.status.toUpperCase()}: ${result.reference.substring(0, 80)}...`)
                console.log(`   📊 ${result.message} (${result.source})`)
              } else if (event.type === 'complete') {
                console.log('✅', event.message)
                console.log(`📈 Processed: ${event.processed}/${event.total}`)
              } else if (event.type === 'error') {
                console.log('❌ Error:', event.message)
              }
              
            } catch (e) {
              console.error('Failed to parse SSE data:', e.message)
              console.error('Raw data:', data.substring(0, 100) + '...')
            }
          }
        }
      }
    }
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    
    console.log('\n📊 Test Summary:')
    console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`)
    console.log(`📝 References sent: ${testReferences.length}`)
    console.log(`📨 Events received: ${eventCount}`)
    console.log(`✅ Results received: ${resultCount}`)
    console.log(`🎯 Success rate: ${((resultCount / testReferences.length) * 100).toFixed(1)}%`)
    console.log(`⚡ Average time per reference: ${(duration / testReferences.length).toFixed(2)}s`)
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Error details:', error)
  }
}

// 先测试简单的健康检查
async function testHealthCheck() {
  console.log('🔍 Testing health check...')
  try {
    const response = await fetch(`${API_URL}/api/test`)
    const data = await response.json()
    console.log('✅ Health check passed:', data)
    return true
  } catch (error) {
    console.error('❌ Health check failed:', error.message)
    return false
  }
}

// 运行测试
async function runAllTests() {
  console.log('='.repeat(60))
  console.log('🧪 LARGE BATCH REFERENCE VERIFICATION TEST')
  console.log('='.repeat(60))
  
  const healthOk = await testHealthCheck()
  if (!healthOk) {
    console.log('❌ Health check failed, aborting test')
    return
  }
  
  console.log()
  await testStreamingEndpoint()
  
  console.log('\n' + '='.repeat(60))
  console.log('🏁 Test completed')
  console.log('='.repeat(60))
}

runAllTests()