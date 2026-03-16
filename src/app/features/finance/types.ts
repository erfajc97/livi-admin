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

export interface Bill {
  id: number
  name: string
  bank?: string
  dueDate: string
  amount: number
  status: string
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
  bank?: string
  dueDate: string
  amount: number
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
  expensesByCategory: Record<string, number>
  cashFlow: CashFlowEntry[]
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
  expensesMonth: number
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
