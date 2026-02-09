import { useState, useCallback, useEffect } from 'react'
import { Input, InputNumber } from 'antd'
import { useProductsStore } from '../../model/products-store'
import type { Product } from '@/entities/product'
import styles from './EditableCell.module.css'

type FieldKey = keyof Pick<Product, 'title' | 'price' | 'brand' | 'sku'>

interface EditableCellProps {
  productId: number
  field: FieldKey
  value: unknown
  className?: string
}

export function EditableCell({ productId, field, value, className }: EditableCellProps) {
  const patchLocalEdit = useProductsStore((s) => s.patchLocalEdit)
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState<string | number>(field === 'price' ? (typeof value === 'number' ? value : 0) : String(value ?? ''))

  useEffect(() => {
    setInputValue(
      field === 'price'
        ? typeof value === 'number'
          ? value
          : 0
        : String(value ?? '')
    )
  }, [value, field])

  const save = useCallback(() => {
    setEditing(false)
    if (field === 'price') {
      const num = typeof inputValue === 'number' ? inputValue : parseFloat(String(inputValue).replace(',', '.'))
      if (!Number.isNaN(num) && num >= 0) patchLocalEdit(productId, { price: num })
    } else {
      const str = String(inputValue).trim()
      if (str !== String(value ?? '')) patchLocalEdit(productId, { [field]: str })
    }
  }, [field, inputValue, productId, value, patchLocalEdit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') save()
      if (e.key === 'Escape') setEditing(false)
    },
    [save]
  )

  const priceKeyDown = useCallback((e: React.KeyboardEvent) => {
    const allowed = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete']
    if (allowed.includes(e.key)) return
    if (/^[0-9.,]$/.test(e.key)) return
    e.preventDefault()
  }, [])

  const parsePrice = useCallback((v: string) => {
    const cleaned = v.replace(/[^\d.,]/g, '').replace(',', '.')
    const num = parseFloat(cleaned)
    return Number.isNaN(num) ? 0 : num
  }, [])

  if (editing) {
    return field === 'price' ? (
      <InputNumber
        value={inputValue as number}
        onChange={(v) => setInputValue(v ?? 0)}
        onBlur={save}
        onKeyDown={(e) => { priceKeyDown(e); handleKeyDown(e) }}
        parser={(v) => (v ? parsePrice(String(v)) : 0)}
        min={0}
        step={0.01}
        size="small"
        className={styles.inputFullWidth}
        autoFocus
        controls={false}
      />
    ) : (
      <Input
        value={inputValue as string}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        size="small"
        autoFocus
      />
    )
  }

  const display =
    field === 'price' && typeof value === 'number'
      ? (() => {
          const formatted = new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          }).format(value)
          const sep = formatted.lastIndexOf(',')
          if (sep === -1) return formatted
          const intPart = formatted.slice(0, sep)
          const decPart = formatted.slice(sep + 1)
          return (
            <>
              {`${intPart},`}
              <span className={styles.priceDecimals}>{decPart}</span>
            </>
          )
        })()
      : String(value ?? '—')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
      className={[styles.cellWrapper, 'ant-table-cell-edit', className].filter(Boolean).join(' ')}
    >
      {display}
    </div>
  )
}
