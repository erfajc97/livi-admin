import { useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { marcasService } from '../services/categoriesService'
import {
  useCreateMarcaMutation,
  useUpdateMarcaMutation,
  useDeleteMarcaMutation,
} from '../mutations/useMarcaMutations'
import type { Marca, MarcaFormData } from '../types'

const emptyForm: MarcaFormData = {
  name: '',
  description: '',
  isActive: true,
  bajoPedido: false,
  imageFile: null,
  imagePreview: null,
}

export function useMarcaHook(categoryId: number | null) {
  const [editId, setEditId] = useState<number | null>(null)
  const [formData, setFormData] = useState<MarcaFormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Marca | null>(null)

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onOpenChange: onFormOpenChange,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()

  const { data: marcas = [], isLoading } = useQuery({
    queryKey: ['marcas', categoryId],
    queryFn: () => marcasService.listByCategory(categoryId!),
    enabled: categoryId !== null,
  })

  const createMutation = useCreateMarcaMutation()
  const updateMutation = useUpdateMarcaMutation()
  const deleteMutation = useDeleteMarcaMutation()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onInputChange = (
    field: keyof MarcaFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onImageChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: file ? URL.createObjectURL(file) : null,
    }))
  }

  const handleCreateClick = () => {
    setEditId(null)
    setFormData(emptyForm)
    onFormOpen()
  }

  const handleEditClick = (marca: Marca) => {
    setEditId(marca.id)
    setFormData({
      name: marca.name,
      description: marca.description ?? '',
      isActive: marca.isActive,
      bajoPedido: marca.bajoPedido ?? false,
      imageFile: null,
      imagePreview: marca.imageUrl ?? null,
    })
    onFormOpen()
  }

  const handleDeleteClick = (marca: Marca) => {
    setDeleteTarget(marca)
    onDeleteOpen()
  }

  const handleSubmit = () => {
    const file = formData.imageFile ?? undefined
    if (editId && categoryId) {
      updateMutation.mutate(
        {
          id: editId,
          data: {
            name: formData.name,
            description: formData.description || undefined,
            isActive: formData.isActive,
            bajoPedido: formData.bajoPedido,
          },
          file,
        },
        { onSuccess: () => onFormOpenChange() },
      )
    } else if (categoryId) {
      createMutation.mutate(
        {
          name: formData.name,
          categoryId,
          description: formData.description || undefined,
          isActive: formData.isActive,
          bajoPedido: formData.bajoPedido,
          file,
        },
        { onSuccess: () => onFormOpenChange() },
      )
    }
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => onDeleteOpenChange(),
      })
    }
  }

  const handleFormModalOpenChange = (open: boolean) => {
    if (!open) {
      setEditId(null)
      setFormData(emptyForm)
    }
    onFormOpenChange()
  }

  return {
    marcas,
    isLoading,
    formData,
    isEditing: Boolean(editId),
    isSubmitting,
    isFormOpen,
    isDeleteOpen,
    isDeleting: deleteMutation.isPending,
    deleteTarget,
    onInputChange,
    onImageChange,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleConfirmDelete,
    handleFormModalOpenChange,
    onDeleteOpenChange,
  }
}
