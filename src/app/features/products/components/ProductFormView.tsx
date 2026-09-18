import { useMemo, useState } from 'react'
import { Spinner, addToast } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useProductFormHook } from '../hooks/useProductFormHook'
import { validateProductForm } from '../validators'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../mutations/useProductMutations'
import { productsService } from '../services/productsService'
import ProductForm from './ProductForm'
import type { Product } from '../types'

interface ProductFormViewProps {
  product: Product | null
  onBack: () => void
}

export default function ProductFormView({
  product,
  onBack,
}: ProductFormViewProps) {
  const formHook = useProductFormHook({ productId: product?.id ?? null })
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)

  // Qué falta para poder guardar (vacío = formulario válido).
  const errors = useMemo(
    () => validateProductForm(formHook.formData, formHook.variations),
    [formHook.formData, formHook.variations],
  )

  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()

  const uploadAndSyncImages = async (productId: number) => {
    // Upload new images
    if (formHook.imageFiles.length > 0) {
      try {
        await productsService.uploadImages(productId, formHook.imageFiles)
      } catch (err: any) {
        addToast({
          title: err?.response?.data?.message || 'Error al subir imágenes',
          color: 'danger',
        })
      }
    }

    // Delete removed images
    if (formHook.isEdit && formHook.fullProduct?.images) {
      const removedImages = formHook.fullProduct.images.filter(
        (img) =>
          !formHook.existingImages.some((e) => String(e.id) === String(img.id)),
      )
      for (const img of removedImages) {
        try {
          await productsService.deleteImage(productId, img.id)
        } catch {
          /* ignore */
        }
      }

      // Guardar el orden de la galería: la posición en pantalla es la que vale
      // (1 = principal, 2 = hover). Siempre se escribe para no dejar empates
      // viejos de displayOrder en 0.
      for (let i = 0; i < formHook.existingImages.length; i++) {
        const img = formHook.existingImages[i]
        try {
          await productsService.updateImageOrder(productId, img.id, i)
        } catch {
          /* ignore */
        }
      }
    }

    // Sync variations: create new, update existing, delete removed
    await syncVariations(productId)

    // Variation images (after variations are created/synced)
    for (const variation of formHook.variations) {
      if (
        variation.id &&
        variation.imageFiles &&
        variation.imageFiles.length > 0
      ) {
        try {
          await productsService.uploadVariationImages(
            variation.id,
            variation.imageFiles,
          )
        } catch {
          /* ignore */
        }
      }
      if (variation.id && formHook.isEdit) {
        const original = formHook.fullProduct?.variations?.find(
          (v) => v.id === variation.id,
        )
        if (original?.images) {
          const removedVarImages = original.images.filter(
            (img) =>
              !(variation.existingImages ?? []).some(
                (e) => String(e.id) === String(img.id),
              ),
          )
          for (const img of removedVarImages) {
            try {
              await productsService.deleteVariationImage(variation.id, img.id)
            } catch {
              /* ignore */
            }
          }
        }
      }
    }
  }

  const syncVariations = async (productId: number) => {
    const currentVariations = formHook.variations
    const originalVariations = formHook.fullProduct?.variations ?? []

    // Delete removed variations
    for (const orig of originalVariations) {
      const stillExists = currentVariations.some((v) => v.id === orig.id)
      if (!stillExists) {
        try {
          await productsService.deleteVariation(orig.id)
        } catch {
          /* ignore */
        }
      }
    }

    // Create new / update existing variations
    const productName = formHook.formData.name || 'producto'
    for (let i = 0; i < currentVariations.length; i++) {
      const v = currentVariations[i]
      const name = v.name.trim()
      if (!name) continue // skip empty rows

      // El SKU es único en la base: sin la talla, "Negro·Midi" y "Negro·Maxi"
      // generaban el mismo código y la segunda variante fallaba en silencio.
      const slug = (value: string) =>
        value.replace(/\s+/g, '-').toLowerCase()
      const sizePart = v.size?.trim() ? `-${slug(v.size.trim())}` : ''
      const autoSku = `${slug(productName)}-${slug(name)}${sizePart}-${productId}`
      const sku = v.sku.trim() || autoSku

      if (v.id) {
        // Update existing
        try {
          await productsService.updateVariation(v.id, {
            name,
            price: v.price ? Number(v.price) : undefined,
            sku,
            colorHex: v.colorHex?.trim() || undefined,
            // '' limpia la talla guardada; undefined la dejaría intacta.
            size: v.size?.trim() ?? '',
          })
        } catch {
          /* ignore */
        }
      } else {
        // Create new
        try {
          const created = await productsService.createVariation({
            productId,
            name,
            price: v.price ? Number(v.price) : undefined,
            sku,
            colorHex: v.colorHex?.trim() || undefined,
            size: v.size?.trim() || undefined,
          })
          // Update the local variation with the new id for image uploads
          formHook.variations[i] = { ...v, id: created.id }
        } catch (err: any) {
          addToast({
            title: `Error creando variante: ${err?.response?.data?.message || 'Error'}`,
            color: 'danger',
          })
        }
      }
    }
  }

  const handleSubmit = () => {
    // Red de seguridad: el botón ya está deshabilitado con errores, pero si
    // llegara aquí (submit por teclado, estado viejo) no se envía nada.
    if (errors.length > 0) {
      addToast({ title: errors[0], color: 'danger' })
      return
    }

    const payload = formHook.buildPayload()
    setIsSaving(true)

    if (formHook.isEdit && product) {
      updateMutation.mutate(
        { id: product.id, data: payload },
        {
          onSuccess: async () => {
            try {
              await uploadAndSyncImages(product.id)
              await queryClient.invalidateQueries({ queryKey: ['products'] })
              addToast({
                title: 'Producto actualizado exitosamente',
                color: 'success',
              })
              onBack()
            } finally {
              setIsSaving(false)
            }
          },
          onError: () => setIsSaving(false),
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: async (createdProduct) => {
          try {
            if (createdProduct?.id) {
              await uploadAndSyncImages(createdProduct.id)
            }
            await queryClient.invalidateQueries({ queryKey: ['products'] })
            addToast({
              title: 'Producto creado exitosamente',
              color: 'success',
            })
            onBack()
          } finally {
            setIsSaving(false)
          }
        },
        onError: () => setIsSaving(false),
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
      moveExistingImage={formHook.moveExistingImage}
      addVariation={formHook.addVariation}
      updateVariation={formHook.updateVariation}
      removeVariation={formHook.removeVariation}
      addVariationImages={formHook.addVariationImages}
      removeVariationNewImage={formHook.removeVariationNewImage}
      removeVariationExistingImage={formHook.removeVariationExistingImage}
      onSubmit={handleSubmit}
      onBack={onBack}
      isSubmitting={isSaving}
      isEdit={formHook.isEdit}
      fullProduct={formHook.fullProduct}
      errors={errors}
    />
  )
}
