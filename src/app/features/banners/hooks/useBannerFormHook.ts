import { useState } from 'react'
import type { Banner, BannerFormData, CreateBannerPayload, UpdateBannerPayload } from '../types'
import { useCreateBannerMutation, useUpdateBannerMutation } from '../mutations/useBannerMutations'

const emptyForm: BannerFormData = {
  title: '',
  subtitle: '',
  link: '',
  buttonText: '',
  type: 'hero',
  isVisible: true,
  categoryId: '',
  marcaId: '',
}

interface UseBannerFormHookParams {
  id: string | null
  onSuccess: () => void
}

export function useBannerFormHook({ id, onSuccess }: UseBannerFormHookParams) {
  const [formData, setFormData] = useState<BannerFormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const createMutation = useCreateBannerMutation()
  const updateMutation = useUpdateBannerMutation()

  const isThereId = Boolean(id)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onInputChange = (field: keyof BannerFormData, value: string | boolean) => {
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

  const handleToEditForm = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      link: banner.link ?? '',
      buttonText: banner.buttonText ?? '',
      type: banner.type ?? 'hero',
      isVisible: banner.isVisible,
      categoryId: banner.categoryId ? String(banner.categoryId) : '',
      marcaId: banner.marcaId ? String(banner.marcaId) : '',
    })
    setImagePreview(banner.imageUrl)
    setImageFile(null)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = () => {
    const base: Omit<CreateBannerPayload, 'title'> = {
      subtitle: formData.subtitle || undefined,
      link: formData.link || undefined,
      buttonText: formData.buttonText || undefined,
      type: formData.type,
      isVisible: formData.isVisible,
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      marcaId: formData.marcaId ? Number(formData.marcaId) : undefined,
    }

    if (isThereId && id) {
      const payload: UpdateBannerPayload = { title: formData.title, ...base }
      updateMutation.mutate({ id, data: payload, file: imageFile ?? undefined }, { onSuccess })
    } else {
      const payload: CreateBannerPayload = { title: formData.title, ...base }
      createMutation.mutate({ data: payload, file: imageFile ?? undefined }, { onSuccess })
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
