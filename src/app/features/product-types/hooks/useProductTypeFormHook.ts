import { useState } from 'react'
import type {
  ProductType,
  ProductTypeFormData,
  CreateProductTypePayload,
  UpdateProductTypePayload,
} from '../types'
import {
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
} from '../mutations/useProductTypeMutations'

const emptyForm: ProductTypeFormData = {
  name: '',
  description: '',
  isActive: true,
}

interface UseProductTypeFormHookParams {
  id: number | null
  onSuccess: () => void
}

export function useProductTypeFormHook({
  id,
  onSuccess,
}: UseProductTypeFormHookParams) {
  const [formData, setFormData] = useState<ProductTypeFormData>(emptyForm)

  const createMutation = useCreateProductTypeMutation()
  const updateMutation = useUpdateProductTypeMutation()

  const isThereId = Boolean(id)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onInputChange = (
    field: keyof ProductTypeFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleToEditForm = (item: ProductType) => {
    setFormData({
      name: item.name,
      description: item.description ?? '',
      isActive: item.isActive,
    })
  }

  const resetForm = () => {
    setFormData(emptyForm)
  }

  const handleSubmit = () => {
    if (isThereId && id) {
      const payload: UpdateProductTypePayload = {
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
      }
      updateMutation.mutate({ id, data: payload }, { onSuccess })
    } else {
      const payload: CreateProductTypePayload = {
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
      }
      createMutation.mutate(payload, { onSuccess })
    }
  }

  return {
    formData,
    isThereId,
    isSubmitting,
    onInputChange,
    handleToEditForm,
    resetForm,
    handleSubmit,
  }
}
