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

  const { data: paginatedProducts } = useProductsQuery({ limit: 200 })
  const allProducts = paginatedProducts?.data ?? []

  const addItem = useCallback(
    (productId: number) => {
      const product = allProducts.find((p) => p.id === productId)
      if (!product) return

      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId)
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
          )
        }
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            brand: product.brand,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity: 1,
          },
        ]
      })
    },
    [allProducts]
  )

  const updateItemQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
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
    return {
      userId: client!.id,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      paymentMethod,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      notes: notes || undefined,
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
