export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: number
  type: TransactionType
  category: string
  amount: number
  date: string
  paymentMethod?: string
  status: string
  description?: string
  notes?: string
  accountName?: string
  createdAt: string
  updatedAt: string
}

export interface BillItem {
  description: string
  amount: number
}

export interface Bill {
  id: number
  name: string
  description?: string
  bank?: string
  paymentMethod?: string
  dueDate: string
  amount: number
  items?: BillItem[]
  status: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionPayload {
  type: TransactionType
  category: string
  amount: number
  date: string
  paymentMethod?: string
  status?: string
  description?: string
  notes?: string
  accountName?: string
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}

export interface CreateBillPayload {
  name: string
  description?: string
  bank?: string
  paymentMethod?: string
  dueDate: string
  amount: number
  items?: { description: string; amount: number }[]
  status?: string
}

export interface UpdateBillPayload extends Partial<CreateBillPayload> {}

export interface CashFlowEntry {
  date: string
  income: number
  expense: number
}

export interface FinanceStats {
  totalIncome: number
  totalExpenses: number
  grossProfit: number
  profitMargin: number
  // Income breakdown
  salesIncome?: number
  onlineSalesCount?: number
  onlineSalesTotal?: number
  manualSalesCount?: number
  manualSalesTotal?: number
  manualIncome?: number
  // Expense breakdown
  expensesByCategory: Record<string, number>
  // Cash flow
  cashFlow: CashFlowEntry[]
  // Bills
  bills: {
    all: Bill[]
    pending: Bill[]
    overdue: Bill[]
    upcoming: Bill[]
    pendingTotal: number
    overdueCount: number
    upcomingCount: number
    pendingCount: number
  }
  // Raw data
  transactions: Transaction[]
}

export interface TransactionFormData {
  type: TransactionType
  category: string
  amount: string
  date: string
  paymentMethod: string
  description: string
  notes: string
  accountName: string
}
