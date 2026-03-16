import { useState, useCallback } from 'react'
import { INITIAL_FORM_DATA } from '../data'
import type { Product, ProductFormData, CreateProductPayload, VariationRow } from '../types'

export function useProductFormHook() {
  const [formData, setFormData] = useState<ProductFormData>({ ...INITIAL_FORM_DATA })
  const [variations, setVariations] = useState<VariationRow[]>([])

  const updateField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({ ...INITIAL_FORM_DATA })
    setVariations([])
  }, [])

  const loadProduct = useCallback((product: Product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      price: String(product.price),
      type: product.type,
      description: product.description ?? '',
      stock: String(product.stock),
      measureValue: product.measureValue ? String(product.measureValue) : '',
      measureUnit: product.measureUnit ?? 'ML',
      categoryId: String(product.categoryId),
      subcategoryId: String(product.subcategoryId),
      parentProductId: product.parentProductId ? String(product.parentProductId) : '',
      isActive: product.isActive,
      imageUrl: product.imageUrl ?? '',
    })
    setVariations(
      (product.variations ?? []).map((v) => ({
        id: v.id,
        name: v.name ?? '',
        price: v.price ? String(v.price) : '',
        stock: String(v.stock),
        sku: v.sku ?? '',
      }))
    )
  }, [])

  const addVariation = useCallback(() => {
    setVariations((prev) => [...prev, { name: '', price: '', stock: '0', sku: '' }])
  }, [])

  const updateVariation = useCallback((index: number, field: keyof VariationRow, value: string) => {
    setVariations((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }, [])

  const removeVariation = useCallback((index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const buildPayload = useCallback((): CreateProductPayload => {
    return {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      price: Number(formData.price),
      type: formData.type,
      description: formData.description.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      stock: Number(formData.stock) || 0,
      measureValue: formData.measureValue ? Number(formData.measureValue) : undefined,
      measureUnit: formData.measureValue ? formData.measureUnit : undefined,
      categoryId: Number(formData.categoryId),
      subcategoryId: Number(formData.subcategoryId),
      parentProductId: formData.parentProductId ? Number(formData.parentProductId) : undefined,
      isActive: formData.isActive,
    }
  }, [formData])

  return {
    formData,
    variations,
    updateField,
    resetForm,
    loadProduct,
    addVariation,
    updateVariation,
    removeVariation,
    buildPayload,
  }
}
