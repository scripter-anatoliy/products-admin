import { useState, useCallback } from 'react'
import { Button, Input } from '@/shared/ui'
import { useProductsStore } from '../../model/products-store'
import { addProduct } from '@/entities/product'
import { useAuthStore } from '@/entities/auth'
import styles from './AddProductRow.module.css'

interface AddProductRowProps {
  onCancel: () => void
  onSuccess: () => void
}

const INIT = { title: '', price: '', brand: '', sku: '' }

export function AddProductRow({ onCancel, onSuccess }: AddProductRowProps) {
  const token = useAuthStore((s) => s.token)
  const addLocalProduct = useProductsStore((s) => s.addLocalProduct)
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof INIT, string>>>({})
  const [loading, setLoading] = useState(false)

  const validate = useCallback(() => {
    const next: Partial<Record<keyof typeof INIT, string>> = {}
    if (!form.title.trim()) next.title = 'Обязательное поле'
    const p = form.price.replace(',', '.')
    if (!p.trim()) next.price = 'Обязательное поле'
    else if (Number.isNaN(Number(p)) || Number(p) < 0) next.price = 'Некорректная цена'
    if (!form.brand.trim()) next.brand = 'Обязательное поле'
    if (!form.sku.trim()) next.sku = 'Обязательное поле'
    setErrors(next)
    return Object.keys(next).length === 0
  }, [form])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrors({})
      if (!validate()) return
      setLoading(true)
      try {
        const product = await addProduct(
          {
            title: form.title.trim(),
            price: Number(form.price.replace(',', '.')),
            brand: form.brand.trim(),
            sku: form.sku.trim(),
          },
          { token: token ?? undefined }
        )
        addLocalProduct(product)
        onSuccess()
        onCancel()
      } catch {
        setErrors({ title: 'Ошибка добавления. Повторите попытку.' })
      } finally {
        setLoading(false)
      }
    },
    [form, token, validate, addLocalProduct, onSuccess, onCancel]
  )

  return (
    <tr className={styles.row}>
      <td colSpan={6}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <span className={styles.formCell}>
              <Input
                placeholder="Наименование"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                error={errors.title}
                disabled={loading}
              />
            </span>
            <span className={styles.formCell}>
              <Input
                placeholder="Цена"
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                error={errors.price}
                disabled={loading}
              />
            </span>
            <span className={styles.formCell}>
              <Input
                placeholder="Вендор"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                error={errors.brand}
                disabled={loading}
              />
            </span>
            <span className={styles.formCell}>
              <Input
                placeholder="Артикул"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                error={errors.sku}
                disabled={loading}
              />
            </span>
            <span className={styles.actions}>
              <Button type="submit" disabled={loading}>
                {loading ? '…' : 'Сохранить'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                Отмена
              </Button>
            </span>
          </div>
        </form>
      </td>
    </tr>
  )
}
