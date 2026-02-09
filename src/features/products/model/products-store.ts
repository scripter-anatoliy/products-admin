import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, ProductSortField, SortOrder } from '@/entities/product'

const PRODUCTS_UI_KEY = 'products-ui'

const DEFAULT_WIDTHS: Record<string, number> = {
  title: 220,
  price: 100,
  brand: 140,
  sku: 120,
  rating: 100,
  minimumOrderQuantity: 120,
}

type ProductsState = {
  items: Product[]
  loading: boolean
  error: string | null
  searchQuery: string
  sortBy: ProductSortField | null
  sortOrder: SortOrder
  columnWidths: Record<string, number>
  localEdits: Record<number, Partial<Product>>
  setItems: (items: Product[]) => void
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setSearchQuery: (q: string) => void
  setSort: (sortBy: ProductSortField | null, sortOrder?: SortOrder) => void
  setColumnWidth: (key: string, width: number) => void
  setColumnWidths: (widths: Record<string, number>) => void
  patchLocalEdit: (id: number, patch: Partial<Product>) => void
  clearLocalEdit: (id: number) => void
  addLocalProduct: (product: Product) => void
  getProduct: (id: number) => Product | undefined
  reset: () => void
}

const initialState = {
  items: [],
  loading: false,
  error: null as string | null,
  searchQuery: '',
  sortBy: null as ProductSortField | null,
  sortOrder: 'asc' as SortOrder,
  columnWidths: { ...DEFAULT_WIDTHS },
  localEdits: {} as Record<number, Partial<Product>>,
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setItems: (items) => set({ items, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSort: (sortBy, sortOrder) =>
        set((s) => ({
          sortBy,
          sortOrder: sortOrder ?? (s.sortBy === sortBy && s.sortOrder === 'asc' ? 'desc' : 'asc'),
        })),
      setColumnWidth: (key, width) =>
        set((s) => ({
          columnWidths: { ...s.columnWidths, [key]: Math.max(60, width) },
        })),
      setColumnWidths: (widths) => set({ columnWidths: { ...DEFAULT_WIDTHS, ...widths } }),
      patchLocalEdit: (id, patch) =>
        set((s) => ({
          localEdits: {
            ...s.localEdits,
            [id]: { ...s.localEdits[id], ...patch },
          },
        })),
      clearLocalEdit: (id) =>
        set((s) => {
          const next = { ...s.localEdits }
          delete next[id]
          return { localEdits: next }
        }),
      addLocalProduct: (product) =>
        set((s) => ({ items: [product, ...s.items] })),
      getProduct: (id) => {
        const s = get()
        const base = s.items.find((p) => p.id === id)
        if (!base) return undefined
        const edit = s.localEdits[id]
        return edit ? { ...base, ...edit } : base
      },
      reset: () => set(initialState),
    }),
    {
      name: PRODUCTS_UI_KEY,
      partialize: (s) => ({
        sortBy: s.sortBy,
        sortOrder: s.sortOrder,
        columnWidths: s.columnWidths,
      }),
    }
  )
)
