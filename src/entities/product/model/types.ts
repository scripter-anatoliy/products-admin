export interface Product {
  id: number
  title: string
  description?: string
  price: number
  discountPercentage?: number
  rating: number
  stock?: number
  brand: string
  category?: string
  thumbnail?: string
  images?: string[]
  sku?: string
  minimumOrderQuantity?: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type ProductSortField = 'title' | 'price' | 'rating' | 'brand'
export type SortOrder = 'asc' | 'desc'

export interface AddProductPayload {
  title: string
  price: number
  brand: string
  sku?: string
}
