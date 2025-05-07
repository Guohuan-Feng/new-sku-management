// src/api/sku.js
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

let skuList = [
  { id: uuidv4(), sku: 'ABC123', name: '测试商品', goodsValue: 10.5, gMax: 100 },
  { id: uuidv4(), sku: 'DEF456', name: '另一个商品', goodsValue: 20.0, gMax: 50 },
]

const API_BASE_URL = 'https://ebay-oauth.onrender.com/JFJP/skus'

const headers = {
  appKey: 'test-key',
  appToken: 'test-token',
  'Content-Type': 'application/json',
};

export function getSkus () {
  return Promise.resolve(skuList)
}

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
  return axios.put(`${API_BASE_URL}/update/${id}`, payload, { headers });
}

export function deleteSku (id) {
  return axios.delete(`${API_BASE_URL}/delete/${id}`, { headers });
}

export function uploadSkus(csvFile) {
  const formData = new FormData()
  formData.append('file', csvFile)
  return axios.post(`${API_BASE_URL}/uploads`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function getSku(skuId) {
  return axios.get(`${API_BASE_URL}/get-one-sku/${skuId}`, { headers });
}

export function getAllSkus() {
  return axios.get(`${API_BASE_URL}/get-all-sku`, { headers });
}
