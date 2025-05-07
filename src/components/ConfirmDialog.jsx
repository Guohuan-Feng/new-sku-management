import React from 'react';
import { Modal } from 'antd';

const ConfirmDialog = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title="确认删除"
      visible={visible}
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