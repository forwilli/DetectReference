// 前端调试书签代码
// 使用方法：在前端页面按F12打开控制台，粘贴这段代码并回车

(function() {
    console.log('🔍 Frontend Debug Tool Started');
    
    // 1. 检查React状态
    console.log('📊 Checking React components...');
    
    // 查找Verify按钮
    const verifyButton = document.querySelector('button');
    console.log('🔘 Verify button found:', !!verifyButton);
    if (verifyButton) {
        console.log('Button text:', verifyButton.textContent);
        console.log('Button disabled:', verifyButton.disabled);
    }
    
    // 查找文本输入框
    const textarea = document.querySelector('textarea');
    console.log('📝 Textarea found:', !!textarea);
    if (textarea) {
        console.log('Textarea value length:', textarea.value.length);
    }
    
    // 2. 检查控制台错误
    console.log('🚨 Checking for JavaScript errors...');
    
    // 重写console.error来捕获错误
    const originalError = console.error;
    const errors = [];
    console.error = function(...args) {
        errors.push(args);
        originalError.apply(console, args);
    };
    
    // 3. 模拟按钮点击
    setTimeout(() => {
        console.log('🖱️ Attempting to simulate button click...');
        
        if (textarea && verifyButton) {
            // 填入测试数据
            textarea.value = 'Adams, R.B. and Ferreira, D. (2009) "Women in the boardroom", Journal of Financial Economics, 94(2), pp. 291-309.';
            
            // 触发input事件
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            console.log('📝 Test data entered');
            
            setTimeout(() => {
                console.log('🔘 Clicking verify button...');
                verifyButton.click();
                
                setTimeout(() => {
                    console.log('📊 Post-click status:');
                    console.log('Button disabled:', verifyButton.disabled);
                    console.log('Button text:', verifyButton.textContent);
                    console.log('Errors captured:', errors);
                    
                    // 检查网络请求
                    if (window.performance && window.performance.getEntries) {
                        const entries = window.performance.getEntries();
                        const apiCalls = entries.filter(entry => 
                            entry.name.includes('verify-references')
                        );
                        console.log('🌐 API calls made:', apiCalls.length);
                        apiCalls.forEach(call => {
                            console.log('API call:', call.name, call.responseStatus);
                        });
                    }
                }, 2000);
            }, 1000);
        } else {
            console.log('❌ Required elements not found');
        }
    }, 1000);
    
    // 4. 监听网络请求
    console.log('🌐 Setting up network monitoring...');
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        console.log('📡 Fetch call:', args[0]);
        return originalFetch.apply(this, args)
            .then(response => {
                console.log('📨 Fetch response:', response.status, response.url);
                return response;
            })
            .catch(error => {
                console.log('❌ Fetch error:', error.message, args[0]);
                throw error;
            });
    };
    
    console.log('✅ Debug tool setup complete. Monitoring for 30 seconds...');
    
    // 5. 定期状态检查
    const statusCheck = setInterval(() => {
        console.log('⏰ Status check:', {
            buttons: document.querySelectorAll('button').length,
            textareas: document.querySelectorAll('textarea').length,
            errors: errors.length,
            url: window.location.href
        });
    }, 5000);
    
    setTimeout(() => {
        clearInterval(statusCheck);
        console.log('🏁 Debug session ended');
        
        // 恢复原始函数
        console.error = originalError;
        window.fetch = originalFetch;
    }, 30000);
    
})();