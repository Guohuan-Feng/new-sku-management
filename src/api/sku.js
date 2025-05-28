// src/api/sku.js
import axios from 'axios';

// common_url = https://ebay-oauth.onrender.com/JFJP/skus
const API_BASE_URL = 'https://ebay-oauth.onrender.com/JFJP/skus';

// 全局 Headers，主要用于需要 JSON Content-Type 和认证的请求
const baseJsonHeaders = {
  appKey: 'test-key', // 示例key，请替换为您的真实appKey
  appToken: 'test-token', // 示例token，请替换为您的真实appToken
  'Content-Type': 'application/json',
};

// Headers 仅包含认证，用于 GET 或 DELETE 等不需要 JSON body 的请求
const authHeadersOnly = {
  appKey: 'test-key', // 示例key
  appToken: 'test-token', // 示例token
};

// Headers 用于文件上传
const multipartFormHeaders = {
  appKey: 'test-key', // 示例key
  appToken: 'test-token', // 示例token
  // 'Content-Type': 'multipart/form-data' 会由 Axios/浏览器自动设置，这里不显式指定以避免问题
};

/**
 * 创建一个SKU
 * POST /JFJP/skus/create-sku
 */
export function createSku (data) {
  const payload = { ...data };
  for (const key in payload) {
    if (payload[key] === undefined) {
      delete payload[key];
    }
    if (key === 'allow_dropship_return' && typeof payload[key] === 'string') {
        payload[key] = payload[key].toLowerCase() === 'true';
    }
    // 根据需要，将其他应为数字但可能作为字符串从表单传入的字段转换为数字
    // 例如：
    // if (['status', 'ATS', 'shipping_lead_time', /* ...其他数字字段 */].includes(key) && payload[key] !== null && payload[key] !== undefined) {
    //   const numVal = parseFloat(payload[key]);
    //   if (!isNaN(numVal)) {
    //     payload[key] = numVal;
    //   }
    // }
  }
  // 端点: /JFJP/skus/create-sku
  return axios.post(`${API_BASE_URL}/create-sku`, payload, { headers: baseJsonHeaders });
}

/**
 * 通过上传CSV创建SKU（S）
 * POST /JFJP/skus/uploads
 */
export function uploadSkus(csvFile) {
  const formData = new FormData();
  formData.append('file', csvFile);
  // 端点: /JFJP/skus/uploads
  return axios.post(`${API_BASE_URL}/uploads`, formData, {
    headers: multipartFormHeaders, 
  });
}

/**
 * 删除一个SKU
 * DELETE /JFJP/skus/delete/{sku_id}
 */
export function deleteSku (sku_id) { // 参数名与路径参数匹配
  // 端点: /JFJP/skus/delete/{sku_id}
  return axios.delete(`${API_BASE_URL}/delete/${sku_id}`, { headers: authHeadersOnly });
}

/**
 * 查找一个SKU
 * GET /JFJP/skus/get-one-sku/{sku_id}
 */
export function getSku(sku_id) { // 参数名与路径参数匹配
  // 端点: /JFJP/skus/get-one-sku/{sku_id}
  return axios.get(`${API_BASE_URL}/get-one-sku/${sku_id}`, { headers: authHeadersOnly });
}

/**
 * 更新一个SKU
 * PUT /JFJP/skus/update/{sku_id}
 */
export function updateSku (sku_id, data) { // 第一个参数是 sku_id
  const payload = { ...data };
  for (const key in payload) {
    if (payload[key] === undefined) {
      delete payload[key];
    }
    if (key === 'allow_dropship_return' && typeof payload[key] === 'string') {
        payload[key] = payload[key].toLowerCase() === 'true';
    }
    // 同样，根据需要转换数字字段
  }
  // 端点: /JFJP/skus/update/{sku_id}
  return axios.put(`${API_BASE_URL}/update/${sku_id}`, payload, { headers: baseJsonHeaders });
}

/**
 * 获取所有SKU
 * GET /JFJP/skus/get-all-sku
 */
export function getAllSkus() {
  // 端点: /JFJP/skus/get-all-sku
  return axios.get(`${API_BASE_URL}/get-all-sku`, { headers: authHeadersOnly });
}