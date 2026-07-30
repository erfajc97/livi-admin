import { useState } from 'react'
import { addToast } from '@heroui/react'
import type { Banner, BannerFormData, BannerType, CreateBannerPayload, UpdateBannerPayload } from '../types'
import { useCreateBannerMutation, useUpdateBannerMutation } from '../mutations/useBannerMutations'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const buildEmptyForm = (type: BannerType): BannerFormData => ({
  title: '',
  subtitle: '',
  link: '',
  buttonText: '',
  type,
  isVisible: true,
  categoryId: '',
  marcaId: '',
})

interface UseBannerFormHookParams {
  id: string | null
  onSuccess: () => void
  /** Tipo de banner fijo para esta vista (hero, navbar, …). Default 'hero'. */
  defaultType?: BannerType
}

export function useBannerFormHook({ id, onSuccess, defaultType = 'hero' }: UseBannerFormHookParams) {
  const [formData, setFormData] = useState<BannerFormData>(() => buildEmptyForm(defaultType))
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
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        addToast({ title: 'Formato no permitido. Usa JPG, PNG o WEBP.', color: 'danger' })
        return
      }
      if (file.size > MAX_IMAGE_SIZE) {
        addToast({ title: 'La imagen no debe superar los 5 MB.', color: 'danger' })
        return
      }
    }

    setImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return file ? URL.createObjectURL(file) : null
    })
    setImageFile(file)
  }

  const handleToEditForm = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      link: banner.link ?? '',
      buttonText: banner.buttonText ?? '',
      type: banner.type ?? defaultType,
      isVisible: banner.isVisible,
      categoryId: banner.categoryId ? String(banner.categoryId) : '',
      marcaId: banner.marcaId ? String(banner.marcaId) : '',
    })
    setImagePreview(banner.imageUrl)
    setImageFile(null)
  }

  const resetForm = () => {
    setFormData(buildEmptyForm(defaultType))
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = () => {
    // Los textos van tal cual (incluido vacío): así el admin puede dejar un
    // banner sin titular/descripción o limpiarlos al editar.
    const base: Omit<CreateBannerPayload, 'title'> = {
      subtitle: formData.subtitle,
      link: formData.link,
      buttonText: formData.buttonText,
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
