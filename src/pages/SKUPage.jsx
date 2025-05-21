import React, { useEffect, useState } from 'react';
import { Button, message, Input, Space, Upload, Tooltip, Modal } from 'antd';
import { notification } from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import SKUList from '../components/SKUList';
import SKUForm from '../components/SKUForm';
import { getAllSkus, createSku, updateSku, deleteSku, uploadSkus } from '../api/sku';
import ConfirmDialog from '../components/ConfirmDialog';

// 辅助函数：用于解析并格式化错误信息 (保持之前的健壮版本)
const formatErrorMessage = (error) => {
  console.log("Formatting error:", error);
  if (error.response) {
    if (error.response.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        return error.response.data.detail.map(err => {
          const field = err.loc && err.loc.length > 1 ? err.loc.slice(-1).join('.') : (err.loc ? err.loc.join('.') : 'N/A');
          return `字段 '${field}': ${err.msg}`;
        }).join('\n');
      }
      return String(error.response.data.detail);
    }
    if (error.response.data?.error) {
      let msg = String(error.response.data.error);
      if (error.response.data.missing_columns) {
        msg += ` (缺少列: ${error.response.data.missing_columns.join(', ')})`;
      }
      return msg;
    }
    if (error.response.data && typeof error.response.data === 'string') {
        return error.response.data;
    }
    if (error.response.statusText && error.response.statusText !== "") {
        return `请求失败: ${error.response.status} ${error.response.statusText}`;
    }
  }
  if (error.message) {
    return error.message;
  }
  return '发生未知错误，请检查控制台获取更多信息。';
};

const showNotification = (type, title, content) => {
  notification[type]({
    message: title,
    description: content,
    placement: 'topRight',
    duration: 4.5,
  });
  if (type === 'success') {
    message.success(`${title}: ${content}`);
  } else if (type === 'error') {
    message.error(`${title}: ${content}`);
  } else if (type === 'warning') {
    message.warning(`${title}: ${content}`);
  }
};

// 示例SKU数据
const sampleSkusData = [
  {
    id: 'sample-1',
    sku: 'SKU001',
    name: '产品A (示例)',
    goodsValue: 120.50,
    gMax: 1000,
    packageType: '标准箱',
    capacity: 500,
    capacityUnit: 'ml',
    code: 'PCODE001',
    gMin: 50,
    gw: 1.2,
    height: 20,
    length: 30,
    vol: 0.018,
    width: 15,
  },
  {
    id: 'sample-2',
    sku: 'SKU002',
    name: '产品B (超长名称示例用于测试换行和显示效果)',
    goodsValue: 75.00,
    gMax: 500,
    packageType: '独立包装',
    capacity: 2,
    capacityUnit: 'L',
    code: 'PCODE002',
    gMin: 20,
    gw: 2.5,
    height: 25,
    length: 40,
    vol: 0.03,
    width: 30,
  },
  {
    id: 'sample-3',
    sku: 'SKU003',
    name: '产品C (部分字段为空)',
    goodsValue: 210.75,
    gMax: null, // 示例空值
    packageType: '袋装',
    capacity: 750,
    capacityUnit: 'g',
    code: '', // 示例空字符串
    gMin: 10,
    gw: 0.8,
    height: 15,
    length: 20,
    vol: 0.009,
    width: 10,
  },
];


const SKUPage = () => {
  const [skus, setSkus] = useState([]); // 初始化为空数组
  const [editingSku, setEditingSku] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [skuToDelete, setSkuToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    console.log("Attempting to load data...");
    // ** START: 修改为使用示例数据 **
    // 为了演示，我们直接设置示例数据
    // 在实际应用中，您应该移除这行，并取消下方API调用的注释
    setSkus(sampleSkusData); 
    console.log("Loaded sample SKU data for display.");

    // 实际API调用 (当前被注释掉)
    /*
    try {
      const response = await getAllSkus();
      console.log("Load data response:", response);
      setSkus(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('加载 SKU 数据失败 (捕获于 loadData):', error.response || error.request || error.message);
      showNotification('error', '加载数据失败', formatErrorMessage(error));
      setSkus([]); // 确保出错时 skus 仍为数组
    }
    */
    // ** END: 修改为使用示例数据 **
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData) => {
    console.log('[handleSave] Initiated with formData:', formData);
    // 暂时禁用保存逻辑，因为我们在使用示例数据
    showNotification('info', '操作提示', '当前为示例数据显示，保存功能未执行。');
    setIsModalOpen(false);
    setEditingSku(null);
    // 如果需要，可以在这里重新加载示例数据或API数据
    // loadData(); 
    return; 

    // 以下是原始保存逻辑
    /*
    try {
      if (editingSku) {
        // ... (省略更新逻辑)
      } else {
        // ... (省略创建逻辑)
      }
      setIsModalOpen(false);
      setEditingSku(null);
      loadData(); 
    } catch (err) {
      // ... (省略错误处理)
    }
    */
  };

  const handleEdit = (sku) => {
     // 如果是示例数据，我们可能没有完整的后端ID
    console.log("Editing SKU (sample data):", sku);
    setEditingSku(sku);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log("Attempting to delete SKU ID (sample data):", id);
    // 暂时禁用删除逻辑
    showNotification('info', '操作提示', `当前为示例数据显示，删除功能未执行 (ID: ${id})。`);
    // setSkuToDelete(id);
    // setIsConfirmOpen(true);
  };


  const confirmDelete = async () => {
    console.log('[confirmDelete] Attempting to delete SKU ID:', skuToDelete);
    // 暂时禁用
    setIsConfirmOpen(false);
    setSkuToDelete(null);
    return;
    /*
    if (skuToDelete) {
      try {
        await deleteSku(skuToDelete);
        showNotification('success', '删除成功', 'SKU 已成功删除');
        loadData();
      } catch (error) {
        console.error('[confirmDelete] Delete failed:', error.response || error.request || error.message);
        showNotification('error', '删除失败', formatErrorMessage(error));
      }
    }
    setIsConfirmOpen(false);
    setSkuToDelete(null);
    */
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setSkuToDelete(null);
  };

  const handleFileChange = (info) => {
    if (info.fileList && info.fileList.length > 0) {
      const latestFile = info.fileList[info.fileList.length - 1].originFileObj;
      if (latestFile && latestFile.type === 'text/csv') {
        setSelectedFile(latestFile);
        message.success(`${latestFile.name} 文件已选择，请点击确认上传`);
      } else if (latestFile) {
        showNotification('warning', '文件类型错误', '请选择 CSV 格式的文件！');
        setSelectedFile(null);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      showNotification('warning', '提示', '请先选择一个 CSV 文件！');
      return;
    }
    // 暂时禁用上传逻辑
    setUploading(true);
    showNotification('info', '操作提示', '当前为示例数据显示，上传功能未执行。');
    setTimeout(() => {
        setUploading(false);
        setSelectedFile(null);
    }, 1500);
    return;
    /*
    setUploading(true);
    // ... (省略上传逻辑)
    */
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
        minWidth: 720, // 确保有足够宽度展示
        maxWidth: '90%', // 允许更宽的视图
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

        <Space>
          <Upload
            name="file"
            accept=".csv"
            beforeUpload={() => false}
            onChange={handleFileChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>
              选择 CSV 文件
            </Button>
          </Upload>

          {selectedFile && (
            <Space>
               <Tooltip title={selectedFile.name}>
                 <span style={{ marginLeft: 8, color: '#52c41a', display: 'inline-block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom' }}>
                    <CheckCircleOutlined style={{ marginRight: 4 }}/>
                    {selectedFile.name}
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
                 onClick={() => setSelectedFile(null)}
                 danger
                 type="text"
              />
            </Space>
          )}
        </Space>

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
        open={isConfirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default SKUPage;