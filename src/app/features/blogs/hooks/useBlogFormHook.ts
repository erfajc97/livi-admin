import { prepareImageUpload } from '@/app/helpers/prepareImageUpload'
import { useState } from 'react'
import type { BlogPost } from '../types'
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from '../mutations/useBlogMutations'

export interface BlogFormData {
  title: string
  content: string
  isPublished: boolean
}

const emptyForm: BlogFormData = {
  title: '',
  content: '',
  isPublished: true,
}

interface UseBlogFormHookParams {
  id: string | null
  onSuccess: () => void
}

export function useBlogFormHook({ id, onSuccess }: UseBlogFormHookParams) {
  const [formData, setFormData] = useState<BlogFormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const createMutation = useCreateBlogMutation()
  const updateMutation = useUpdateBlogMutation()

  const isThereId = Boolean(id)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onInputChange = (
    field: keyof BlogFormData,
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

  const handleToEditForm = (blog: BlogPost) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      isPublished: blog.isPublished,
    })
    setImagePreview(blog.imageUrl)
    setImageFile(null)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('content', formData.content)
    formDataToSend.append('isPublished', String(formData.isPublished))

    if (imageFile) {
      // Cloudinary free corta en 10 MB: se recomprime antes de enviar.
      formDataToSend.append('image', await prepareImageUpload(imageFile))
    }

    if (isThereId && id) {
      updateMutation.mutate({ id, formData: formDataToSend }, { onSuccess })
    } else {
      createMutation.mutate(formDataToSend, { onSuccess })
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
