import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber } from 'antd'

const SKUForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onSubmit(values)
    } catch (err) {
      console.warn('验证失败', err)
    }
  }

  return (
    <Modal
      title={initialValues ? '编辑 SKU' : '新增 SKU'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      destroyOnClose>
      <Form form={form} layout="vertical" initialValues={initialValues || {}}>
        <Form.Item
          label="SKU 编码"
          name="sku"
          rules={[{ required: true, message: '请输入 SKU 编码' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="产品名称"
          name="name"
          rules={[{ required: true, message: '请输入产品名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="成本价"
          name="goodsValue"
          rules={[{ required: true, message: '请输入成本价' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="库存上限"
          name="gMax"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="包装类型"
          name="packageType"
          rules={[{ required: true, message: '请输入包装类型' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="容量"
          name="capacity"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="容量单位"
          name="capacityUnit"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="产品代码"
          name="code"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="库存下限"
          name="gMin"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="单件毛重 (KG)"
          name="gw"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="包装高 (CM)"
          name="height"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="包装长 (CM)"
          name="length"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="单件体积 (CBM 立方米)"
          name="vol"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="包装宽 (CM)"
          name="width"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SKUForm
