#!/bin/bash

echo "🧪 Quick test with 2 references..."

# 测试数据 - 只测试2个参考文献
cat > test_payload.json << 'EOF'
{
  "references": [
    "Adams, R.B. and Ferreira, D. (2009) 'Women in the boardroom and their impact on governance and performance', Journal of Financial Economics, 94(2), pp. 291-309.",
    "Jensen, M.C. and Meckling, W.H. (1976) 'Theory of the firm: Managerial behavior, agency costs and ownership structure', Journal of Financial Economics, 3(4), pp. 305-360."
  ]
}
EOF

echo "📤 Sending request to Vercel..."
echo "URL: https://detect-reference-backend.vercel.app/api/verify-references-stream"
echo "Payload size: $(wc -c < test_payload.json) bytes"
echo "="

# 发送请求并显示响应
timeout 60 curl -X POST \
  "https://detect-reference-backend.vercel.app/api/verify-references-stream" \
  -H "Content-Type: application/json" \
  -d @test_payload.json \
  --no-buffer \
  -v

echo ""
echo "🏁 Test completed"

# 清理
rm test_payload.json