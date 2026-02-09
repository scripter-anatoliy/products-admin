import { useMemo, useState } from 'react'
import { Table, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import type { Product, ProductSortField } from '@/entities/product'
import { useProductsStore } from '@/features/products/model/products-store'
import { EditableCell } from '@/features/products/ui/EditableCell'
import { QuantityBars, IconDots, IconPlus } from '@/shared/ui'
import styles from './ProductsTable.module.css'

export function ProductsTable() {
  const items = useProductsStore((s) => s.items)
  const sortBy = useProductsStore((s) => s.sortBy)
  const sortOrder = useProductsStore((s) => s.sortOrder)
  const columnWidths = useProductsStore((s) => s.columnWidths)
  const setSort = useProductsStore((s) => s.setSort)
  const getProduct = useProductsStore((s) => s.getProduct)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const sortedItems = useMemo(() => {
    if (!sortBy) return items
    const ord = sortOrder === 'asc' ? 1 : -1
    return [...items].sort((a, b) => {
      const av = a[sortBy] ?? ''
      const bv = b[sortBy] ?? ''
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * ord
      return String(av).localeCompare(String(bv)) * ord
    })
  }, [items, sortBy, sortOrder])

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: 'Наименование',
        dataIndex: 'title',
        key: 'title',
        width: columnWidths.title ?? 240,
        sorter: true,
        sortOrder: sortBy === 'title' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        render: (_: unknown, record: Product) => {
          const product = getProduct(record.id) ?? record
          const category = product.category ?? ''
          return (
            <div className={styles.nameCell}>
              <EditableCell
                productId={record.id}
                field="title"
                value={product.title}
                className={styles.nameTitle}
              />
              {category && (
                <span className={styles.nameCategory}>{category}</span>
              )}
            </div>
          )
        },
      },
      {
        title: 'Вендор',
        dataIndex: 'brand',
        key: 'brand',
        width: columnWidths.brand ?? 120,
        sorter: true,
        sortOrder: sortBy === 'brand' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        render: (_: unknown, record: Product) => {
          const product = getProduct(record.id) ?? record
          return (
            <span className={styles.vendorCell}>
              <EditableCell
                productId={record.id}
                field="brand"
                value={product.brand}
              />
            </span>
          )
        },
      },
      {
        title: 'Артикул',
        dataIndex: 'sku',
        key: 'sku',
        width: columnWidths.sku ?? 120,
        render: (_: unknown, record: Product) => {
          const product = getProduct(record.id) ?? record
          return (
            <EditableCell
              productId={record.id}
              field="sku"
              value={product.sku}
            />
          )
        },
      },
      {
        title: 'Оценка',
        dataIndex: 'rating',
        key: 'rating',
        width: 100,
        sorter: true,
        sortOrder: sortBy === 'rating' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        render: (_: unknown, record: Product) => {
          const product = getProduct(record.id) ?? record
          const rating = product.rating ?? 0
          const isLow = rating < 3
          return (
            <span className={isLow ? styles.ratingValueLow : undefined}>
              {typeof rating === 'number' ? `${rating.toFixed(1)}/5` : '—'}
            </span>
          )
        },
      },
      {
        title: 'Цена, ₽',
        dataIndex: 'price',
        key: 'price',
        width: 130,
        sorter: true,
        sortOrder: sortBy === 'price' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        render: (_: unknown, record: Product) => {
          const product = getProduct(record.id) ?? record
          const price = product.price
          return (
            <EditableCell
              productId={record.id}
              field="price"
              value={price}
            />
          )
        },
      },
      {
        title: 'Количество',
        dataIndex: 'stock',
        key: 'stock',
        width: 140,
        align: 'center',
        render: (_: unknown, record: Product) => {
          const product = getProduct(record.id) ?? record
          const stock = product.stock ?? 0
          return <QuantityBars value={stock} max={100} />
        },
      },
      {
        title: '',
        key: 'actions',
        width: 100,
        align: 'center',
        render: () => (
          <div className={styles.rowActions}>
            <Button
              type="primary"
              size="small"
              icon={<IconPlus size={16} />}
              className={styles.actionPlus}
            />
            <Button
              type="text"
              size="small"
              icon={<IconDots size={20} />}
              className={styles.actionDots}
            />
          </div>
        ),
      },
    ],
    [columnWidths, sortBy, sortOrder, getProduct]
  )

  const handleTableChange = (
    _: unknown,
    __: unknown,
    sorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter
    if (s?.field != null && s.order)
      setSort(
        s.field as ProductSortField,
        s.order === 'ascend' ? 'asc' : 'desc'
      )
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  return (
    <Table<Product>
      rowKey="id"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={sortedItems}
      onChange={handleTableChange}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showTotal: (total, range) => (
          <>
            <span className={styles.paginationGray}>Показано</span>{' '}
            <span className={styles.paginationBlack}>{range[0]}-{range[1]}</span>{' '}
            <span className={styles.paginationGray}>из</span>{' '}
            <span className={styles.paginationBlack}>{total}</span>
          </>
        ),
        size: 'default',
        showTitle: false,
      }}
      locale={{ emptyText: 'Нет данных' }}
      className={styles.table}
    />
  )
}
