// src/api/sku.js
import axios from 'axios';

const API_BASE_URL = 'https://ebay-oauth.onrender.com/JFJP/skus';

// 全局 Headers，主要用于需要 JSON Content-Type 和认证的请求
const baseJsonHeaders = {
  appKey: 'test-key',
  appToken: 'test-token',
  'Content-Type': 'application/json',
};

// Headers 仅包含认证，用于 GET 或 DELETE 等不需要 JSON body 的请求（如果后端需要认证）
const authHeadersOnly = {
  appKey: 'test-key',
  appToken: 'test-token',
};

// Headers 用于文件上传
const multipartFormHeaders = {
  appKey: 'test-key',
  appToken: 'test-token',
  // 'Content-Type': 'multipart/form-data' 会由 Axios/浏览器自动设置，这里不显式指定以避免问题
};


export function createSku (data) {
  const payload = {
    name: data.name,
    packageType: data.packageType,
    sku: data.sku,
    // 对于可选字段，如果值为 undefined，则不应包含在 payload 中，
    // 以便后端 Pydantic 可以使用默认值 (None)
    // 如果值为 null 或 ""，则发送，让后端校验器处理
    capacity: data.capacity,
    capacityUnit: data.capacityUnit,
    code: data.code,
    gMax: data.gMax,
    gMin: data.gMin,
    goodsValue: data.goodsValue,
    gw: data.gw,
    height: data.height,
    length: data.length,
    vol: data.vol,
    width: data.width,
  };

  // 清理 payload 中值为 undefined 的属性
  for (const key in payload) {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  }

  return axios.post(`${API_BASE_URL}/create-sku`, payload, { headers: baseJsonHeaders });
}

export function updateSku (id, data) {
  // 构建基础 payload，包含必填/核心字段
  const payload = {
    name: data.name,          // 假设 name 是必填或总是和表单数据一致
    packageType: data.packageType, // 假设 packageType 是必填
    sku: data.sku,
    goodsValue: data.goodsValue,            // 假设 sku 是必填
  };

  const optionalFields = [
    'capacity', 'capacityUnit', 'code', 'gMax', 'gMin',
    'gw', 'height', 'length', 'vol', 'width'
  ];

  optionalFields.forEach(field => {
    // 只有当字段在传入的 data 对象中实际存在 (hasOwnProperty)
    // 并且其值不是 undefined 时，我们才将其加入 payload。
    // 如果值是 null 或 ""，我们依然发送，依赖后端的 "before" 校验器。
    if (data.hasOwnProperty(field) && data[field] !== undefined) {
      payload[field] = data[field];
    }
    // 如果字段在 data 中不存在，或者值为 undefined，它将不会被包含在 payload 中。
    // 这对于 PATCH 类型的更新（只更新提供的字段）是理想的。
    // 对于 PUT，如果后端期望所有字段，那么前端表单应确保所有字段都有值（或合适的空值表示）。
    // 鉴于您后端 update_sku 使用了 payload.model_dump(exclude_unset=True)，
    // 这种不发送 undefined 字段的方式是兼容的。
  });

  return axios.put(`${API_BASE_URL}/update/${id}`, payload, { headers: baseJsonHeaders });
}

export function deleteSku (id) {
  // 假设后端的 delete 路由需要认证 Headers
  return axios.delete(`${API_BASE_URL}/delete/${id}`, { headers: authHeadersOnly });
}

export function uploadSkus(csvFile) {
  const formData = new FormData();
  formData.append('file', csvFile);
  return axios.post(`${API_BASE_URL}/uploads`, formData, {
    headers: multipartFormHeaders, // 使用为文件上传准备的 Headers
  });
}

export function getSku(skuId) {
  // 假设后端的 get-one-sku 路由需要认证 Headers (如果不需要，则移除 headers 或使用空对象)
  // 根据您提供的 sku_api.py，此路由目前没有 Header 依赖。
  // 如果确实不需要，可以这样写: return axios.get(`${API_BASE_URL}/get-one-sku/${skuId}`);
  return axios.get(`${API_BASE_URL}/get-one-sku/${skuId}`, { headers: authHeadersOnly });
}

export function getAllSkus() {
  // 假设后端的 get-all-sku 路由需要认证 Headers (如果不需要，则移除 headers 或使用空对象)
  // 根据您提供的 sku_api.py，此路由目前没有 Header 依赖。
  // 如果确实不需要，可以这样写: return axios.get(`${API_BASE_URL}/get-all-sku`);
  return axios.get(`${API_BASE_URL}/get-all-sku`, { headers: authHeadersOnly });
}