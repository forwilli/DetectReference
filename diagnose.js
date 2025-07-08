// 前端问题诊断脚本
// 请在前端页面的浏览器控制台中粘贴并运行这段代码

console.log('🔍 Frontend Diagnosis Started');

// 1. 检查基本元素
console.log('1️⃣ Checking basic elements...');
const buttons = document.querySelectorAll('button');
const textareas = document.querySelectorAll('textarea');
console.log(`Found ${buttons.length} buttons, ${textareas.length} textareas`);

if (buttons.length > 0) {
    buttons.forEach((btn, i) => {
        console.log(`Button ${i}:`, {
            text: btn.textContent.trim(),
            disabled: btn.disabled,
            onClick: !!btn.onclick,
            hasEventListeners: !!btn._reactInternalFiber || !!btn.__reactInternalInstance
        });
    });
}

// 2. 检查React状态
console.log('2️⃣ Checking React state...');
try {
    // 尝试找到React组件
    const reactRoot = document.querySelector('#root');
    if (reactRoot) {
        console.log('React root found');
        const reactInstance = reactRoot._reactInternalFiber || reactRoot.__reactInternalInstance;
        console.log('React instance:', !!reactInstance);
    }
} catch (e) {
    console.log('React check error:', e.message);
}

// 3. 检查网络功能
console.log('3️⃣ Testing network connectivity...');
fetch('https://detect-reference-backend.vercel.app/api/test')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Backend connectivity test passed:', data);
    })
    .catch(error => {
        console.log('❌ Backend connectivity test failed:', error.message);
    });

// 4. 模拟按钮点击
console.log('4️⃣ Attempting to simulate button interaction...');
setTimeout(() => {
    const verifyButton = Array.from(buttons).find(btn => 
        btn.textContent.includes('Verify') || btn.textContent.includes('验证')
    );
    
    if (verifyButton) {
        console.log('Found verify button:', verifyButton.textContent);
        
        // 填入测试数据
        if (textareas.length > 0) {
            textareas[0].value = 'Test reference (2023) "Test title", Test Journal, 1(1), pp. 1-10.';
            textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
            textareas[0].dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Test data entered into textarea');
            
            setTimeout(() => {
                console.log('Clicking verify button...');
                verifyButton.click();
                
                setTimeout(() => {
                    console.log('Post-click button state:', {
                        text: verifyButton.textContent.trim(),
                        disabled: verifyButton.disabled
                    });
                }, 1000);
            }, 500);
        }
    } else {
        console.log('❌ Verify button not found');
    }
}, 1000);

// 5. 监听事件
console.log('5️⃣ Setting up event monitoring...');
const originalAddEventListener = Element.prototype.addEventListener;
let eventCount = 0;

Element.prototype.addEventListener = function(type, listener, options) {
    if (type === 'click' && this.tagName === 'BUTTON') {
        eventCount++;
        console.log(`Event listener ${eventCount} added to button:`, this.textContent.trim(), 'Type:', type);
    }
    return originalAddEventListener.call(this, type, listener, options);
};

console.log('🎯 Diagnosis setup complete. Watch for results...');