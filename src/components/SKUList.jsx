// src/components/SKUList.jsx
import React from 'react';
import { Button, Space, Typography as AntTypography, Empty } from 'antd';
import { fieldsConfig } from './fieldConfig.js';

export const getSnakeCaseDataKey = (nameStr) => {
  if (!nameStr) return '';
  return String(nameStr)
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_');
};

const SKUList = ({ skus, onEdit, onDelete, loading }) => {
  const { Text: AntdText } = AntTypography;
  const skuArray = Array.isArray(skus) ? skus : [];

  const tableFieldDefinitions = fieldsConfig.map(field => ({
    title: field.label,
    dataIndex: getSnakeCaseDataKey(field.name || field.label),
    key: getSnakeCaseDataKey(field.name || field.label),
  }));

  const vendorSKUConfigField = fieldsConfig.find(field => (field.name || field.label) === 'Vendor SKU');
  const vendorSKUDataIndex = vendorSKUConfigField
    ? getSnakeCaseDataKey(vendorSKUConfigField.name || vendorSKUConfigField.label)
    : (tableFieldDefinitions.length > 0 ? tableFieldDefinitions[0].dataIndex : 'default_sku_key');

  const firstColumnWidth = '220px';
  const checkboxColumnWidth = '60px';

  if (loading && skuArray.length === 0) {
    return <Empty description="正在加载产品数据..." style={{ padding: '20px' }} />;
  }

  if (skuArray.length === 0) {
    return (
      <div style={{ display: 'flex', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
        <div style={{ width: checkboxColumnWidth, minWidth: checkboxColumnWidth }}></div>
        <div style={{ width: firstColumnWidth, minWidth: firstColumnWidth, borderRight: '1px solid #f0f0f0', background: '#fafafa', boxSizing: 'border-box' }}>
          {tableFieldDefinitions.map(fieldDef => (
            <div
              key={fieldDef.key}
              style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'left', borderBottom: '1px solid #f0f0f0', wordBreak: 'break-word', boxSizing: 'border-box' }}
              title={fieldDef.title}
            >
              {fieldDef.title}
            </div>
          ))}
          <div style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'left', wordBreak: 'break-word', boxSizing: 'border-box' }}>Actions</div>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <Empty description="没有可用的产品数据" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: checkboxColumnWidth, minWidth: checkboxColumnWidth }}></th>
            <th style={{ width: firstColumnWidth, minWidth: firstColumnWidth, fontWeight: 'bold', textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', background: '#fafafa', position: 'sticky', top: 0, left: checkboxColumnWidth, zIndex: 2, boxSizing: 'border-box' }}>
              Attribute / SKU
            </th>
            {skuArray.map((sku, skuIndex) => (
              <th key={sku[vendorSKUDataIndex] || `sku_header_${skuIndex}`}
                  style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', textAlign: 'center', wordBreak: 'break-all', background: '#fafafa', position: 'sticky', top: 0, zIndex: 1 }}>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableFieldDefinitions.map(fieldDef => (
            <tr key={fieldDef.key}>
              <td style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1, borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}></td>
              <td style={{ fontWeight: 'bold', textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', background: '#fafafa', position: 'sticky', left: checkboxColumnWidth, zIndex: 1, width: firstColumnWidth, minWidth: firstColumnWidth, wordBreak: 'break-word', boxSizing: 'border-box' }} title={fieldDef.title}>
                {fieldDef.title}
              </td>
              {skuArray.map((sku, skuIndex) => {
                const skuId = sku.id || sku[vendorSKUDataIndex];
                const cellData = sku[fieldDef.dataIndex];
                let displayData;
                const originalFieldConfig = fieldsConfig.find(f => getSnakeCaseDataKey(f.name || f.label) === fieldDef.dataIndex);

                if (typeof cellData === 'boolean') {
                  displayData = cellData ? 'Yes' : 'No';
                } else if (cellData !== null && typeof cellData !== 'undefined' && String(cellData).trim() !== '') {
                  if (originalFieldConfig?.isFee && typeof cellData === 'number') {
                    displayData = `$${Number(cellData).toFixed(2)}`;
                  } else if (originalFieldConfig?.type === 'url' && typeof cellData === 'string' && cellData.startsWith('http')) {
                    const displayText = cellData.length > 30 ? cellData.substring(0, 30) + '...' : cellData;
                    displayData = <a href={cellData} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{displayText}</a>;
                  } else {
                    displayData = `${cellData}${originalFieldConfig?.suffix || ''}`;
                  }
                } else {
                  displayData = <AntdText type="secondary">N/A</AntdText>;
                }

                return (
                  <td key={`${skuId}-${fieldDef.key}`} style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', textAlign: 'center', wordBreak: 'break-all' }}>
                    {displayData}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1, borderRight: '1px solid #f0f0f0' }}></td>
            <td style={{ fontWeight: 'bold', textAlign: 'left', padding: '12px 16px', borderRight: '1px solid #f0f0f0', background: '#fafafa', position: 'sticky', left: checkboxColumnWidth, zIndex: 1, width: firstColumnWidth, minWidth: firstColumnWidth, wordBreak: 'break-word', boxSizing: 'border-box' }}>
              Actions
            </td>
            {skuArray.map((sku, skuIndex) => {
              const skuId = sku.id || sku[vendorSKUDataIndex];
              return (
                <td key={`action-${skuId || skuIndex}`} style={{ padding: '8px', borderRight: '1px solid #f0f0f0', textAlign: 'center' }}>
                  <Space direction="vertical" size="small">
                    <Button type="link" onClick={() => onEdit(sku)}>
                      Edit
                    </Button>
                    <Button type="link" danger onClick={() => {
                      if (skuId !== undefined && skuId !== null) {
                        onDelete(skuId);
                      } else {
                        console.warn("Cannot determine unique SKU identifier for deletion. SKU Data:", sku);
                      }
                    }}>
                      Delete
                    </Button>
                  </Space>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SKUList;
