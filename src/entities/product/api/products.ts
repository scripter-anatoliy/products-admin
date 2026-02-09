import { get, post, put, type RequestConfig } from '@/shared/api/base'
import type { Product, ProductsResponse, AddProductPayload } from '../model/types'

const FIELDS = 'id,title,price,rating,brand,sku,minimumOrderQuantity,category,stock'

function buildProductsUrl(params: {
  q?: string
  limit?: number
  skip?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}): string {
  const base = params.q ? '/products/search' : '/products'
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  search.set('select', FIELDS)
  if (params.limit != null) search.set('limit', String(params.limit))
  if (params.skip != null) search.set('skip', String(params.skip))
  if (params.sortBy) search.set('sortBy', params.sortBy)
  if (params.order) search.set('order', params.order)
  return `${base}?${search.toString()}`
}

export async function fetchProducts(
  params: {
    q?: string
    limit?: number
    skip?: number
    sortBy?: string
    order?: 'asc' | 'desc'
  } = {},
  config?: RequestConfig
): Promise<ProductsResponse> {
  return get<ProductsResponse>(buildProductsUrl(params), config)
}

export async function addProduct(
  payload: AddProductPayload,
  config?: RequestConfig
): Promise<Product> {
  return post<Product>('/products/add', payload, config)
}

export async function updateProduct(
  id: number,
  payload: Partial<AddProductPayload & { rating?: number; minimumOrderQuantity?: number }>,
  config?: RequestConfig
): Promise<Product> {
  return put<Product>(`/products/${id}`, payload, config)
}
