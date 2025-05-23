// src/api/aiService.js
import axios from 'axios';

// 更新后的后端API基础URL
const AI_API_BASE_URL = 'https://ebay-oauth.onrender.com/JFJP';

/**
 * 调用后端API生成产品描述
 * @param {object} productInfoForAPI - 包含产品信息的对象，键名应与后端API payload 一致。
 * 例如: { product_name: "...", brand: "...", category: "...", color: "...", size: "...", target_people: "..." }
 * @returns {Promise<object>} - 返回包含AI生成描述的对象, 例如 { description: "AI生成的描述..." } 或 { error: "错误信息" }
 */
export const fetchAIDescription = async (productInfoForAPI) => {
  // productInfoForAPI 的键名现在已经与后端 payload 一致，直接作为 payload 使用
  const payload = productInfoForAPI;

  try {
    // 确保 payload 的键名与后端API期望的完全一致
    const response = await axios.post(`${AI_API_BASE_URL}/AI_generate_desc`, payload, {
      headers: {
        'Content-Type': 'application/json',
        // 如果需要认证，添加认证头，例如:
        // 'Authorization': `Bearer YOUR_AUTH_TOKEN`,
      },
    });

    // 检查后端返回的数据结构
    if (response.data && response.data.description) {
      return { description: response.data.description };
    } else if (response.data && response.data.data && response.data.data.description) {
      return { description: response.data.data.description };
    } else if (typeof response.data === 'string' && response.data.trim() !== '') {
        return { description: response.data };
    } else {
      console.warn('AI service returned an unexpected data format:', response.data);
      return { error: 'AI服务返回了无效或空的描述数据格式。', description: '' };
    }
  } catch (error) {
    console.error('Error fetching AI description:', error.response || error.message);
    // 尝试从 error.response.data 中获取更详细的错误信息
    let detailedError = 'AI描述生成失败，请稍后再试。';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        detailedError = error.response.data;
      } else if (error.response.data.message) {
        detailedError = error.response.data.message;
      } else if (error.response.data.detail) {
        // FastAPI 通常在 error.response.data.detail 中提供错误信息
         if (Array.isArray(error.response.data.detail) && error.response.data.detail.length > 0) {
            detailedError = error.response.data.detail.map(err => `${err.loc ? err.loc.join('.')+': ' : ''}${err.msg}`).join('; ');
         } else if (typeof error.response.data.detail === 'string') {
            detailedError = error.response.data.detail;
         }
      } else {
        try {
            detailedError = JSON.stringify(error.response.data);
        } catch (e) {
            // 无法序列化，保持通用错误
        }
      }
    } else if (error.message) {
      detailedError = error.message;
    }
    return { error: detailedError, description: `AI描述生成出错: ${detailedError}` };
  }
};