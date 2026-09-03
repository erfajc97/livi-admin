import { axiosInstance } from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type {
  LandingSection,
  CreateLandingSectionDto,
  UpdateLandingSectionDto,
  Product,
} from '../types'

export const landingSectionsService = {
  getAll: async (): Promise<LandingSection[]> => {
    const { data } = await axiosInstance.get<LandingSection[]>(
      API_ENDPOINTS.LANDING_SECTIONS,
    )
    // Si viene con wrapper, extraer el array
    return Array.isArray(data)
      ? data
      : (data as any)?.content || (data as any)?.data || []
  },

  getActive: async (): Promise<LandingSection[]> => {
    const { data } = await axiosInstance.get<LandingSection[]>(
      API_ENDPOINTS.LANDING_SECTIONS_ACTIVE,
    )
    // Si viene con wrapper, extraer el array
    return Array.isArray(data)
      ? data
      : (data as any)?.content || (data as any)?.data || []
  },

  getById: async (id: number): Promise<LandingSection> => {
    const { data } = await axiosInstance.get<LandingSection>(
      `${API_ENDPOINTS.LANDING_SECTION}/${id}`,
    )
    return data
  },

  create: async (dto: CreateLandingSectionDto): Promise<LandingSection> => {
    const { data } = await axiosInstance.post<LandingSection>(
      API_ENDPOINTS.LANDING_SECTIONS,
      dto,
    )
    return data
  },

  update: async (
    id: number,
    dto: UpdateLandingSectionDto,
  ): Promise<LandingSection> => {
    const { data } = await axiosInstance.patch<LandingSection>(
      `${API_ENDPOINTS.LANDING_SECTION}/${id}`,
      dto,
    )
    return data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.LANDING_SECTION}/${id}`)
  },

  addProduct: async (
    sectionId: number,
    productId: number,
  ): Promise<LandingSection> => {
    const { data } = await axiosInstance.post<LandingSection>(
      `${API_ENDPOINTS.LANDING_SECTION_ADD_PRODUCT}/${sectionId}/products/${productId}`,
    )
    return data
  },

  removeProduct: async (
    sectionId: number,
    productId: number,
  ): Promise<LandingSection> => {
    const { data } = await axiosInstance.delete<LandingSection>(
      `${API_ENDPOINTS.LANDING_SECTION_REMOVE_PRODUCT}/${sectionId}/products/${productId}`,
    )
    return data
  },

  reorderProducts: async (
    sectionId: number,
    productIds: number[],
  ): Promise<LandingSection> => {
    const { data } = await axiosInstance.patch<LandingSection>(
      `${API_ENDPOINTS.LANDING_SECTION_REORDER_PRODUCTS}/${sectionId}/products/reorder`,
      { productIds },
    )
    return data
  },

  // Helper para obtener productos disponibles
  getAvailableProducts: async (params?: {
    limit?: number
    isActive?: boolean
    /** Búsqueda del lado del servidor: el catálogo no cabe en una sola página. */
    search?: string
  }): Promise<Product[]> => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
        params,
      })

      // Extraer productos según la estructura de respuesta del backend
      // Puede venir como: { data: { content: [...] } } o { data: [...] } o directamente [...]
      let result: any

      if (Array.isArray(data)) {
        // Estructura directa: [...]
        result = data
      } else if (Array.isArray(data?.data?.data)) {
        // Estructura NestJS wrapper paginado: { data: { data: [...] } }
        result = data.data.data
      } else if (Array.isArray(data?.data)) {
        // Estructura: { data: [...] }
        result = data.data
      } else if (Array.isArray(data?.content)) {
        // Estructura: { content: [...] }
        result = data.content
      } else {
        result = []
      }

      return Array.isArray(result) ? result : []
    } catch (error) {
      console.error('Error al listar productos para la sección:', error)
      return []
    }
  },
}
