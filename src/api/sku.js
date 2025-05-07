// src/api/sku.js
import axios from 'axios';
// 移除了 uuidv4，因为 ID 将由后端提供
// let skuList = [...]; // 移除此模拟数据

const API_BASE_URL = 'https://ebay-oauth.onrender.com/JFJP/skus';

const headers = {
  appKey: 'test-key',
  appToken: 'test-token',
  'Content-Type': 'application/json',
};

// 使用本地数据的 getSkus 函数应该被移除或更新。
// 为清晰起见，我们假设 SKUPage.jsx 将直接使用 getAllSkus。

export function createSku (data) {
  const payload = {
    name: data.name,
    packageType: data.packageType,
    sku: data.sku,
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
  return axios.post(`${API_BASE_URL}/create-sku`, payload, { headers });
}

export function updateSku (id, data) {
  const payload = {
    name: data.name,
    packageType: data.packageType,
    sku: data.sku,
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
  // 确保 'id' 是来自后端的整数 ID
  return axios.put(`${API_BASE_URL}/update/${id}`, payload, { headers });
}

export function deleteSku (id) {
  // 确保 'id' 是来自后端的整数 ID
  return axios.delete(`${API_BASE_URL}/delete/${id}`, { headers });
}

export function uploadSkus(csvFile) {
  const formData = new FormData();
  formData.append('file', csvFile);
  return axios.post(`${API_BASE_URL}/uploads`, formData, {
    headers: {
      // 根据 sku_api.py，此端点仍需要 appKey 和 appToken
      appKey: headers.appKey,
      appToken: headers.appToken,
      'Content-Type': 'multipart/form-data', // Axios 会自动设置 boundary
    },
  });
}

export function getSku(skuId) {
  // 确保 'skuId' 是来自后端的整数 ID
  return axios.get(`${API_BASE_URL}/get-one-sku/${skuId}`, { headers });
}

export function getAllSkus() {
  return axios.get(`${API_BASE_URL}/get-all-sku`, { headers });
}