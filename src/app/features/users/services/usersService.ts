import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type { CreateUserPayload, UpdateUserPayload, User } from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const usersService = {
  listUsers: async (page = 1, limit = 10): Promise<User[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<User[]>>(
      `${API_ENDPOINTS.USERS}?page=${page}&limit=${limit}`
    )
    return data.data
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await axiosInstance.get<CoreApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`)
    return data.data
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await axiosInstance.post<CoreApiResponse<User>>(API_ENDPOINTS.USERS, payload)
    return data.data
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`, payload)
    return data.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.USERS}/${id}`)
  },
}
