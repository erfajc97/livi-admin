import { useState, useCallback } from 'react'
import {
  useCreateTransactionMutation,
  useCreateBillMutation,
  useUpdateBillMutation,
} from '../mutations/useFinanceMutations'
import type {
  TransactionFormData,
  TransactionType,
  CreateBillPayload,
} from '../types'

const INITIAL_FORM: TransactionFormData = {
  type: 'expense',
  category: 'Paquetería',
  amount: '0.00',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'Efectivo',
  description: '',
  notes: '',
  accountName: '',
}

export function useFinanceManagementHook() {
  const [activeTab, setActiveTab] = useState<'transaction' | 'bills'>(
    'transaction',
  )
  const [formData, setFormData] = useState<TransactionFormData>(INITIAL_FORM)

  const createTxMutation = useCreateTransactionMutation()
  const createBillMutation = useCreateBillMutation()
  const updateBillMutation = useUpdateBillMutation()

  const updateField = useCallback(
    <K extends keyof TransactionFormData>(
      key: K,
      value: TransactionFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM)
  }, [])

  const handleSubmitTransaction = useCallback(() => {
    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) return

    createTxMutation.mutate(
      {
        type: formData.type,
        category: formData.category,
        amount,
        date: formData.date,
        paymentMethod: formData.paymentMethod || undefined,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
        accountName: formData.accountName || undefined,
      },
      { onSuccess: () => resetForm() },
    )
  }, [formData, createTxMutation, resetForm])

  const handleMarkBillPaid = useCallback(
    (id: number) => {
      updateBillMutation.mutate({ id, payload: { status: 'paid' } })
    },
    [updateBillMutation],
  )

  const handleCreateBill = useCallback(
    (payload: CreateBillPayload) => {
      createBillMutation.mutate(payload)
    },
    [createBillMutation],
  )

  return {
    activeTab,
    setActiveTab,
    formData,
    updateField,
    resetForm,
    handleSubmitTransaction,
    handleMarkBillPaid,
    handleCreateBill,
    isSubmitting: createTxMutation.isPending,
    isBillSubmitting: createBillMutation.isPending,
  }
}
