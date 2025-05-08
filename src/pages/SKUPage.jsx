import React, { useEffect, useState } from 'react';
// 引入需要的组件，包括 Button, message, Input, Space, Upload, Tooltip
import { Button, message, Input, Space, Upload, Tooltip } from 'antd';
// 引入需要的图标
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import SKUList from '../components/SKUList';
import SKUForm from '../components/SKUForm';
import { getAllSkus, createSku, updateSku, deleteSku, uploadSkus } from '../api/sku';
import ConfirmDialog from '../components/ConfirmDialog';

const SKUPage = () => {
  const [skus, setSkus] = useState([]);
  const [editingSku, setEditingSku] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [skuToDelete, setSkuToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- CSV Upload States ---
  const [selectedFile, setSelectedFile] = useState(null); // 存储选中的文件对象
  const [uploading, setUploading] = useState(false);     // 控制上传状态

  const loadData = async () => {
    try {
      const response = await getAllSkus();
      setSkus(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error('加载 SKU 数据失败');
      console.error('Failed to load SKUs:', error);
      setSkus([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingSku) {
        await updateSku(editingSku.id, data);
        message.success('更新成功');
      } else {
        const response = await createSku(data);
        if (response.data && response.data.message === "创建成功") {
          message.success('创建成功');
        } else if (response.data && response.data.detail) {
          message.error(response.data.detail);
        } else {
           message.success('创建成功');
        }
      }
      setIsModalOpen(false);
      setEditingSku(null);
      loadData();
    } catch (err) {
      console.error('保存失败', err.response || err);
      const errorDetail = err.response?.data?.detail || err.response?.data?.error || '保存失败';
      message.error(errorDetail);
    }
  };

  const handleEdit = (sku) => {
    setEditingSku(sku);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setSkuToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (skuToDelete) {
      try {
        await deleteSku(skuToDelete);
        message.success('删除成功');
        loadData();
      } catch (error) {
        console.error('删除失败:', error.response || error);
        const errorDetail = error.response?.data?.detail || '删除失败';
        message.error(errorDetail);
      }
    }
    setIsConfirmOpen(false);
    setSkuToDelete(null);
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setSkuToDelete(null);
  };

  // --- CSV Upload Handlers ---

  // 文件选择变化的处理器
  const handleFileChange = (info) => {
    // info.fileList 是 Ant Design Upload 内部管理的文件列表
    // 我们只关心最新选择的那个文件 info.fileList[0]
    // 但为了获取原始文件对象，直接用 info.file 可能更好
    // Antd Upload 在 beforeUpload 返回 false 后，会将文件信息放在 info.fileList 中
    // 我们可以从中取出文件对象
    console.log('File info:', info);
    if (info.fileList && info.fileList.length > 0) {
        // 获取最新的文件对象（通常是最后一个）
        const latestFile = info.fileList[info.fileList.length - 1].originFileObj;
         if (latestFile && latestFile.type === 'text/csv') {
             setSelectedFile(latestFile); // 存储文件对象
             message.success(`${latestFile.name} 文件已选择，请点击确认上传`);
         } else if(latestFile) {
             message.error('请选择 CSV 格式的文件！');
             setSelectedFile(null); // 清除非 CSV 文件
         }
    } else {
      setSelectedFile(null); // 如果没有文件或清空了，则重置
    }
  };


  // 点击“确认上传”按钮后执行的函数
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      message.warning('请先选择一个 CSV 文件！');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadSkus(selectedFile); // 调用 API 上传存储的文件
      setUploading(false);
      message.success(`成功上传: ${response.data.success_count}条, 失败: ${response.data.failure_count}条`);
      if (response.data.failure_count > 0) {
        console.warn('上传失败详情:', response.data.failures);
        message.warning(`有 ${response.data.failure_count} 条记录上传失败，详情请查看控制台。`);
      }
      setSelectedFile(null); // 上传成功后清空已选文件状态
      loadData();
    } catch (err) {
      setUploading(false);
      console.error('上传失败', err.response || err);
      // 尝试从不同的地方获取错误详情
      let errorDetail = '上传失败';
      if (err.response?.data?.error) {
        errorDetail = err.response.data.error;
        if (err.response.data.missing_columns) {
          errorDetail += ` (缺少列: ${err.response.data.missing_columns.join(', ')})`;
        }
      } else if (err.response?.data?.detail) {
          errorDetail = err.response.data.detail;
          if (Array.isArray(err.response.data.detail) && err.response.data.detail[0]?.msg) {
              // 处理 Pydantic 校验错误细节
              errorDetail = `上传数据校验失败: ${err.response.data.detail[0].msg} (字段: ${err.response.data.detail[0].loc.slice(-1)})`;
          } else if (typeof err.response.data.detail === 'string') {
              errorDetail = err.response.data.detail;
          }
      }
      message.error(errorDetail);
    }
  };

  const filteredSkus = skus.filter(sku =>
    (sku.sku && String(sku.sku).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sku.name && String(sku.name).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      style={{
        background: 'white',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: 720,
        maxWidth: 1200,
        margin: '40px auto',
      }}>
      <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'space-between' }} wrap>
        {/* 新增 SKU 按钮 */}
        <Button
          type="primary"
          onClick={() => {
            setEditingSku(null);
            setIsModalOpen(true);
          }}>
          新增 SKU
        </Button>

        {/* CSV 上传区域 */}
        <Space>
          <Upload
            name="file"
            accept=".csv"
            beforeUpload={() => false} // 阻止自动上传，仅选择文件
            onChange={handleFileChange} // 文件选择后更新状态
            showUploadList={false} // 不显示 Antd 默认的文件列表
            // fileList={selectedFile ? [ { uid: '-1', name: selectedFile.name, status: 'done' } ] : []} // 可以自定义显示，但这里我们用文字提示
          >
            <Button icon={<UploadOutlined />}>
              选择 CSV 文件
            </Button>
          </Upload>

          {/* 显示已选择的文件名 和 确认上传按钮 */}
          {selectedFile && (
            <Space>
               <Tooltip title={selectedFile.name}>
                 <span style={{ marginLeft: 8, color: '#52c41a' }}>
                    <CheckCircleOutlined style={{ marginRight: 4 }}/>
                    {selectedFile.name.length > 20 ? `${selectedFile.name.substring(0, 17)}...` : selectedFile.name}
                 </span>
               </Tooltip>
              <Button
                type="primary"
                onClick={handleConfirmUpload}
                loading={uploading}
                icon={<CheckCircleOutlined />}
              >
                确认上传
              </Button>
              <Button
                 icon={<CloseCircleOutlined />}
                 onClick={() => setSelectedFile(null)} // 添加取消按钮
                 danger
                 type="text" // 设为文字按钮或链接按钮减少视觉干扰
              />
            </Space>
          )}
        </Space>

        {/* 搜索框 */}
        <Input
          placeholder="搜索 SKU 编码或名称"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>

      {/* SKU 列表 */}
      <SKUList skus={filteredSkus} onEdit={handleEdit} onDelete={handleDelete} />

      {/* 新增/编辑表单 */}
      <SKUForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingSku(null);
        }}
        onSubmit={handleSave}
        initialValues={editingSku}
      />

      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={isConfirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default SKUPage;