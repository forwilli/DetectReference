// 简单的后端测试，不依赖外部库

const testReferences = [
  "Adams, R.B. and Ferreira, D. (2009) 'Women in the boardroom and their impact on governance and performance', Journal of Financial Economics, 94(2), pp. 291-309.",
  "Bebchuk, L.A., Fried, J.M. and Walker, D.I. (2002) 'Managerial Power and Rent Extraction in the Design of Executive Compensation', The University of Chicago Law Review, 69(3), pp. 751-846.",
  "Brahma, S., Nwafor, C. and Boateng, A. (2021) 'Board gender diversity and firm performance: the UK evidence', International Journal of Finance and Economics, 26(4), pp. 5704-5719.",
  "Brown, M.E., Treviño, L.K. and Harrison, D.A. (2005) 'Ethical leadership: A social learning perspective for construct development and testing', Organizational Behavior and Human Decision Processes, 97(2), pp. 117-134.",
  "Eisenhardt, K.M. (1989) 'Agency Theory: An Assessment and Review', Academy of Management Review, 14(1), pp. 57-74."
]

console.log('🧪 Testing with', testReferences.length, 'references')
console.log('📝 Sample reference:', testReferences[0].substring(0, 80) + '...')

// 这个脚本模拟了前端会发送的请求
console.log('\n📊 Test payload:')
console.log('Method: POST')
console.log('URL: https://detect-reference-backend.vercel.app/api/verify-references-stream')
console.log('Content-Type: application/json')
console.log('Body size:', JSON.stringify({ references: testReferences }).length, 'bytes')

console.log('\n✅ Test script prepared. The backend should handle this request format.')
console.log('🔍 You can test this by using the frontend interface or curl command.')

// 生成 curl 命令用于测试
const curlCommand = `curl -X POST "https://detect-reference-backend.vercel.app/api/verify-references-stream" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ references: testReferences.slice(0, 2) })}' \\
  --no-buffer`

console.log('\n🚀 Curl command to test (first 2 references):')
console.log(curlCommand)