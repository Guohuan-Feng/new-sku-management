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
  console.log("Formatting error:", error); // 新增日志，查看传入的error对象
  if (error.response) { // 首先确保 error.response 存在
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
    // 如果 response 中有其他可读的错误信息
    if (error.response.data && typeof error.response.data === 'string') {
        return error.response.data;
    }
    if (error.response.statusText && error.response.statusText !== "") {
        return `请求失败: ${error.response.status} ${error.response.statusText}`;
    }
  }
  if (error.message) {
    return error.message; // 网络错误或其他客户端错误
  }
  return '发生未知错误，请检查控制台获取更多信息。';
};

// 显示通知的辅助函数
const showNotification = (type, title, content) => {
  console.log(`显示通知: ${type}, ${title}, ${content}`); // 添加调试日志
  
  // 使用notification API
  notification[type]({
    message: title,
    description: content,
    placement: 'topRight',
    duration: 4.5,
  });
  
  // 同时使用message API作为备选
  if (type === 'success') {
    message.success(`${title}: ${content}`);
  } else if (type === 'error') {
    message.error(`${title}: ${content}`);
  } else if (type === 'warning') {
    message.warning(`${title}: ${content}`);
  }
};

const SKUPage = () => {
  const [skus, setSkus] = useState([]);
  const [editingSku, setEditingSku] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [skuToDelete, setSkuToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    console.log("Attempting to load data...");
    try {
      const response = await getAllSkus();
      console.log("Load data response:", response);
      setSkus(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('加载 SKU 数据失败 (捕获于 loadData):', error.response || error.request || error.message);
      showNotification('error', '加载数据失败', formatErrorMessage(error));
      setSkus([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData) => {
    console.log('[handleSave] Initiated with formData:', formData);
    try {
      if (editingSku) {
        console.log('[handleSave] Attempting to update SKU ID:', editingSku.id);
        const updateResponse = await updateSku(editingSku.id, formData);
        console.log('[handleSave] Update SKU response:', updateResponse);

        // 更新成功通知
        if (updateResponse && (updateResponse.status === 200 || updateResponse.status === 204)) {
          showNotification(
            'success',
            'SKU更新成功',
            updateResponse.data?.message || 'SKU数据已成功更新'
          );
        } else {
          console.warn('[handleSave] Update SKU response was 2xx but not as expected:', updateResponse);
          showNotification(
            'warning',
            '更新操作存疑',
            `更新请求已发送，但服务器响应状态为 ${updateResponse?.status}。消息: ${updateResponse?.data?.message || '无具体消息。'}`
          );
        }
      } else {
        console.log('[handleSave] Attempting to create SKU.');
        const createResponse = await createSku(formData);
        console.log('[handleSave] Create SKU response:', createResponse);

        // 创建成功通知
        if (createResponse && createResponse.status === 201) {
          console.log('显示成功通知'); // 添加调试日志
          showNotification(
            'success',
            'SKU创建成功',
            createResponse.data?.message || 'SKU数据已成功创建'
          );
        } else {
          console.warn('[handleSave] Create SKU response was 2xx but not 201 or not as expected:', createResponse);
          showNotification(
            'warning',
            '创建操作存疑',
            `创建请求已发送，但服务器响应状态为 ${createResponse?.status}。消息: ${createResponse?.data?.message || '无具体消息。'}`
          );
        }
      }
      setIsModalOpen(false);
      setEditingSku(null);
      loadData(); // 重新加载数据
    } catch (err) {
      // 处理API调用失败（例如400, 500错误，或网络问题）
      console.error('[handleSave] Operation failed (caught in catch block):', err.response || err.request || err.message);
      
      // 检测是否为重复SKU错误
      let errorMessage = formatErrorMessage(err);
      let title = '保存操作失败';
      
      if (errorMessage.includes('SKU已存在') || errorMessage.includes('duplicate') || 
          errorMessage.includes('重复') || errorMessage.toLowerCase().includes('already exists') ||
          (err.response && err.response.data && err.response.data.detail && 
           err.response.data.detail.includes('SKU 编码已存在'))) {
        title = 'SKU重复错误';
        errorMessage = `${formData.sku} 已存在，请使用其他SKU编码`;
      }
      
      console.log(`即将显示错误通知: ${title}, ${errorMessage}`); // 添加调试日志
      
      // 使用多种方式确保错误信息一定能显示
      // 1. 使用 alert (最基础的浏览器弹窗)
      window.alert(`${title}: ${errorMessage}`);
      
      // 2. 使用 Modal.error
      Modal.error({
        title: title,
        content: errorMessage,
      });
      
      // 3. 使用通知函数
      showNotification('error', title, errorMessage);
    }
  };

  const handleEdit = (sku) => {
    setEditingSku(sku);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setSkuToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    console.log('[confirmDelete] Attempting to delete SKU ID:', skuToDelete);
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

    setUploading(true);
    console.log('[handleConfirmUpload] Attempting to upload file:', selectedFile.name);
    try {
      const response = await uploadSkus(selectedFile);
      console.log('[handleConfirmUpload] Upload response:', response);
      setUploading(false);

      if (response.data.failure_count > 0) {
        const failureDetails = response.data.failures.map(f =>
          `行 ${f.row}: ${f.error} (涉及数据: ${JSON.stringify(f.data).substring(0, 100)}${JSON.stringify(f.data).length > 100 ? '...' : ''})`
        ).join('\n');

        Modal.warning({
          title: '上传部分成功',
          width: 700,
          content: (
            <div>
              <p>{`成功上传: ${response.data.success_count}条, 失败: ${response.data.failure_count}条.`}</p>
              <p>失败详情 (部分):</p>
              <pre style={{ maxHeight: '200px', overflowY: 'auto', background: '#f5f5f5', padding: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {failureDetails}
              </pre>
              <p>详细错误原因及数据请查看控制台。</p>
            </div>
          ),
          onOk() { console.warn('[handleConfirmUpload] Full upload failure details:', response.data.failures); }
        });
      } else {
        showNotification('success', '上传成功', `成功上传: ${response.data.success_count}条数据`);
      }

      setSelectedFile(null);
      loadData();
    } catch (err) {
      setUploading(false);
      console.error('[handleConfirmUpload] Upload failed (caught in catch block):', err.response || err.request || err.message);
      showNotification('error', '上传失败', formatErrorMessage(err));
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
        onSubmit={handleSave} // 确保这里是 onSubmit={handleSave}
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