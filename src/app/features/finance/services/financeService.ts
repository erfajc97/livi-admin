import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type {
  Transaction,
  Bill,
  FinanceStats,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  CreateBillPayload,
  UpdateBillPayload,
} from '../types'

interface CoreApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export const financeService = {
  // Stats
  getStats: async (month?: string): Promise<FinanceStats> => {
    const params = month ? { month } : {}
    const { data } = await axiosInstance.get<CoreApiResponse<FinanceStats>>(
      API_ENDPOINTS.FINANCE_STATS,
      { params }
    )
    return data.data
  },

  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Transaction[]>>(
      API_ENDPOINTS.FINANCE_TRANSACTIONS
    )
    return data.data
  },

  createTransaction: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    const { data } = await axiosInstance.post<CoreApiResponse<Transaction>>(
      API_ENDPOINTS.FINANCE_TRANSACTIONS,
      payload
    )
    return data.data
  },

  updateTransaction: async (id: number, payload: UpdateTransactionPayload): Promise<Transaction> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<Transaction>>(
      `${API_ENDPOINTS.FINANCE_TRANSACTIONS}/${id}`,
      payload
    )
    return data.data
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.FINANCE_TRANSACTIONS}/${id}`)
  },

  // Bills
  getBills: async (): Promise<Bill[]> => {
    const { data } = await axiosInstance.get<CoreApiResponse<Bill[]>>(API_ENDPOINTS.FINANCE_BILLS)
    return data.data
  },

  createBill: async (payload: CreateBillPayload): Promise<Bill> => {
    const { data } = await axiosInstance.post<CoreApiResponse<Bill>>(
      API_ENDPOINTS.FINANCE_BILLS,
      payload
    )
    return data.data
  },

  updateBill: async (id: number, payload: UpdateBillPayload): Promise<Bill> => {
    const { data } = await axiosInstance.patch<CoreApiResponse<Bill>>(
      `${API_ENDPOINTS.FINANCE_BILLS}/${id}`,
      payload
    )
    return data.data
  },

  deleteBill: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.FINANCE_BILLS}/${id}`)
  },
}
