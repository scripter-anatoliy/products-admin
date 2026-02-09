import { useState } from 'react'
import { Card, Form, Input, InputNumber, Button, Row, Col } from 'antd'
import { useProductsStore } from '../../model/products-store'
import { addProduct } from '@/entities/product'
import { useAuthStore } from '@/entities/auth'
import styles from './AddProductForm.module.css'

interface AddProductFormProps {
  onCancel: () => void
  onSuccess: () => void
}

type FormValues = { title: string; price: number; brand: string; sku: string }

export function AddProductForm({ onCancel, onSuccess }: AddProductFormProps) {
  const token = useAuthStore((s) => s.token)
  const addLocalProduct = useProductsStore((s) => s.addLocalProduct)
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: FormValues) => {
    setLoading(true)
    try {
      const product = await addProduct(
        {
          title: values.title.trim(),
          price: values.price,
          brand: values.brand.trim(),
          sku: values.sku.trim(),
        },
        { token: token ?? undefined }
      )
      addLocalProduct(product)
      onSuccess()
      form.resetFields()
    } catch {
      form.setFields([
        { name: 'title', errors: ['Ошибка добавления. Повторите попытку.'] },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Новый товар" size="small" className="add-product-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ price: 0 }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item<FormValues>
              name="title"
              label="Наименование"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input placeholder="Наименование" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item<FormValues>
              name="price"
              label="Цена"
              rules={[
                { required: true, message: 'Обязательное поле' },
                { type: 'number', min: 0, message: 'Цена не может быть отрицательной' },
              ]}
            >
              <InputNumber
                placeholder="Цена"
                min={0}
                step={0.01}
                className={styles.priceInput}
                controls={false}
                onKeyDown={(e) => {
                  const allowed = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete']
                  if (allowed.includes(e.key)) return
                  if (!/^[0-9.,]$/.test(e.key)) e.preventDefault()
                }}
                parser={(v) => {
                  if (!v) return 0
                  const cleaned = String(v).replace(/[^\d.,]/g, '').replace(',', '.')
                  const num = parseFloat(cleaned)
                  return Number.isNaN(num) ? 0 : num
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item<FormValues>
              name="brand"
              label="Вендор"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input placeholder="Вендор" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item<FormValues>
              name="sku"
              label="Артикул"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input placeholder="Артикул" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className={styles.submitBtn}>
            Сохранить
          </Button>
          <Button onClick={onCancel} disabled={loading}>Отмена</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
