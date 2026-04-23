import { Spinner, addToast } from '@heroui/react'
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

  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()

  const uploadImages = async (productId: number) => {
    if (formHook.imageFiles.length > 0) {
      try {
        await productsService.uploadImages(productId, formHook.imageFiles)
      } catch {
        addToast({ title: 'Error al subir algunas imágenes', color: 'warning' })
      }
    }

    if (formHook.isEdit && formHook.fullProduct?.images) {
      const removedImages = formHook.fullProduct.images.filter(
        (img) => !formHook.existingImages.some((e) => e.id === img.id)
      )
      for (const img of removedImages) {
        try {
          await productsService.deleteImage(productId, img.id)
        } catch { /* ignore */ }
      }
    }

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
            (img) => !(variation.existingImages ?? []).some((e) => e.id === img.id)
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
            await uploadImages(product.id)
            onBack()
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: async (createdProduct) => {
          await uploadImages(createdProduct.id)
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
