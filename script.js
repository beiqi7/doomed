// 全局变量
let uploadedImages = [];
let isGenerating = false;

// DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultImages = document.getElementById('resultImages');
const resultInfo = document.getElementById('resultInfo');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeEventListeners();
        loadApiKey();
        updateGenerateButton();
        
        // 检查是否在Vercel环境中
        if (window.location.hostname.includes('vercel.app')) {
            console.log('运行在Vercel环境中');
        }
    } catch (error) {
        console.error('初始化失败:', error);
        showError('页面初始化失败，请刷新页面重试');
    }
});

// 事件监听器初始化
function initializeEventListeners() {
    // 文件上传相关
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // 生成按钮
    generateBtn.addEventListener('click', handleGenerate);

    // 表单验证
    document.getElementById('prompt').addEventListener('input', updateGenerateButton);
    document.getElementById('apiKey').addEventListener('input', updateGenerateButton);
    document.getElementById('apiKey').addEventListener('input', saveApiKey);
}

// 拖拽处理
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

// 文件选择处理
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

// 处理文件
function processFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showError('请选择有效的图片文件');
        return;
    }

    if (uploadedImages.length + imageFiles.length > 10) {
        showError('最多只能上传10张图片');
        return;
    }

    imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                file: file,
                dataUrl: e.target.result,
                name: file.name
            };
            uploadedImages.push(imageData);
            updateImagePreview();
            updateGenerateButton();
        };
        reader.readAsDataURL(file);
    });
}

// 更新图片预览
function updateImagePreview() {
    imagePreview.innerHTML = '';
    
    uploadedImages.forEach((imageData, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        previewItem.innerHTML = `
            <img src="${imageData.dataUrl}" alt="${imageData.name}">
            <button class="remove-btn" onclick="removeImage(${index})">×</button>
        `;
        
        imagePreview.appendChild(previewItem);
    });
}

// 移除图片
function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
    updateGenerateButton();
}

// 更新生成按钮状态
function updateGenerateButton() {
    const prompt = document.getElementById('prompt').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const hasImages = uploadedImages.length > 0;
    
    const canGenerate = prompt && apiKey && hasImages && !isGenerating;
    generateBtn.disabled = !canGenerate;
}

// 生成图片
async function handleGenerate() {
    if (isGenerating) return;
    
    const prompt = document.getElementById('prompt').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!prompt || !apiKey || uploadedImages.length === 0) {
        showError('请填写所有必需字段并上传至少一张图片');
        return;
    }

    isGenerating = true;
    updateGenerateButton();
    hideError();
    hideResult();

    try {
        // 配置FAL客户端
        fal.config({
            credentials: apiKey
        });

        // 上传图片到FAL存储
        const imageUrls = await uploadImagesToFal();

        // 准备请求参数
        const requestParams = {
            input: {
                prompt: prompt,
                image_urls: imageUrls,
                image_size: document.getElementById('imageSize').value,
                num_images: parseInt(document.getElementById('numImages').value),
                enable_safety_checker: document.getElementById('enableSafetyChecker').checked || false
            }
        };

        // 添加种子（如果提供）
        const seed = document.getElementById('seed').value.trim();
        if (seed) {
            requestParams.input.seed = parseInt(seed);
        }

        // 显示加载状态
        showLoading();

        // 调用FAL API
        const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/edit", requestParams);

        // 显示结果
        showResult(result);
        
        // 显示成功消息
        showSuccessMessage(`成功生成 ${result.data?.images?.length || 0} 张图片！`);
        
    } catch (error) {
        console.error('生成失败:', error);
        showError(`生成失败: ${error.message || '未知错误'}`);
    } finally {
        isGenerating = false;
        updateGenerateButton();
        hideLoading();
    }
}

// 上传图片到FAL存储
async function uploadImagesToFal() {
    const uploadPromises = uploadedImages.map(async (imageData) => {
        try {
            // 将Data URL转换为File对象
            const response = await fetch(imageData.dataUrl);
            const blob = await response.blob();
            const file = new File([blob], imageData.name, { type: blob.type });
            
            // 上传到FAL存储
            const url = await fal.storage.upload(file);
            return url;
        } catch (error) {
            console.error('上传图片失败:', error);
            throw new Error(`上传图片 ${imageData.name} 失败: ${error.message}`);
        }
    });

    return await Promise.all(uploadPromises);
}

// 显示结果
function showResult(result) {
    resultSection.style.display = 'block';
    resultImages.innerHTML = '';
    
    if (result.data && result.data.images) {
        result.data.images.forEach((image, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            resultItem.innerHTML = `
                <img src="${image.url}" alt="生成结果 ${index + 1}" loading="lazy">
            `;
            
            resultImages.appendChild(resultItem);
        });
    }

    // 显示结果信息
    resultInfo.innerHTML = `
        <strong>生成信息：</strong><br>
        请求ID: ${result.requestId || 'N/A'}<br>
        种子: ${result.data?.seed || 'N/A'}<br>
        生成时间: ${new Date().toLocaleString()}
    `;

    // 滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 显示错误
function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// 显示成功消息
function showSuccessMessage(message) {
    // 移除现有的成功消息
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // 插入到结果区域之前
    resultSection.parentNode.insertBefore(successDiv, resultSection);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// 隐藏错误
function hideError() {
    errorSection.style.display = 'none';
}

// 隐藏结果
function hideResult() {
    resultSection.style.display = 'none';
}

// 显示加载状态
function showLoading() {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    btnLoading.classList.add('loading');
}

// 隐藏加载状态
function hideLoading() {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    btnLoading.classList.remove('loading');
}

// 保存API Key到本地存储
function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value;
    if (apiKey) {
        localStorage.setItem('fal_api_key', apiKey);
    }
}

// 从本地存储加载API Key
function loadApiKey() {
    const savedApiKey = localStorage.getItem('fal_api_key');
    if (savedApiKey) {
        document.getElementById('apiKey').value = savedApiKey;
    }
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 工具函数：验证图片尺寸
function validateImageSize(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            if (this.width < 1024 || this.height < 1024) {
                reject(new Error(`图片尺寸过小，最小支持1024x1024像素，当前为${this.width}x${this.height}像素`));
            } else {
                resolve();
            }
        };
        img.onerror = () => reject(new Error('无法读取图片文件'));
        img.src = URL.createObjectURL(file);
    });
}

// 增强的文件处理，包含尺寸验证
function processFilesWithValidation(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showError('请选择有效的图片文件');
        return;
    }

    if (uploadedImages.length + imageFiles.length > 10) {
        showError('最多只能上传10张图片');
        return;
    }

    // 验证每个图片文件
    const validationPromises = imageFiles.map(file => 
        validateImageSize(file).then(() => file).catch(error => {
            showError(error.message);
            return null;
        })
    );

    Promise.all(validationPromises).then(validFiles => {
        const validImageFiles = validFiles.filter(file => file !== null);
        
        validImageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    file: file,
                    dataUrl: e.target.result,
                    name: file.name
                };
                uploadedImages.push(imageData);
                updateImagePreview();
                updateGenerateButton();
            };
            reader.readAsDataURL(file);
        });
    });
}
