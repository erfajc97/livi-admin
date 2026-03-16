import { useEffect } from 'react'
import { Spinner } from '@heroui/react'
import { useComboFormHook } from '../hooks/useComboFormHook'
import { useCreateComboMutation, useUpdateComboMutation } from '../mutations/useComboMutations'
import { useComboByIdQuery } from '@/app/tanstack-queries/combosQuery'
import ComboForm from './ComboForm'
import type { Combo } from '../types'

interface ComboFormViewProps {
  combo: Combo | null
  onBack: () => void
}

export default function ComboFormView({ combo, onBack }: ComboFormViewProps) {
  const isEdit = !!combo
  const {
    formData,
    productRows,
    updateField,
    resetForm,
    loadCombo,
    addProductRow,
    updateProductRow,
    removeProductRow,
    buildPayload,
  } = useComboFormHook()

  const createMutation = useCreateComboMutation()
  const updateMutation = useUpdateComboMutation()

  const { data: fullCombo, isLoading } = useComboByIdQuery(combo?.id ?? 0, isEdit)

  useEffect(() => {
    if (fullCombo) loadCombo(fullCombo)
  }, [fullCombo, loadCombo])

  useEffect(() => {
    if (!isEdit) resetForm()
  }, [isEdit, resetForm])

  const handleSubmit = () => {
    const payload = buildPayload()
    if (isEdit && combo) {
      updateMutation.mutate({ id: combo.id, data: payload }, { onSuccess: onBack })
    } else {
      createMutation.mutate(payload, { onSuccess: onBack })
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  return (
    <ComboForm
      formData={formData}
      productRows={productRows}
      updateField={updateField}
      addProductRow={addProductRow}
      updateProductRow={updateProductRow}
      removeProductRow={removeProductRow}
      onSubmit={handleSubmit}
      onBack={onBack}
      isSubmitting={createMutation.isPending || updateMutation.isPending}
      isEdit={isEdit}
    />
  )
}
