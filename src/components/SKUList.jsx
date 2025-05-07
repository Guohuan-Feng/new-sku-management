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
      title: '包装类型',
      dataIndex: 'packageType',
      key: 'packageType',
    },
    {
      title: '容量',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: '容量单位',
      dataIndex: 'capacityUnit',
      key: 'capacityUnit',
    },
    {
      title: '产品代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '库存下限',
      dataIndex: 'gMin',
      key: 'gMin',
    },
    {
      title: '单件毛重 (KG)',
      dataIndex: 'gw',
      key: 'gw',
    },
    {
      title: '包装高 (CM)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: '包装长 (CM)',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '单件体积 (CBM 立方米)',
      dataIndex: 'vol',
      key: 'vol',
    },
    {
      title: '包装宽 (CM)',
      dataIndex: 'width',
      key: 'width',
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
