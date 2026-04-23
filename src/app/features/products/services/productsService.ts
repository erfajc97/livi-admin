import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type {
  Product,
  ProductImage,
  CreateProductPayload,
  UpdateProductPayload,
  PaginatedProducts,
  ProductFilters,
  Category,
} from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const productsService = {
  listProducts: async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    const { data } = await axiosInstance.get<CoreApiResponse<PaginatedProducts>>(
      `${API_ENDPOINTS.PRODUCTS}?${params.toString()}`
    )
    return data.data
  },

  getProductById: async (id: number): Promise<Product> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}?includeVariations=true`
    )
    return data.data
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await axiosInstance.post<CoreApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS,
      payload
    )
    return data.data
  },

  updateProduct: async (id: number, payload: UpdateProductPayload): Promise<Product> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      payload
    )
    return data.data
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`)
  },

  listCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Category[] | { data: Category[] }>>(
      API_ENDPOINTS.CATEGORIES
    )
    const result = data.data
    return Array.isArray(result) ? result : result.data
  },

  uploadImages: async (productId: number, files: File[]): Promise<ProductImage[]> => {
    const fd = new FormData()
    files.forEach((file) => fd.append('files', file))
    const { data } = await axiosInstance.post<CoreApiResponse<ProductImage[]>>(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/images`,
      fd,
    )
    return data.data
  },

  listImages: async (productId: number): Promise<ProductImage[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<ProductImage[]>>(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/images`,
    )
    return data.data
  },

  deleteImage: async (productId: number, imageId: number): Promise<void> => {
    await axiosInstance.delete(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/images/${imageId}`,
    )
  },

  uploadVariationImages: async (variationId: number, files: File[]): Promise<void> => {
    const fd = new FormData()
    files.forEach((file) => fd.append('files', file))
    await axiosInstance.post(`/product-variations/${variationId}/images`, fd)
  },

  deleteVariationImage: async (variationId: number, imageId: number): Promise<void> => {
    await axiosInstance.delete(`/product-variations/${variationId}/images/${imageId}`)
  },
}
