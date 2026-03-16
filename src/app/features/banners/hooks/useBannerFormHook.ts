import { useState } from 'react'
import type { Banner, BannerFormData, CreateBannerPayload, UpdateBannerPayload } from '../types'
import { useCreateBannerMutation, useUpdateBannerMutation } from '../mutations/useBannerMutations'

const emptyForm: BannerFormData = {
  title: '',
  subtitle: '',
  imageUrl: '',
  link: '',
  isVisible: true,
}

interface UseBannerFormHookParams {
  id: string | null
  onSuccess: () => void
}

export function useBannerFormHook({ id, onSuccess }: UseBannerFormHookParams) {
  const [formData, setFormData] = useState<BannerFormData>(emptyForm)

  const createMutation = useCreateBannerMutation()
  const updateMutation = useUpdateBannerMutation()

  const isThereId = Boolean(id)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onInputChange = (field: keyof BannerFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleToEditForm = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      imageUrl: banner.imageUrl ?? '',
      link: banner.link ?? '',
      isVisible: banner.isVisible,
    })
  }

  const resetForm = () => {
    setFormData(emptyForm)
  }

  const handleSubmit = () => {
    if (isThereId && id) {
      const payload: UpdateBannerPayload = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        imageUrl: formData.imageUrl || undefined,
        link: formData.link || undefined,
        isVisible: formData.isVisible,
      }
      updateMutation.mutate({ id, data: payload }, { onSuccess })
    } else {
      const payload: CreateBannerPayload = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        imageUrl: formData.imageUrl || undefined,
        link: formData.link || undefined,
        isVisible: formData.isVisible,
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
