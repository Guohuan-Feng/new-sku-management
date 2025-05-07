import React, { useEffect, useState } from 'react'
import { Button, message, Input } from 'antd'
import SKUList from '../components/SKUList'
import SKUForm from '../components/SKUForm'
import { getSkus, createSku, updateSku, deleteSku } from '../api/sku'
import ConfirmDialog from '../components/ConfirmDialog'

const SKUPage = () => {
  const [skus, setSkus] = useState([])
  const [editingSku, setEditingSku] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [skuToDelete, setSkuToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadData = async () => {
    const data = await getSkus()
    setSkus(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (data) => {
    try {
      if (editingSku) {
        await updateSku(editingSku.id, data)
        message.success('更新成功')
      } else {
        await createSku(data)
        message.success('创建成功')
      }
      setIsModalOpen(false)
      setEditingSku(null)
      loadData()
    } catch (err) {
      console.warn('保存失败', err)
      message.error('保存失败')
    }
  }

  const handleDelete = async (id) => {
    setSkuToDelete(id)
    setIsConfirmVisible(true)
  }

  const confirmDelete = async () => {
    if (skuToDelete) {
      await deleteSku(skuToDelete)
      message.success('删除成功')
      loadData()
    }
    setIsConfirmVisible(false)
    setSkuToDelete(null)
  }

  const cancelDelete = () => {
    setIsConfirmVisible(false)
    setSkuToDelete(null)
  }

  const filteredSkus = skus.filter(sku =>
    sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      style={{
        background: 'white',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: 720,
        margin: '40px auto',
      }}>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}>
        新增 SKU
      </Button>
      <Input
        placeholder="搜索 SKU 编码或名称"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <SKUList skus={filteredSkus} onEdit={setEditingSku} onDelete={handleDelete} />
      <SKUForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingSku(null)
        }}
        onSubmit={handleSave}
        initialValues={editingSku}
      />
      <ConfirmDialog
        visible={isConfirmVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default SKUPage
