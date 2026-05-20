import { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { manualSalesService } from '../services/manualSalesService'
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery'
import type {
  ManualSaleClient,
  ManualSaleItem,
  DiscountType,
  PaymentMethod,
} from '../types'

export function useManualSaleHook() {
  const [client, setClient] = useState<ManualSaleClient | null>(null)
  const [items, setItems] = useState<ManualSaleItem[]>([])
  const [discountType, setDiscountType] = useState<DiscountType>('per_product')
  const [discountValue, setDiscountValue] = useState('0.00')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo')
  const [notes, setNotes] = useState('')

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => manualSalesService.searchUsers(),
  })

  const { data: paginatedProducts } = useProductsQuery({ limit: 100 })
  const allProducts = paginatedProducts?.data ?? []

  // Stable key: combos identified by comboId, products by variationId, base products by productId
  const itemKey = (i: { comboId?: number; productVariationId?: number; productId?: number }) =>
    i.comboId ? `combo-${i.comboId}` : i.productVariationId ? `var-${i.productVariationId}` : `prod-${i.productId}`

  const addItem = useCallback(
    (newItem: Omit<ManualSaleItem, 'quantity'>) => {
      setItems((prev) => {
        const key = itemKey(newItem)
        const existing = prev.find((i) => itemKey(i) === key)
        if (existing) {
          return prev.map((i) => (itemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i))
        }
        return [...prev, { ...newItem, quantity: 1 }]
      })
    },
    [],
  )

  const updateItemQuantity = useCallback((key: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((i) => (itemKey(i) === key ? { ...i, quantity } : i)))
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== key))
  }, [])

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const discountAmount = useMemo(() => {
    const val = parseFloat(discountValue) || 0
    if (discountType === 'percentage') return (subtotal * val) / 100
    return val // fixed or per_product
  }, [subtotal, discountType, discountValue])

  const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount])

  const orderNumber = useMemo(() => {
    const now = new Date()
    return `NV-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  }, [])

  const resetForm = useCallback(() => {
    setClient(null)
    setItems([])
    setDiscountType('per_product')
    setDiscountValue('0.00')
    setPaymentMethod('Efectivo')
    setNotes('')
  }, [])

  const buildPayload = useCallback(() => {
    // Expand combos into individual order items; regular items pass through
    const expandedItems = items.flatMap((i) => {
      if (i.comboId && i.comboProducts && i.comboProducts.length > 0) {
        return i.comboProducts.map((cp) => ({
          ...(cp.productVariationId
            ? { productVariationId: cp.productVariationId }
            : { productId: cp.productId }),
          quantity: cp.quantity * i.quantity,
        }))
      }
      return [
        {
          ...(i.productVariationId
            ? { productVariationId: i.productVariationId }
            : { productId: i.productId }),
          quantity: i.quantity,
        },
      ]
    })

    return {
      userId: client!.id,
      items: expandedItems,
      paymentMethod,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      notes: notes ? `[Venta manual] ${notes}` : '[Venta manual]',
    }
  }, [client, items, paymentMethod, discountAmount, notes])

  const canSubmit = !!client && items.length > 0

  return {
    // State
    client,
    items,
    discountType,
    discountValue,
    paymentMethod,
    notes,
    users,
    allProducts,
    subtotal,
    discountAmount,
    total,
    orderNumber,
    canSubmit,
    // Setters
    setClient,
    setDiscountType,
    setDiscountValue,
    setPaymentMethod,
    setNotes,
    // Item handlers
    addItem,
    updateItemQuantity,
    removeItem,
    // Actions
    resetForm,
    buildPayload,
  }
}
