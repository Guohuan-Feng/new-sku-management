// src/api/sku.js
import { v4 as uuidv4 } from 'uuid'

let skuList = [
  { id: uuidv4(), sku: 'ABC123', name: '测试商品', goodsValue: 10.5, gMax: 100 },
  { id: uuidv4(), sku: 'DEF456', name: '另一个商品', goodsValue: 20.0, gMax: 50 },
]

export function getSkus () {
  return Promise.resolve(skuList)
}

export function createSku (data) {
  const newSku = { ...data, id: uuidv4() }
  skuList.push(newSku)
  return Promise.resolve(newSku)
}

export function updateSku (id, data) {
  skuList = skuList.map(item => item.id === id ? { ...item, ...data } : item)
  return Promise.resolve()
}

export function deleteSku (id) {
  skuList = skuList.filter(item => item.id !== id)
  return Promise.resolve()
}
