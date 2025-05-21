import React from 'react';
import { Button, Space, Typography, Empty } from 'antd';

const { Text } = Typography;

// Define the fields and their labels, based on your initial columns.
// This array will define the rows in the transposed table.
const fieldDefinitions = [
  { title: 'SKU编码', dataIndex: 'sku', key: 'sku' },
  { title: '产品名称', dataIndex: 'name', key: 'name' },
  {
    title: '成本价',
    dataIndex: 'goodsValue',
    key: 'goodsValue',
    render: (value) => (value !== null && typeof value !== 'undefined' ? `￥${Number(value).toFixed(2)}` : <Text type="secondary">N/A</Text>)
  },
  { title: '库存上限', dataIndex: 'gMax', key: 'gMax' },
  { title: '包装类型', dataIndex: 'packageType', key: 'packageType' },
  { title: '容量', dataIndex: 'capacity', key: 'capacity' },
  { title: '容量单位', dataIndex: 'capacityUnit', key: 'capacityUnit' },
  { title: '产品代码', dataIndex: 'code', key: 'code' },
  { title: '库存下限', dataIndex: 'gMin', key: 'gMin' },
  { title: '单件毛重 (KG)', dataIndex: 'gw', key: 'gw', suffix: ' KG' },
  { title: '包装高 (CM)', dataIndex: 'height', key: 'height', suffix: ' CM' },
  { title: '包装长 (CM)', dataIndex: 'length', key: 'length', suffix: ' CM' },
  { title: '单件体积 (CBM)', dataIndex: 'vol', key: 'vol', suffix: ' CBM' },
  { title: '包装宽 (CM)', dataIndex: 'width', key: 'width', suffix: ' CM' },
];

const SKUList = ({ skus, onEdit, onDelete }) => {
  // Fallback for when skus prop might not be an array
  const skuArray = Array.isArray(skus) ? skus : [];

  if (skuArray.length === 0) {
    // Display vertical headers on the left and "No data" message on the right
    return (
      <div style={{ display: 'flex', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
        <div style={{
            minWidth: '180px', // Adjust as needed for label width
            borderRight: '1px solid #f0f0f0',
            background: '#fafafa'
        }}>
          {fieldDefinitions.map(field => (
            <div
              key={field.key}
              style={{
                padding: '12px 16px',
                fontWeight: 'bold',
                textAlign: 'right',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              {field.title}
            </div>
          ))}
          <div
            style={{
              padding: '12px 16px',
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            操作
          </div>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <Empty description="暂无 SKU 数据" />
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
                width: '180px', // Fixed width for the attribute column
                textAlign: 'right',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                borderRight: '1px solid #f0f0f0',
                background: '#fafafa',
                position: 'sticky', // Make attribute column sticky
                left: 0,           // Stick to the left
                zIndex: 2          // Ensure it's above other cells
            }}>
              属性
            </th>
            {skuArray.map((sku) => (
              <th
                key={sku.id || sku.sku}
                style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    borderBottom: '1px solid #f0f0f0',
                    borderRight: '1px solid #f0f0f0',
                    background: '#fafafa',
                    minWidth: '200px',
                    wordBreak: 'break-all'
                }}
              >
                <Text strong>{sku.sku || 'N/A'}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fieldDefinitions.map(field => (
            <tr key={field.key}>
              <td style={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  borderRight: '1px solid #f0f0f0',
                  background: '#fafafa',
                  position: 'sticky', // Make attribute column sticky
                  left: 0,            // Stick to the left
                  zIndex: 1           // Ensure it's above other cells when scrolling
              }}>
                {field.title}
              </td>
              {skuArray.map(sku => (
                <td
                  key={`${sku.id || sku.sku}-${field.key}`}
                  style={{
                    padding: '12px 8px',
                    borderBottom: '1px solid #f0f0f0',
                    borderRight: '1px solid #f0f0f0',
                    textAlign: 'center',
                    wordBreak: 'break-all'
                  }}
                >
                  {
                    field.render
                      ? field.render(sku[field.dataIndex])
                      : (sku[field.dataIndex] !== null && typeof sku[field.dataIndex] !== 'undefined' && String(sku[field.dataIndex]).trim() !== ''
                          ? `${sku[field.dataIndex]}${field.suffix || ''}`
                          : <Text type="secondary">N/A</Text>)
                  }
                </td>
              ))}
            </tr>
          ))}
          {/* Row for Actions */}
          <tr>
            <td style={{
                fontWeight: 'bold',
                textAlign: 'right',
                padding: '12px 16px',
                borderRight: '1px solid #f0f0f0',
                borderBottom: '1px solid #f0f0f0', // Added to match other cells
                background: '#fafafa',
                position: 'sticky', // Make attribute column sticky
                left: 0,            // Stick to the left
                zIndex: 1           // Ensure it's above other cells
            }}>
              操作
            </td>
            {skuArray.map(sku => (
              <td
                key={`action-${sku.id || sku.sku}`}
                style={{
                  padding: '8px',
                  borderRight: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0', // Added to match other cells
                  textAlign: 'center'
                }}
              >
                <Space direction="vertical" size="small">
                  <Button type="link" onClick={() => onEdit(sku)}>
                    编辑
                  </Button>
                  <Button type="link" danger onClick={() => onDelete(sku.id)}>
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