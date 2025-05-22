// src/api/aiService.js
import axios from 'axios';

// 预期的后端API基础URL - 您拿到实际API后需要替换这里
const AI_API_BASE_URL = 'YOUR_BACKEND_AI_API_ENDPOINT_HERE'; // 例如: 'https://api.example.com/ai'

/**
 * 调用后端API生成产品描述
 * @param {object} productInfo - 包含产品信息的对象。
 * 键名应与后端API期望的一致。
 * 例如: { productName: "...", brand: "...", category: "...", keyFeatures: "...", targetAudience: "..." }
 * @returns {Promise<object>} - 返回包含AI生成描述的对象, 例如 { description: "AI生成的描述..." } 或 { error: "错误信息" }
 */
export const fetchAIDescription = async (productInfo) => {
  // --- 这是API调用的占位符 ---
  // 当您获得后端API后，请取消下面的注释并根据实际情况修改：
  /*
  try {
    // 确保 productInfo 的键名与后端API期望的完全一致
    const response = await axios.post(`${AI_API_BASE_URL}/generate-description`, productInfo, {
      headers: {
        'Content-Type': 'application/json',
        // 如果需要认证，添加认证头，例如:
        // 'Authorization': `Bearer YOUR_AUTH_TOKEN`,
      },
    });
    if (response.data && response.data.description) {
      return { description: response.data.description };
    } else {
      // 如果后端返回的成功结构不是 { description: "..." }，需要调整
      return { error: 'AI服务返回了无效的数据格式。', description: '' };
    }
  } catch (error) {
    console.error('Error fetching AI description:', error.response || error.message);
    const errorMessage = error.response?.data?.message || error.message || 'AI描述生成失败，请稍后再试。';
    return { error: errorMessage, description: `AI描述生成出错: ${errorMessage}` };
  }
  */

  // --- 当前的模拟实现 ---
  console.log('Simulating AI API call with productInfo:', productInfo);
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据输入信息模拟一个简单的描述
      let mockDescription = `这是一款卓越的 ${productInfo.productName || '产品'}，由 ${productInfo.brand || '知名品牌'} 精心打造。`;
      mockDescription += `\n它属于 ${productInfo.category || '广受欢迎的'} 分类，呈现出迷人的 ${productInfo.color || '经典'} 色，尺寸为 ${productInfo.size || '通用'}。`;
      
      if (productInfo.keyFeatures && productInfo.keyFeatures.trim() !== "") {
        mockDescription += `\n\n主要特性包括：\n`;
        const features = productInfo.keyFeatures.split('\n').filter(f => f.trim() !== "");
        features.forEach(f => {
          mockDescription += `- ${f.trim()}\n`;
        });
      }
      
      if (productInfo.targetAudience && productInfo.targetAudience.trim() !== "") {
        mockDescription += `\n这款产品特别适合 ${productInfo.targetAudience.trim()}。`;
      }
      
      mockDescription += "\n\n(这是一个由前端模拟生成的描述，用于演示目的。请替换为真实的API调用。)";
      
      // 模拟可能发生的错误
      // if (productInfo.productName && productInfo.productName.toLowerCase().includes("error")) {
      //   resolve({ error: "模拟的AI服务错误：产品名称包含 'error'。", description: '' });
      //   return;
      // }

      resolve({ description: mockDescription });
    }, 1500); // 模拟网络延迟
  });
  // --- 模拟实现结束 ---
};
