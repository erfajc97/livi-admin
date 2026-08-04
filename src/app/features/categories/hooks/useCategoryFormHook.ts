import { useState } from 'react'
import type {
  Category,
  CategoryFormData,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types'
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '../mutations/useCategoryMutations'

const emptyForm: CategoryFormData = {
  name: '',
  description: '',
  isActive: true,
  bajoPedido: false,
}

interface UseCategoryFormHookParams {
  id: number | null
  onSuccess: () => void
}

export function useCategoryFormHook({
  id,
  onSuccess,
}: UseCategoryFormHookParams) {
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation()

  const isThereId = Boolean(id)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onInputChange = (
    field: keyof CategoryFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onImageChange = (file: File | null) => {
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(null)
    }
  }

  const handleToEditForm = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description ?? '',
      isActive: category.isActive,
      bajoPedido: category.bajoPedido ?? false,
    })
    setImagePreview(category.imageUrl)
    setImageFile(null)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = () => {
    if (isThereId && id) {
      const payload: UpdateCategoryPayload = {
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
        bajoPedido: formData.bajoPedido,
      }
      updateMutation.mutate(
        { id, data: payload, file: imageFile ?? undefined },
        { onSuccess },
      )
    } else {
      const payload: CreateCategoryPayload = {
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
        bajoPedido: formData.bajoPedido,
      }
      createMutation.mutate(
        { data: payload, file: imageFile ?? undefined },
        { onSuccess },
      )
    }
  }

  return {
    formData,
    imagePreview,
    isThereId,
    isSubmitting,
    onInputChange,
    onImageChange,
    handleToEditForm,
    resetForm,
    handleSubmit,
  }
}
