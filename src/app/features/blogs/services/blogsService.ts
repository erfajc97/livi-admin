import { axiosInstance } from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { BlogPost, CreateBlogPostDto, UpdateBlogPostDto } from '../types'

export const blogsService = {
  async getAll(): Promise<BlogPost[]> {
    const { data } = await axiosInstance.get(API_ENDPOINTS.BLOG)
    // Backend wrapper: { statusCode, data: [...] }
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : []
  },

  async getById(id: string): Promise<BlogPost> {
    const { data } = await axiosInstance.get<BlogPost>(
      `${API_ENDPOINTS.BLOG}/${id}`,
    )
    return data
  },

  async create(formData: FormData): Promise<BlogPost> {
    const { data } = await axiosInstance.post<BlogPost>(
      API_ENDPOINTS.BLOG,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },

  async update(id: string, formData: FormData): Promise<BlogPost> {
    const { data } = await axiosInstance.patch<BlogPost>(
      `${API_ENDPOINTS.BLOG}/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${API_ENDPOINTS.BLOG}/${id}`)
  },

  async reorder(orderedIds: number[]): Promise<void> {
    await axiosInstance.patch(API_ENDPOINTS.BLOG_REORDER, { orderedIds })
  },
}
