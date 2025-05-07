import React from 'react';
import { Modal } from 'antd';

// 为了适配 antd v5+，将属性名从 'visible' 改为 'open'
const ConfirmDialog = ({ open, onConfirm, onCancel }) => {
  return (
    <Modal
      title="确认删除"
      open={open} // 使用 'open' 属性
      onOk={onConfirm}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      <p>您确定要删除此 SKU 吗？</p>
    </Modal>
  );
};

export default ConfirmDialog;