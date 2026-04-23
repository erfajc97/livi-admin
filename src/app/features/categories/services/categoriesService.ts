import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  Marca,
  CreateMarcaPayload,
  UpdateMarcaPayload,
} from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

function unwrap<T>(data: T | CoreApiResponse<T>): T {
  if (data && typeof data === 'object' && 'statusCode' in data && 'data' in data) {
    return (data as CoreApiResponse<T>).data
  }
  return data as T
}

function buildFormData(payload: Record<string, unknown>, file?: File): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      fd.append(key, String(value))
    }
  }
  if (file) {
    fd.append('image', file)
  }
  return fd
}

export const categoriesService = {
  listCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES)
    const unwrapped = unwrap(data)
    if (Array.isArray(unwrapped)) return unwrapped
    if (unwrapped && typeof unwrapped === 'object' && 'data' in unwrapped) {
      return (unwrapped as { data: Category[] }).data
    }
    return []
  },

  getCategoryById: async (id: number): Promise<Category> => {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.CATEGORIES}/${id}`)
    return unwrap<Category>(data)
  },

  createCategory: async (payload: CreateCategoryPayload, file?: File): Promise<Category> => {
    if (file) {
      const fd = buildFormData(payload as unknown as Record<string, unknown>, file)
      const { data } = await axiosInstance.post(API_ENDPOINTS.CATEGORIES, fd)
      return unwrap<Category>(data)
    }
    const { data } = await axiosInstance.post(API_ENDPOINTS.CATEGORIES, payload)
    return unwrap<Category>(data)
  },

  updateCategory: async (id: number, payload: UpdateCategoryPayload, file?: File): Promise<Category> => {
    if (!file) {
      const { data } = await axiosInstance.patch(`${API_ENDPOINTS.CATEGORIES}/${id}`, payload)
      return unwrap<Category>(data)
    }
    const fd = buildFormData(payload as unknown as Record<string, unknown>, file)
    const { data } = await axiosInstance.patch(`${API_ENDPOINTS.CATEGORIES}/${id}`, fd)
    return unwrap<Category>(data)
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`)
  },
}

export const marcasService = {
  listByCategory: async (categoryId: number): Promise<Marca[]> => {
    const { data } = await axiosInstance.get(
      `${API_ENDPOINTS.MARCAS}/category/${categoryId}`,
    )
    const unwrapped = unwrap(data)
    if (Array.isArray(unwrapped)) return unwrapped
    if (unwrapped && typeof unwrapped === 'object' && 'data' in unwrapped) {
      return (unwrapped as { data: Marca[] }).data
    }
    return []
  },

  create: async (payload: CreateMarcaPayload, file?: File): Promise<Marca> => {
    if (file) {
      const fd = buildFormData(payload as unknown as Record<string, unknown>, file)
      const { data } = await axiosInstance.post(API_ENDPOINTS.MARCAS, fd)
      return unwrap<Marca>(data)
    }
    const { data } = await axiosInstance.post(API_ENDPOINTS.MARCAS, payload)
    return unwrap<Marca>(data)
  },

  update: async (id: number, payload: UpdateMarcaPayload, file?: File): Promise<Marca> => {
    if (file) {
      const fd = buildFormData(payload as unknown as Record<string, unknown>, file)
      const { data } = await axiosInstance.patch(`${API_ENDPOINTS.MARCAS}/${id}`, fd)
      return unwrap<Marca>(data)
    }
    const { data } = await axiosInstance.patch(`${API_ENDPOINTS.MARCAS}/${id}`, payload)
    return unwrap<Marca>(data)
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.MARCAS}/${id}`)
  },
}
