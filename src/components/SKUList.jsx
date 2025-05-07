import React from 'react'
import { Table, Space, Button } from 'antd'

const SKUList = ({ skus, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'SKU编码',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '成本价',
      dataIndex: 'goodsValue',
      key: 'goodsValue',
      render: (value) => `￥${value}`,
    },
    {
      title: '库存上限',
      dataIndex: 'gMax',
      key: 'gMax',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => onDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={skus}
      pagination={{ pageSize: 5 }}
    />
  )
}

export default SKUList
