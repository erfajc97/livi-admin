import { Spinner, addToast } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useProductFormHook } from '../hooks/useProductFormHook'
import { useCreateProductMutation, useUpdateProductMutation } from '../mutations/useProductMutations'
import { productsService } from '../services/productsService'
import ProductForm from './ProductForm'
import type { Product } from '../types'

interface ProductFormViewProps {
  product: Product | null
  onBack: () => void
}

export default function ProductFormView({ product, onBack }: ProductFormViewProps) {
  const formHook = useProductFormHook({ productId: product?.id ?? null })
  const queryClient = useQueryClient()

  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()

  const uploadAndSyncImages = async (productId: number) => {
    // Upload new images
    if (formHook.imageFiles.length > 0) {
      try {
        await productsService.uploadImages(productId, formHook.imageFiles)
      } catch (err: any) {
        addToast({ title: err?.response?.data?.message || 'Error al subir imágenes', color: 'danger' })
      }
    }

    // Delete removed images
    if (formHook.isEdit && formHook.fullProduct?.images) {
      const removedImages = formHook.fullProduct.images.filter(
        (img) => !formHook.existingImages.some((e) => String(e.id) === String(img.id))
      )
      for (const img of removedImages) {
        try {
          await productsService.deleteImage(productId, img.id)
        } catch { /* ignore */ }
      }
    }

    // Variation images
    for (const variation of formHook.variations) {
      if (variation.id && variation.imageFiles && variation.imageFiles.length > 0) {
        try {
          await productsService.uploadVariationImages(variation.id, variation.imageFiles)
        } catch { /* ignore */ }
      }
      if (variation.id && formHook.isEdit) {
        const original = formHook.fullProduct?.variations?.find((v) => v.id === variation.id)
        if (original?.images) {
          const removedVarImages = original.images.filter(
            (img) => !(variation.existingImages ?? []).some((e) => String(e.id) === String(img.id))
          )
          for (const img of removedVarImages) {
            try {
              await productsService.deleteVariationImage(variation.id, img.id)
            } catch { /* ignore */ }
          }
        }
      }
    }
  }

  const handleSubmit = () => {
    const payload = formHook.buildPayload()

    if (formHook.isEdit && product) {
      updateMutation.mutate(
        { id: product.id, data: payload },
        {
          onSuccess: async () => {
            await uploadAndSyncImages(product.id)
            await queryClient.invalidateQueries({ queryKey: ['products'] })
            addToast({ title: 'Producto actualizado exitosamente', color: 'success' })
            onBack()
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: async (createdProduct) => {
          if (createdProduct?.id) {
            await uploadAndSyncImages(createdProduct.id)
          }
          await queryClient.invalidateQueries({ queryKey: ['products'] })
          addToast({ title: 'Producto creado exitosamente', color: 'success' })
          onBack()
        },
      })
    }
  }

  if (formHook.isEdit && formHook.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  return (
    <ProductForm
      formData={formHook.formData}
      variations={formHook.variations}
      imagePreviews={formHook.imagePreviews}
      existingImages={formHook.existingImages}
      updateField={formHook.updateField}
      addImageFiles={formHook.addImageFiles}
      removeNewImage={formHook.removeNewImage}
      removeExistingImage={formHook.removeExistingImage}
      addVariation={formHook.addVariation}
      updateVariation={formHook.updateVariation}
      removeVariation={formHook.removeVariation}
      addVariationImages={formHook.addVariationImages}
      removeVariationNewImage={formHook.removeVariationNewImage}
      removeVariationExistingImage={formHook.removeVariationExistingImage}
      onSubmit={handleSubmit}
      onBack={onBack}
      isSubmitting={createMutation.isPending || updateMutation.isPending}
      isEdit={formHook.isEdit}
      fullProduct={formHook.fullProduct}
    />
  )
}
