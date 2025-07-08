// React 18 诊断脚本
console.log('🔍 React 18 Deep Diagnosis');

// 1. 检查React版本和状态
console.log('1️⃣ React version check...');
if (window.React) {
    console.log('React version:', window.React.version);
} else {
    console.log('React not found in window object');
}

// 2. 检查React 18的新fiber结构
console.log('2️⃣ Checking React 18 fiber structure...');
const root = document.getElementById('root');
if (root) {
    console.log('Root element found');
    
    // React 18 使用不同的内部属性
    const reactFiber = root._reactInternalFiber || 
                      root.__reactInternalInstance || 
                      root._reactInternalInstance ||
                      Object.keys(root).find(key => key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance'));
    
    console.log('React fiber key found:', reactFiber);
    
    // 检查所有React相关的属性
    const reactKeys = Object.keys(root).filter(key => key.includes('react') || key.includes('React'));
    console.log('All React-related keys:', reactKeys);
}

// 3. 检查按钮的React事件处理
console.log('3️⃣ Checking button React event handlers...');
const buttons = document.querySelectorAll('button');
buttons.forEach((btn, i) => {
    console.log(`Button ${i} (${btn.textContent.trim()}):`);
    
    // 检查React事件处理器
    const reactKeys = Object.keys(btn).filter(key => key.includes('react') || key.includes('React') || key.startsWith('__'));
    console.log('  React keys:', reactKeys);
    
    // 检查事件监听器
    if (btn.onclick) {
        console.log('  Has onclick:', typeof btn.onclick);
    }
    
    // 尝试获取React props
    const reactProps = btn._owner || btn.__reactProps || btn._reactInternalFiber;
    console.log('  React props found:', !!reactProps);
});

// 4. 尝试手动触发React事件
console.log('4️⃣ Testing manual React event triggering...');
const verifyButton = Array.from(buttons).find(btn => 
    btn.textContent.includes('Verify References') && !btn.disabled
);

if (verifyButton) {
    console.log('Found active verify button');
    
    // 尝试不同的事件触发方式
    setTimeout(() => {
        console.log('Testing different event trigger methods...');
        
        // 方法1: 原生点击
        console.log('Method 1: Native click');
        verifyButton.click();
        
        setTimeout(() => {
            // 方法2: React合成事件
            console.log('Method 2: React synthetic event');
            const syntheticEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            verifyButton.dispatchEvent(syntheticEvent);
            
            setTimeout(() => {
                // 方法3: 直接调用可能的React处理器
                console.log('Method 3: Looking for React handler');
                const reactKey = Object.keys(verifyButton).find(key => key.includes('react'));
                if (reactKey) {
                    console.log('Found React key:', reactKey);
                    const reactInstance = verifyButton[reactKey];
                    console.log('React instance:', reactInstance);
                }
                
                // 检查最终状态
                setTimeout(() => {
                    console.log('Final button state:', {
                        text: verifyButton.textContent.trim(),
                        disabled: verifyButton.disabled
                    });
                    
                    // 检查是否有加载状态变化
                    const loadingButton = Array.from(buttons).find(btn => 
                        btn.textContent.includes('loading') || btn.textContent.includes('verifying') || btn.disabled
                    );
                    console.log('Found loading state button:', !!loadingButton);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

// 5. 检查Zustand store状态
console.log('5️⃣ Checking Zustand store...');
// 尝试通过全局对象找到store
if (window.__ZUSTAND_STORE__) {
    console.log('Found Zustand store in window');
} else {
    console.log('Zustand store not found in window');
}

console.log('✅ React diagnosis complete');