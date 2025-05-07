import React, { useEffect, useState } from 'react';
import { Button, message, Input, Space } from 'antd';
import SKUList from '../components/SKUList';
import SKUForm from '../components/SKUForm';
// 导入 getAllSkus 替换 getSkus
import { getAllSkus, createSku, updateSku, deleteSku, uploadSkus } from '../api/sku';
import ConfirmDialog from '../components/ConfirmDialog';

const SKUPage = () => {
  const [skus, setSkus] = useState([]);
  const [editingSku, setEditingSku] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 从 isConfirmVisible 修改而来
  const [skuToDelete, setSkuToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      const response = await getAllSkus(); // 使用 getAllSkus
      setSkus(response.data); // 假设后端数据在 response.data 中
    } catch (error) {
      message.error('加载 SKU 数据失败');
      console.error('Failed to load SKUs:', error);
      setSkus([]); // 出错时设置为空数组
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingSku) {
        // 'editingSku.id' 应该是来自后端的整数 ID
        await updateSku(editingSku.id, data);
        message.success('更新成功');
      } else {
        await createSku(data);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      setEditingSku(null);
      loadData(); // 重新加载数据
    } catch (err) {
      console.warn('保存失败', err);
      // 检查后端返回的具体错误信息
      const errorDetail = err.response?.data?.detail || '保存失败';
      message.error(errorDetail);
    }
  };

  const handleEdit = (sku) => {
    // 这里的 sku.id 是来自后端的
    setEditingSku(sku);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    // 这里的 id 是来自后端的
    setSkuToDelete(id);
    setIsConfirmOpen(true); // 从 setIsConfirmVisible 修改而来
  };

  const confirmDelete = async () => {
    if (skuToDelete) {
      try {
        await deleteSku(skuToDelete);
        message.success('删除成功');
        loadData(); // 重新加载数据
      } catch (error) {
        message.error('删除失败');
        console.error('Failed to delete SKU:', error);
      }
    }
    setIsConfirmOpen(false); // 从 setIsConfirmVisible 修改而来
    setSkuToDelete(null);
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false); // 从 setIsConfirmVisible 修改而来
    setSkuToDelete(null);
  };

  // 添加 handleUpload 函数
  const handleUpload = async (file) => {
    try {
      const response = await uploadSkus(file);
      message.success(`成功上传: ${response.data.success_count}, 失败: ${response.data.failure_count}`);
      if (response.data.failure_count > 0) {
        console.warn('上传失败详情:', response.data.failures);
        // 可选：以更结构化的方式向用户显示失败详情
      }
      loadData(); // 重新加载数据
    } catch (err) {
      console.error('上传失败', err);
      const errorDetail = err.response?.data?.error || '上传失败';
      message.error(errorDetail);
    }
  };

  const filteredSkus = skus.filter(sku =>
    (sku.sku && String(sku.sku).toLowerCase().includes(searchTerm.toLowerCase())) || // 确保 sku.sku 被当作字符串处理
    (sku.name && String(sku.name).toLowerCase().includes(searchTerm.toLowerCase()))  // 确保 sku.name 被当作字符串处理
  );

  return (
    <div
      style={{
        background: 'white',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: 720,
        maxWidth: 1200, // 确保不会太宽
        margin: '40px auto',
      }}>
      <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'space-between' }} wrap>
        <Button
          type="primary"
          onClick={() => {
            setEditingSku(null);
            setIsModalOpen(true);
          }}>
          新增 SKU
        </Button>
        {/* 添加上传按钮和功能 */}
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
          style={{ width: 200 }}
        />
        <Input
          placeholder="搜索 SKU 编码或名称"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>
      <SKUList skus={filteredSkus} onEdit={handleEdit} onDelete={handleDelete} />
      <SKUForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingSku(null);
        }}
        onSubmit={handleSave}
        initialValues={editingSku}
      />
      <ConfirmDialog
        open={isConfirmOpen} // 从 visible 修改而来
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default SKUPage;