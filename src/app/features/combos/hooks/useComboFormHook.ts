import { useState, useCallback } from 'react'
import type { Combo, ComboFormData, ComboProductRow, CreateComboPayload } from '../types'

const INITIAL_FORM: ComboFormData = {
  name: '',
  description: '',
  imageFile: null,
  imageUrl: '',
  finalPrice: '',
  discount: '',
  isActive: true,
}

const INITIAL_PRODUCT_ROW: ComboProductRow = { productId: '', productVariationId: '', quantity: '1' }

export function useComboFormHook() {
  const [formData, setFormData] = useState<ComboFormData>(INITIAL_FORM)
  const [productRows, setProductRows] = useState<ComboProductRow[]>([{ ...INITIAL_PRODUCT_ROW }])

  const updateField = useCallback(<K extends keyof ComboFormData>(key: K, value: ComboFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM)
    setProductRows([{ ...INITIAL_PRODUCT_ROW }])
  }, [])

  const handleImageChange = useCallback((file: File | null) => {
    setFormData((prev) => ({ ...prev, imageFile: file }))
  }, [])

  const loadCombo = useCallback((combo: Combo) => {
    setFormData({
      name: combo.name,
      description: combo.description ?? '',
      imageFile: null,
      imageUrl: combo.imageUrl ?? '',
      finalPrice: String(combo.finalPrice),
      discount: String(combo.discount ?? ''),
      isActive: combo.isActive,
    })
    setProductRows(
      combo.comboProducts.map((cp) => ({
        productId: String(cp.productId),
        productVariationId: cp.productVariationId ? String(cp.productVariationId) : '',
        quantity: String(cp.quantity),
      }))
    )
  }, [])

  const addProductRow = useCallback(() => {
    setProductRows((prev) => [...prev, { ...INITIAL_PRODUCT_ROW }])
  }, [])

  const updateProductRow = useCallback((index: number, field: keyof ComboProductRow, value: string) => {
    setProductRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row
        const updated = { ...row, [field]: value }
        if (field === 'productId') updated.productVariationId = ''
        return updated
      })
    )
  }, [])

  const removeProductRow = useCallback((index: number) => {
    setProductRows((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const buildPayload = useCallback((): CreateComboPayload => {
    return {
      name: formData.name,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      finalPrice: parseFloat(formData.finalPrice) || 0,
      discount: formData.discount ? parseFloat(formData.discount) : undefined,
      isActive: formData.isActive,
      products: productRows
        .filter((r) => r.productId)
        .map((r) => ({
          productId: parseInt(r.productId, 10),
          ...(r.productVariationId && r.productVariationId !== 'full-bottle'
            ? { productVariationId: parseInt(r.productVariationId, 10) }
            : {}),
          quantity: 1,
        })),
    }
  }, [formData, productRows])

  return {
    formData,
    productRows,
    updateField,
    resetForm,
    loadCombo,
    addProductRow,
    updateProductRow,
    removeProductRow,
    buildPayload,
    handleImageChange,
  }
}
