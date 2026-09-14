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
  listProducts: async (
    filters: ProductFilters = {},
  ): Promise<PaginatedProducts> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    const { data } = await axiosInstance.get<
      CoreApiResponse<PaginatedProducts>
    >(`${API_ENDPOINTS.PRODUCTS}?${params.toString()}`)
    return data.data
  },

  getProductById: async (id: number): Promise<Product> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}?includeVariations=true`,
    )
    return data.data
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await axiosInstance.post<CoreApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS,
      payload,
    )
    return data.data
  },

  updateProduct: async (
    id: number,
    payload: UpdateProductPayload,
  ): Promise<Product> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      payload,
    )
    return data.data
  },

  /**
   * `force` borra el producto aunque tenga pedidos: los ítems del pedido se
   * desvinculan conservando precio y cantidad, así el total del pedido no
   * cambia. Sin `force` el backend responde 409 si el producto ya se vendió.
   */
  deleteProduct: async (id: number, force = false): Promise<void> => {
    await axiosInstance.delete(
      `${API_ENDPOINTS.PRODUCTS}/${id}${force ? '?force=true' : ''}`,
    )
  },

  listCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get<
      CoreApiResponse<Category[] | { data: Category[] }>
    >(API_ENDPOINTS.CATEGORIES)
    const result = data.data
    return Array.isArray(result) ? result : result.data
  },

  uploadImages: async (
    productId: number,
    files: File[],
  ): Promise<ProductImage[]> => {
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

  deleteImage: async (
    productId: number | string,
    imageId: number | string,
  ): Promise<void> => {
    await axiosInstance.delete(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/images/${imageId}`,
    )
  },

  /** Posición de la imagen en la galería: 0 es la principal. */
  updateImageOrder: async (
    productId: number | string,
    imageId: number | string,
    displayOrder: number,
  ): Promise<void> => {
    await axiosInstance.patch(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/images/${imageId}`,
      { displayOrder },
    )
  },

  uploadVariationImages: async (
    variationId: number,
    files: File[],
  ): Promise<void> => {
    const fd = new FormData()
    files.forEach((file) => fd.append('files', file))
    await axiosInstance.post(`/product-variations/${variationId}/images`, fd)
  },

  deleteVariationImage: async (
    variationId: number | string,
    imageId: number | string,
  ): Promise<void> => {
    await axiosInstance.delete(
      `/product-variations/${variationId}/images/${imageId}`,
    )
  },

  createVariation: async (payload: {
    productId: number
    name?: string
    price?: number
    cost?: number
    sku?: string
    colorHex?: string
    size?: string
  }): Promise<{ id: number }> => {
    const { data } = await axiosInstance.post<CoreApiResponse<{ id: number }>>(
      '/product-variations',
      payload,
    )
    return data.data
  },

  updateVariation: async (
    id: number,
    payload: {
      name?: string
      price?: number
      cost?: number
      sku?: string
      colorHex?: string
      size?: string
    },
  ): Promise<void> => {
    await axiosInstance.patch(`/product-variations/${id}`, payload)
  },

  deleteVariation: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/product-variations/${id}`)
  },

  // ── Inventory / Stock ─────────────────────────────

  getInventory: async (productId: number): Promise<any> => {
    const { data } = await axiosInstance.get<CoreApiResponse<any>>(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/inventory`,
    )
    return data.data
  },
}
