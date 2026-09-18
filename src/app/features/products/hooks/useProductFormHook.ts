import { useState, useCallback, useRef } from 'react'
import { useProductByIdQuery } from '@/app/tanstack-queries/productsQuery'
import { INITIAL_FORM_DATA } from '../data'
import type {
  ProductImage,
  ProductFormData,
  CreateProductPayload,
  VariationRow,
} from '../types'

interface UseProductFormHookParams {
  productId: number | null
}

export function useProductFormHook({ productId }: UseProductFormHookParams) {
  const [formData, setFormData] = useState<ProductFormData>({
    ...INITIAL_FORM_DATA,
  })
  const [variations, setVariations] = useState<VariationRow[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const loadedProductIdRef = useRef<number | null>(null)

  const isEdit = productId !== null
  const { data: fullProduct, isLoading } = useProductByIdQuery(
    productId ?? 0,
    isEdit,
  )

  // Load product data into form when query resolves — no useEffect needed
  if (fullProduct && loadedProductIdRef.current !== fullProduct.id) {
    loadedProductIdRef.current = fullProduct.id
    console.log('[ProductFormHook] Loading product:', fullProduct.id, {
      images: fullProduct.images?.length ?? 0,
      variations: fullProduct.variations?.length ?? 0,
      variationImages: fullProduct.variations?.map((v: any) => ({
        id: v.id,
        name: v.name,
        images: v.images?.length ?? 0,
      })),
    })
    setFormData({
      name: fullProduct.name,
      price: String(fullProduct.price),
      description: fullProduct.description ?? '',
      stock: String(fullProduct.stock),
      categoryId: String(fullProduct.categoryId),
      marcaId: String(fullProduct.marcaId),
      isActive: fullProduct.isActive,
      discount: fullProduct.discount ? String(fullProduct.discount) : '',
      detailDescription: fullProduct.detailDescription ?? '',
      benefits: fullProduct.benefits
        ? (() => {
            try {
              return (JSON.parse(fullProduct.benefits) as string[]).join('\n')
            } catch {
              return fullProduct.benefits
            }
          })()
        : '',
      commonUses: fullProduct.commonUses
        ? (() => {
            try {
              return (JSON.parse(fullProduct.commonUses) as string[]).join('\n')
            } catch {
              return fullProduct.commonUses
            }
          })()
        : '',
      pairsWith: (() => {
        try {
          const parsed = JSON.parse(fullProduct.pairsWith ?? '[]')
          return Array.isArray(parsed) ? parsed.map(Number).filter((n) => !Number.isNaN(n)) : []
        } catch {
          return []
        }
      })(),
      sizes: (() => {
        try {
          const parsed = JSON.parse(fullProduct.sizes ?? '[]')
          return Array.isArray(parsed) ? parsed.join('\n') : ''
        } catch {
          return fullProduct.sizes ?? ''
        }
      })(),
      instagramPosts: (() => {
        try {
          const parsed = JSON.parse(fullProduct.instagramPosts ?? '[]')
          return Array.isArray(parsed)
            ? parsed
                .filter((p: any) => p && typeof p === 'object')
                .map((p: any) => ({ url: String(p.url ?? ''), image: String(p.image ?? '') }))
            : []
        } catch {
          return []
        }
      })(),
    })
    setExistingImages(
      [...(fullProduct.images ?? [])].sort(
        (a, b) =>
          Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0) ||
          Number(a.id) - Number(b.id),
      ),
    )
    setImageFiles([])
    setImagePreviews([])
    setVariations(
      (fullProduct.variations ?? []).map((v) => ({
        id: v.id,
        name: v.name ?? '',
        price: v.price ? String(v.price) : '',
        sku: v.sku ?? '',
        colorHex: v.colorHex ?? '',
        size: v.size ?? '',
        existingImages: v.images,
      })),
    )
  }

  const updateField = useCallback(
    <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetForm = useCallback(() => {
    setFormData({ ...INITIAL_FORM_DATA })
    setVariations([])
    setImageFiles([])
    setExistingImages([])
    setImagePreviews([])
    loadedProductIdRef.current = null
  }, [])

  const addImageFiles = useCallback((files: File[]) => {
    setImageFiles((prev) => [...prev, ...files])
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }, [])

  const removeNewImage = useCallback((index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const removeExistingImage = useCallback((imageId: number | string) => {
    setExistingImages((prev) =>
      prev.filter((img) => String(img.id) !== String(imageId)),
    )
  }, [])

  /**
   * Mueve una imagen dentro de la galería. La primera es la que se ve en la
   * card y en la ficha; la segunda, la del hover. El orden definitivo se guarda
   * al enviar el formulario.
   */
  const moveExistingImage = useCallback(
    (imageId: number | string, direction: -1 | 1) => {
      setExistingImages((prev) => {
        const index = prev.findIndex((img) => String(img.id) === String(imageId))
        const target = index + direction
        if (index < 0 || target < 0 || target >= prev.length) return prev
        const next = [...prev]
        ;[next[index], next[target]] = [next[target], next[index]]
        return next
      })
    },
    [],
  )

  const addVariation = useCallback(() => {
    setVariations((prev) => [...prev, { name: '', price: '', sku: '' }])
  }, [])

  const updateVariation = useCallback(
    (index: number, field: keyof VariationRow, value: string | boolean) => {
      setVariations((prev) =>
        prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
      )
    },
    [],
  )

  const removeVariation = useCallback((index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addVariationImages = useCallback((index: number, files: File[]) => {
    setVariations((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, imageFiles: [...(v.imageFiles ?? []), ...files] }
          : v,
      ),
    )
  }, [])

  const removeVariationNewImage = useCallback(
    (varIndex: number, imgIndex: number) => {
      setVariations((prev) =>
        prev.map((v, i) =>
          i === varIndex
            ? {
                ...v,
                imageFiles: (v.imageFiles ?? []).filter(
                  (_, j) => j !== imgIndex,
                ),
              }
            : v,
        ),
      )
    },
    [],
  )

  const removeVariationExistingImage = useCallback(
    (varIndex: number, imageId: number) => {
      setVariations((prev) =>
        prev.map((v, i) =>
          i === varIndex
            ? {
                ...v,
                existingImages: (v.existingImages ?? []).filter(
                  (img) => img.id !== imageId,
                ),
              }
            : v,
        ),
      )
    },
    [],
  )

  const buildPayload = useCallback((): CreateProductPayload => {
    const raw = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim() || undefined,
      stock: Number(formData.stock) || 0,
      categoryId: Number(formData.categoryId),
      marcaId: Number(formData.marcaId),
      isActive: formData.isActive,
      discount: formData.discount ? Number(formData.discount) : undefined,
      detailDescription: formData.detailDescription.trim() || undefined,
      benefits: formData.benefits.trim()
        ? JSON.stringify(
            formData.benefits
              .trim()
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean),
          )
        : undefined,
      commonUses: formData.commonUses.trim()
        ? JSON.stringify(
            formData.commonUses
              .trim()
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean),
          )
        : undefined,
      pairsWith: formData.pairsWith.length
        ? JSON.stringify(formData.pairsWith)
        : undefined,
      // Sin dedupe, "X, x" pintaba dos botones de talla idénticos en la ficha.
      sizes: formData.sizes.trim()
        ? JSON.stringify(
            Array.from(
              new Map(
                formData.sizes
                  .split(/[\n,]+/)
                  .map((l) => l.replace(/\s+/g, ' ').trim())
                  .filter(Boolean)
                  .map((l) => [l.toLocaleLowerCase(), l] as const),
              ).values(),
            ),
          )
        : undefined,
      instagramPosts: formData.instagramPosts.some((p) => p.url.trim())
        ? JSON.stringify(
            formData.instagramPosts
              .filter((p) => p.url.trim())
              .map((p) => ({ url: p.url.trim(), image: p.image.trim() })),
          )
        : undefined,
    }

    // Strip undefined keys so backend Object.assign never nukes stored values
    return Object.fromEntries(
      Object.entries(raw).filter(([, value]) => value !== undefined),
    ) as unknown as CreateProductPayload
  }, [formData])

  return {
    formData,
    variations,
    imageFiles,
    existingImages,
    imagePreviews,
    fullProduct,
    isLoading,
    isEdit,
    updateField,
    resetForm,
    addImageFiles,
    removeNewImage,
    removeExistingImage,
    moveExistingImage,
    addVariation,
    updateVariation,
    removeVariation,
    addVariationImages,
    removeVariationNewImage,
    removeVariationExistingImage,
    buildPayload,
  }
}
