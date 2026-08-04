import { useState, useCallback } from 'react'
import type {
  Combo,
  ComboFormData,
  ComboProductRow,
  CreateComboPayload,
} from '../types'

const INITIAL_FORM: ComboFormData = {
  name: '',
  description: '',
  imageFile: null,
  imageUrl: '',
  finalPrice: '',
  discount: '',
  isActive: true,
  parentComboId: undefined,
}

const INITIAL_PRODUCT_ROW: ComboProductRow = {
  productId: '',
  productVariationId: '',
  quantity: '1',
}

/** Borrador de una versión inline (mismo nombre del combo base, otros productos/precio). */
export interface VersionDraft {
  id?: number
  finalPrice: string
  discount: string
  productRows: ComboProductRow[]
}

export interface VersionOps {
  toCreate: CreateComboPayload[]
  toUpdate: { id: number; payload: CreateComboPayload }[]
  toDelete: number[]
}

function mapProducts(rows: ComboProductRow[]) {
  return rows
    .filter((r) => r.productId)
    .map((r) => ({
      productId: parseInt(r.productId, 10),
      ...(r.productVariationId && r.productVariationId !== 'full-bottle'
        ? { productVariationId: parseInt(r.productVariationId, 10) }
        : {}),
      quantity: 1,
    }))
}

export function useComboFormHook() {
  const [formData, setFormData] = useState<ComboFormData>(INITIAL_FORM)
  const [productRows, setProductRows] = useState<ComboProductRow[]>([
    { ...INITIAL_PRODUCT_ROW },
  ])
  const [versions, setVersions] = useState<VersionDraft[]>([])
  const [removedVersionIds, setRemovedVersionIds] = useState<number[]>([])

  const updateField = useCallback(
    <K extends keyof ComboFormData>(key: K, value: ComboFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM)
    setProductRows([{ ...INITIAL_PRODUCT_ROW }])
    setVersions([])
    setRemovedVersionIds([])
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
        productVariationId: cp.productVariationId
          ? String(cp.productVariationId)
          : '',
        quantity: String(cp.quantity),
      })),
    )
    setVersions(
      (combo.versions ?? []).map((v) => ({
        id: v.id,
        finalPrice: String(v.finalPrice),
        discount: String(v.discount ?? ''),
        productRows: (v.comboProducts ?? []).map((cp) => ({
          productId: String(cp.productId),
          productVariationId: cp.productVariationId
            ? String(cp.productVariationId)
            : '',
          quantity: String(cp.quantity),
        })),
      })),
    )
    setRemovedVersionIds([])
  }, [])

  // ── Productos del combo base ──
  const addProductRow = useCallback(() => {
    setProductRows((prev) => [...prev, { ...INITIAL_PRODUCT_ROW }])
  }, [])

  const updateProductRow = useCallback(
    (index: number, field: keyof ComboProductRow, value: string) => {
      setProductRows((prev) =>
        prev.map((row, i) => {
          if (i !== index) return row
          const updated = { ...row, [field]: value }
          if (field === 'productId') updated.productVariationId = ''
          return updated
        }),
      )
    },
    [],
  )

  const removeProductRow = useCallback((index: number) => {
    setProductRows((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // ── Versiones inline ──
  const addVersion = useCallback(() => {
    setVersions((prev) => [
      ...prev,
      {
        finalPrice: '',
        discount: '',
        productRows: [{ ...INITIAL_PRODUCT_ROW }],
      },
    ])
  }, [])

  const removeVersion = useCallback((index: number) => {
    setVersions((prev) => {
      const v = prev[index]
      if (v?.id) setRemovedVersionIds((r) => [...r, v.id!])
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const updateVersionField = useCallback(
    (index: number, field: 'finalPrice' | 'discount', value: string) => {
      setVersions((prev) =>
        prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
      )
    },
    [],
  )

  const addVersionProductRow = useCallback((vIndex: number) => {
    setVersions((prev) =>
      prev.map((v, i) =>
        i === vIndex
          ? {
              ...v,
              productRows: [...v.productRows, { ...INITIAL_PRODUCT_ROW }],
            }
          : v,
      ),
    )
  }, [])

  const updateVersionProductRow = useCallback(
    (
      vIndex: number,
      rIndex: number,
      field: keyof ComboProductRow,
      value: string,
    ) => {
      setVersions((prev) =>
        prev.map((v, i) => {
          if (i !== vIndex) return v
          return {
            ...v,
            productRows: v.productRows.map((row, ri) => {
              if (ri !== rIndex) return row
              const updated = { ...row, [field]: value }
              if (field === 'productId') updated.productVariationId = ''
              return updated
            }),
          }
        }),
      )
    },
    [],
  )

  const removeVersionProductRow = useCallback(
    (vIndex: number, rIndex: number) => {
      setVersions((prev) =>
        prev.map((v, i) =>
          i === vIndex
            ? {
                ...v,
                productRows: v.productRows.filter((_, ri) => ri !== rIndex),
              }
            : v,
        ),
      )
    },
    [],
  )

  const buildPayload = useCallback((): CreateComboPayload => {
    return {
      name: formData.name,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      finalPrice: parseFloat(formData.finalPrice) || 0,
      discount: formData.discount ? parseFloat(formData.discount) : undefined,
      isActive: formData.isActive,
      products: mapProducts(productRows),
    }
  }, [formData, productRows])

  // Operaciones de versiones a ejecutar tras guardar el base.
  const buildVersionOps = useCallback(
    (baseName: string, baseId: number): VersionOps => {
      const toCreate: CreateComboPayload[] = []
      const toUpdate: { id: number; payload: CreateComboPayload }[] = []
      for (const v of versions) {
        const payload: CreateComboPayload = {
          name: baseName,
          finalPrice: parseFloat(v.finalPrice) || 0,
          discount: v.discount ? parseFloat(v.discount) : undefined,
          isActive: true,
          parentComboId: baseId,
          products: mapProducts(v.productRows),
        }
        if (v.id) toUpdate.push({ id: v.id, payload })
        else toCreate.push(payload)
      }
      return { toCreate, toUpdate, toDelete: removedVersionIds }
    },
    [versions, removedVersionIds],
  )

  return {
    formData,
    productRows,
    versions,
    updateField,
    resetForm,
    loadCombo,
    addProductRow,
    updateProductRow,
    removeProductRow,
    addVersion,
    removeVersion,
    updateVersionField,
    addVersionProductRow,
    updateVersionProductRow,
    removeVersionProductRow,
    buildPayload,
    buildVersionOps,
    handleImageChange,
  }
}
