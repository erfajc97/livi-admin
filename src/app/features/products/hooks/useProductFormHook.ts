import { useState, useCallback, useRef } from 'react'
import { useProductByIdQuery } from '@/app/tanstack-queries/productsQuery'
import { INITIAL_FORM_DATA } from '../data'
import { findAutoFullBottleVariationId } from '../utils/variations'
import type {
  ProductImage,
  ProductFormData,
  CreateProductPayload,
  VariationRow,
  Gender,
  TimeOfDay,
  Concentration,
  Projection,
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
      totalMl: fullProduct.totalMl ? String(fullProduct.totalMl) : '',
      categoryId: String(fullProduct.categoryId),
      marcaId: String(fullProduct.marcaId),
      isActive: fullProduct.isActive,
      bajoPedido: fullProduct.bajoPedido ?? false,
      gender: fullProduct.gender ?? '',
      timeOfDay: fullProduct.timeOfDay ?? '',
      concentration: fullProduct.concentration ?? '',
      projection: fullProduct.projection ?? '',
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
      // ── PDP editorial ──
      scentProfileTitle: fullProduct.scentProfileTitle ?? '',
      scentSections: fullProduct.scentSections ?? [],
      mood: fullProduct.mood ?? [],
      occasion: fullProduct.occasion ?? [],
      longevity:
        fullProduct.longevity != null ? String(fullProduct.longevity) : '',
      projectionScore:
        fullProduct.projectionScore != null
          ? String(fullProduct.projectionScore)
          : '',
      signatureTitle: fullProduct.signatureTitle ?? '',
      signatureDescription: fullProduct.signatureDescription ?? '',
      signatureImageUrl: fullProduct.signatureImageUrl ?? '',
      signatureImageFile: null,
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
    const autoBottleId = findAutoFullBottleVariationId(fullProduct)
    setVariations(
      (fullProduct.variations ?? [])
        // Skip only the auto-managed full-bottle variation (synced server-side
        // from product.price / product.totalMl). Las presentaciones selladas
        // cargadas por el admin también traen `isFullBottle`, y filtrarlas por
        // ese flag las dejaba invisibles en el panel.
        .filter((v) => String(v.id) !== autoBottleId)
        .map((v) => ({
          id: v.id,
          name: v.name ?? '',
          price: v.price ? String(v.price) : '',
          mlSize: v.mlSize ? String(v.mlSize) : '',
          sku: v.sku ?? '',
          presentationType: v.presentationType ?? 'decant',
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
    setVariations((prev) => [
      ...prev,
      { name: '', price: '', mlSize: '', sku: '', presentationType: 'decant' },
    ])
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
      totalMl: Number(formData.totalMl),
      categoryId: Number(formData.categoryId),
      marcaId: Number(formData.marcaId),
      isActive: formData.isActive,
      bajoPedido: formData.bajoPedido,
      gender: (formData.gender || undefined) as Gender | undefined,
      timeOfDay: (formData.timeOfDay || undefined) as TimeOfDay | undefined,
      concentration: (formData.concentration || undefined) as
        | Concentration
        | undefined,
      projection: (formData.projection || undefined) as Projection | undefined,
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
      // ── PDP editorial ── (arrays se envían siempre para permitir vaciarlos)
      scentProfileTitle: formData.scentProfileTitle.trim() || undefined,
      scentSections: formData.scentSections,
      mood: formData.mood,
      occasion: formData.occasion,
      longevity:
        formData.longevity !== '' ? Number(formData.longevity) : undefined,
      projectionScore:
        formData.projectionScore !== ''
          ? Number(formData.projectionScore)
          : undefined,
      signatureTitle: formData.signatureTitle.trim() || undefined,
      signatureDescription: formData.signatureDescription.trim() || undefined,
      signatureImageUrl: formData.signatureImageUrl.trim() || undefined,
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
