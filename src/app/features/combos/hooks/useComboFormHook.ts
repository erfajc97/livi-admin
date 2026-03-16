import { useState, useCallback } from 'react'
import type { Combo, ComboFormData, ComboProductRow, CreateComboPayload } from '../types'

const INITIAL_FORM: ComboFormData = {
  name: '',
  description: '',
  imageUrl: '',
  finalPrice: '',
  sizeLabel: '',
  isActive: true,
}

const INITIAL_PRODUCT_ROW: ComboProductRow = { productId: '', quantity: '1' }

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

  const loadCombo = useCallback((combo: Combo) => {
    setFormData({
      name: combo.name,
      description: combo.description ?? '',
      imageUrl: combo.imageUrl ?? '',
      finalPrice: String(combo.finalPrice),
      sizeLabel: combo.sizeLabel ?? '',
      isActive: combo.isActive,
    })
    setProductRows(
      combo.comboProducts.map((cp) => ({
        productId: String(cp.productId),
        quantity: String(cp.quantity),
      }))
    )
  }, [])

  const addProductRow = useCallback(() => {
    setProductRows((prev) => [...prev, { ...INITIAL_PRODUCT_ROW }])
  }, [])

  const updateProductRow = useCallback((index: number, field: keyof ComboProductRow, value: string) => {
    setProductRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
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
      sizeLabel: formData.sizeLabel || undefined,
      isActive: formData.isActive,
      products: productRows
        .filter((r) => r.productId)
        .map((r) => ({
          productId: parseInt(r.productId, 10),
          quantity: parseInt(r.quantity, 10) || 1,
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
  }
}
