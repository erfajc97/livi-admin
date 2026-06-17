import { useState, useCallback, useRef } from 'react'
import { useProductByIdQuery } from '@/app/tanstack-queries/productsQuery'
import { INITIAL_FORM_DATA } from '../data'
import type { ProductImage, ProductFormData, CreateProductPayload, VariationRow, Gender, TimeOfDay, Concentration, Projection } from '../types'

interface UseProductFormHookParams {
  productId: number | null
}

export function useProductFormHook({ productId }: UseProductFormHookParams) {
  const [formData, setFormData] = useState<ProductFormData>({ ...INITIAL_FORM_DATA })
  const [variations, setVariations] = useState<VariationRow[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const loadedProductIdRef = useRef<number | null>(null)

  const isEdit = productId !== null
  const { data: fullProduct, isLoading } = useProductByIdQuery(productId ?? 0, isEdit)

  // Load product data into form when query resolves — no useEffect needed
  if (fullProduct && loadedProductIdRef.current !== fullProduct.id) {
    loadedProductIdRef.current = fullProduct.id
    console.log('[ProductFormHook] Loading product:', fullProduct.id, {
      images: fullProduct.images?.length ?? 0,
      variations: fullProduct.variations?.length ?? 0,
      variationImages: fullProduct.variations?.map((v: any) => ({ id: v.id, name: v.name, images: v.images?.length ?? 0 })),
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
        ? (() => { try { return (JSON.parse(fullProduct.benefits) as string[]).join('\n') } catch { return fullProduct.benefits } })()
        : '',
      // ── PDP editorial ──
      scentProfileTitle: fullProduct.scentProfileTitle ?? '',
      scentSections: fullProduct.scentSections ?? [],
      mood: fullProduct.mood ?? [],
      occasion: fullProduct.occasion ?? [],
      longevity: fullProduct.longevity != null ? String(fullProduct.longevity) : '',
      projectionScore: fullProduct.projectionScore != null ? String(fullProduct.projectionScore) : '',
      signatureTitle: fullProduct.signatureTitle ?? '',
      signatureDescription: fullProduct.signatureDescription ?? '',
      signatureImageUrl: fullProduct.signatureImageUrl ?? '',
      signatureImageFile: null,
    })
    setExistingImages(fullProduct.images ?? [])
    setImageFiles([])
    setImagePreviews([])
    setVariations(
      (fullProduct.variations ?? [])
        // Skip the auto-managed full-bottle variation (synced server-side
        // from product.price / product.totalMl).
        .filter((v) => !v.isFullBottle)
        .map((v) => ({
          id: v.id,
          name: v.name ?? '',
          price: v.price ? String(v.price) : '',
          mlSize: v.mlSize ? String(v.mlSize) : '',
          sku: v.sku ?? '',
          existingImages: v.images,
        }))
    )
  }

  const updateField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

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
    setExistingImages((prev) => prev.filter((img) => String(img.id) !== String(imageId)))
  }, [])

  const addVariation = useCallback(() => {
    setVariations((prev) => [...prev, { name: '', price: '', mlSize: '', sku: '' }])
  }, [])

  const updateVariation = useCallback((index: number, field: keyof VariationRow, value: string | boolean) => {
    setVariations((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }, [])

  const removeVariation = useCallback((index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addVariationImages = useCallback((index: number, files: File[]) => {
    setVariations((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, imageFiles: [...(v.imageFiles ?? []), ...files] } : v
      )
    )
  }, [])

  const removeVariationNewImage = useCallback((varIndex: number, imgIndex: number) => {
    setVariations((prev) =>
      prev.map((v, i) =>
        i === varIndex
          ? { ...v, imageFiles: (v.imageFiles ?? []).filter((_, j) => j !== imgIndex) }
          : v
      )
    )
  }, [])

  const removeVariationExistingImage = useCallback((varIndex: number, imageId: number) => {
    setVariations((prev) =>
      prev.map((v, i) =>
        i === varIndex
          ? { ...v, existingImages: (v.existingImages ?? []).filter((img) => img.id !== imageId) }
          : v
      )
    )
  }, [])

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
      concentration: (formData.concentration || undefined) as Concentration | undefined,
      projection: (formData.projection || undefined) as Projection | undefined,
      discount: formData.discount ? Number(formData.discount) : undefined,
      detailDescription: formData.detailDescription.trim() || undefined,
      benefits: formData.benefits.trim()
        ? JSON.stringify(formData.benefits.trim().split('\n').map((l) => l.trim()).filter(Boolean))
        : undefined,
      // ── PDP editorial ── (arrays se envían siempre para permitir vaciarlos)
      scentProfileTitle: formData.scentProfileTitle.trim() || undefined,
      scentSections: formData.scentSections,
      mood: formData.mood,
      occasion: formData.occasion,
      longevity: formData.longevity !== '' ? Number(formData.longevity) : undefined,
      projectionScore: formData.projectionScore !== '' ? Number(formData.projectionScore) : undefined,
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
    addVariation,
    updateVariation,
    removeVariation,
    addVariationImages,
    removeVariationNewImage,
    removeVariationExistingImage,
    buildPayload,
  }
}
