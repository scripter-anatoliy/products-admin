import { useEffect, useState, useCallback } from 'react'
import { Input, Button, Alert, Spin, Badge } from 'antd'
import { App } from 'antd'
import { ProductsTable } from '@/widgets/ProductsTable'
import { AddProductForm } from '@/features/products/ui/AddProductForm'
import { useProductsStore } from '@/features/products/model/products-store'
import { fetchProducts } from '@/entities/product'
import { useAuthStore } from '@/entities/auth'
import { debounce } from '@/shared/lib/debounce'
import { IconGlobal, IconBell, IconMail, IconFilter, IconAdd, IconSearch, IconRefresh, IconFilterLines } from '@/shared/ui'
import styles from './ProductsPage.module.css'

const SEARCH_DEBOUNCE_MS = 400

export function ProductsPage() {
  const { message } = App.useApp()
  const token = useAuthStore((s) => s.token)
  const loading = useProductsStore((s) => s.loading)
  const searchQuery = useProductsStore((s) => s.searchQuery)
  const setItems = useProductsStore((s) => s.setItems)
  const setLoading = useProductsStore((s) => s.setLoading)
  const setError = useProductsStore((s) => s.setError)
  const setSearchQuery = useProductsStore((s) => s.setSearchQuery)
  const error = useProductsStore((s) => s.error)

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const loadProducts = useCallback(
    async (q?: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchProducts(
          { q: q?.trim() || undefined, limit: 100 },
          { token: token ?? undefined }
        )
        setItems(res.products)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки')
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [token, setItems, setLoading, setError]
  )

  useEffect(() => {
    loadProducts(searchQuery)
  }, [searchQuery, loadProducts])

  const debouncedSearch = useCallback(
    debounce((q: string) => setSearchQuery(q), SEARCH_DEBOUNCE_MS),
    []
  )

  useEffect(() => {
    debouncedSearch(searchInput)
  }, [searchInput])

  const handleAddSuccess = useCallback(() => {
    message.success('Товар успешно добавлен')
    setShowAddForm(false)
  }, [message])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Товары</h1>
        <div className={styles.headerRight}>
          <Input
            placeholder="Найти"
            prefix={<IconSearch size={20} className={styles.searchIcon} />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            allowClear
            className={styles.search}
          />
          <span className={styles.headerSeparator} aria-hidden />
          <button type="button" className={styles.headerIconBtn} aria-label="Язык">
            <IconGlobal size={20} className={styles.headerIconSvg} />
          </button>
          <Badge count={12} size="small" color="#797FE9" offset={[-4, 2]} className={styles.bellBadge}>
            <button type="button" className={styles.headerIconBtn} aria-label="Уведомления">
              <IconBell size={20} className={styles.headerIconSvg} />
            </button>
          </Badge>
          <button type="button" className={styles.headerIconBtn} aria-label="Почта">
            <IconMail size={20} className={styles.headerIconSvg} />
          </button>
          <button type="button" className={styles.headerIconBtn} aria-label="Фильтры">
            <IconFilter size={20} className={styles.headerIconSvg} />
          </button>
        </div>
      </header>

      {loading && (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      )}
      {error && (
        <Alert type="error" message={error} showIcon className={styles.alert} />
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Все позиции</h2>
          <div className={styles.sectionActions}>
            <Button
              type="text"
              icon={<IconRefresh size={22} className={styles.refreshIcon} />}
              onClick={() => loadProducts(searchQuery)}
              title="Обновить"
              className={styles.refreshBtn}
            />
            <Button
              type="text"
              icon={<IconFilterLines size={22} className={styles.filterSectionIcon} />}
              title="Фильтр"
              className={styles.filterBtn}
            />
            <Button
              type="primary"
              icon={<IconAdd size={18} className={styles.addBtnIcon} />}
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm}
              className={styles.addBtn}
            >
              Добавить
            </Button>
          </div>
        </div>

        {showAddForm && (
          <AddProductForm
            onCancel={() => setShowAddForm(false)}
            onSuccess={handleAddSuccess}
          />
        )}

        <ProductsTable />
      </section>
    </div>
  )
}
