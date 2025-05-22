// src/components/SKUList.jsx
import React from 'react';
import { Button, Space, Typography, Empty } from 'antd';
import { fieldsConfig } from './fieldConfig.js'; // 确保这个路径是正确的

const { Text } = Typography;

const getAntdName = (nameStr) => { // 和 SKUForm.jsx 中保持一致
  if (!nameStr) return '';
  return nameStr.replace(/[^a-zA-Z0-9_]/g, '');
};

const SKUList = ({ skus, onEdit, onDelete }) => {
  const skuArray = Array.isArray(skus) ? skus : [];

  const tableFieldDefinitions = fieldsConfig.map(field => ({
    title: field.label,
    dataIndex: getAntdName(field.name), // 使用处理后的名称作为数据索引
    key: getAntdName(field.name),
    // originalName: field.name, // 保留原始名称以便查找原始配置
  }));

  const vendorSKUDataIndex = getAntdName('Vendor SKU'); // 用于表头和key

  if (skuArray.length === 0) {
    return (
      <div style={{ display: 'flex', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
        <div style={{
            minWidth: '220px', // 根据最长的中文标签调整
            borderRight: '1px solid #f0f0f0',
            background: '#fafafa'
        }}>
          <div
            style={{
              padding: '12px 16px', fontWeight: 'bold', textAlign: 'right',
              borderBottom: '1px solid #f0f0f0', background: '#fafafa',
              position: 'sticky', top: 0, zIndex: 3
            }}
          >
            属性
          </div>
          {tableFieldDefinitions.map(fieldDef => (
            <div
              key={fieldDef.key}
              style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}
              title={fieldDef.title} // 添加 title 属性方便悬停查看完整名称
            >
              {fieldDef.title.length > 15 ? `${fieldDef.title.substring(0, 15)}...` : fieldDef.title}
            </div>
          ))}
          <div style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'right' }}>
            操作
          </div>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <Empty description="暂无产品数据" /> {/* 改为产品数据 */}
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{
                width: '220px', textAlign: 'right', padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0',
                background: '#fafafa', position: 'sticky', left: 0, zIndex: 2
            }}>
              属性
            </th>
            {skuArray.map((sku) => (
              <th
                key={sku.id || sku[vendorSKUDataIndex] || Math.random()}
                style={{
                    textAlign: 'center', padding: '12px 8px',
                    borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0',
                    background: '#fafafa', minWidth: '200px', wordBreak: 'break-all'
                }}
              >
                <Text strong>{sku[vendorSKUDataIndex] || 'N/A'}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableFieldDefinitions.map(fieldDef => (
            <tr key={fieldDef.key}>
              <td style={{
                  fontWeight: 'bold', textAlign: 'right', padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0',
                  background: '#fafafa', position: 'sticky', left: 0, zIndex: 1
              }}
              title={fieldDef.title}
              >
                {fieldDef.title.length > 15 ? `${fieldDef.title.substring(0, 15)}...` : fieldDef.title}
              </td>
              {skuArray.map(sku => {
                const cellData = sku[fieldDef.dataIndex];
                let displayData;
                const originalFieldConfig = fieldsConfig.find(f => getAntdName(f.name) === fieldDef.dataIndex);

                if (typeof cellData === 'boolean') {
                  displayData = cellData ? '是' : '否';
                } else if (cellData !== null && typeof cellData !== 'undefined' && String(cellData).trim() !== '') {
                  if (originalFieldConfig?.isFee && typeof cellData === 'number') {
                    displayData = `￥${Number(cellData).toFixed(2)}`;
                  } else if (originalFieldConfig?.type === 'url' && typeof cellData === 'string' && cellData.startsWith('http')) {
                    displayData = <a href={cellData} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{cellData.substring(0,30) + (cellData.length > 30 ? '...' : '')}</a>;
                  }
                   else {
                    displayData = `${cellData}${originalFieldConfig?.suffix || ''}`;
                  }
                } else {
                  displayData = <Text type="secondary">N/A</Text>;
                }

                return (
                  <td
                    key={`${sku.id || sku[vendorSKUDataIndex]}-${fieldDef.key}`}
                    style={{
                      padding: '12px 8px', borderBottom: '1px solid #f0f0f0',
                      borderRight: '1px solid #f0f0f0', textAlign: 'center', wordBreak: 'break-all'
                    }}
                  >
                    {displayData}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td style={{
                fontWeight: 'bold', textAlign: 'right', padding: '12px 16px',
                borderRight: '1px solid #f0f0f0', background: '#fafafa',
                position: 'sticky', left: 0, zIndex: 1
            }}>
              操作
            </td>
            {skuArray.map(sku => (
              <td
                key={`action-${sku.id || sku[vendorSKUDataIndex]}`}
                style={{ padding: '8px', borderRight: '1px solid #f0f0f0', textAlign: 'center' }}
              >
                <Space direction="vertical" size="small">
                  <Button type="link" onClick={() => onEdit(sku)}>
                    编辑
                  </Button>
                  <Button type="link" danger onClick={() => {
                    const idToDelete = sku.id || sku[vendorSKUDataIndex];
                    if (idToDelete) {
                      onDelete(idToDelete);
                    } else {
                      console.warn("无法确定用于删除的ID", sku);
                    }
                  }}>
                    删除
                  </Button>
                </Space>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SKUList;