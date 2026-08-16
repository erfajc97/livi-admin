import { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { manualSalesService } from '../services/manualSalesService'
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery'
import type {
  ManualSaleClient,
  ManualSaleCustomerForm,
  ManualSaleItem,
  ManualSalePayload,
  ClientMode,
  DeliveryMethod,
  DiscountType,
  PaymentMethod,
} from '../types'

const EMPTY_CUSTOMER: ManualSaleCustomerForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cedula: '',
  city: '',
  province: '',
  address: '',
}

export function useManualSaleHook() {
  // El canal de redes vende sobre todo a gente que no está registrada, así que
  // el formulario de cliente nuevo es el modo por defecto.
  const [clientMode, setClientMode] = useState<ClientMode>('new')
  const [client, setClient] = useState<ManualSaleClient | null>(null)
  const [customer, setCustomer] =
    useState<ManualSaleCustomerForm>(EMPTY_CUSTOMER)
  const [items, setItems] = useState<ManualSaleItem[]>([])
  const [discountType, setDiscountType] = useState<DiscountType>('per_product')
  const [discountValue, setDiscountValue] = useState('0.00')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO')
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('ENTREGA_PERSONAL')
  const [notes, setNotes] = useState('')

  const setCustomerField = useCallback(
    (field: keyof ManualSaleCustomerForm, value: string) => {
      setCustomer((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => manualSalesService.searchUsers(),
  })

  const { data: paginatedProducts } = useProductsQuery({ limit: 100 })
  const allProducts = paginatedProducts?.data ?? []

  // Stable key: combos identified by comboId, products by variationId, base products by productId
  const itemKey = (i: {
    comboId?: number
    productVariationId?: number
    productId?: number
  }) =>
    i.comboId
      ? `combo-${i.comboId}`
      : i.productVariationId
        ? `var-${i.productVariationId}`
        : `prod-${i.productId}`

  const addItem = useCallback((newItem: Omit<ManualSaleItem, 'quantity'>) => {
    setItems((prev) => {
      const key = itemKey(newItem)
      const existing = prev.find((i) => itemKey(i) === key)
      if (existing) {
        return prev.map((i) =>
          itemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const updateItemQuantity = useCallback((key: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => (itemKey(i) === key ? { ...i, quantity } : i)),
    )
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== key))
  }, [])

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  )

  const discountAmount = useMemo(() => {
    const val = parseFloat(discountValue) || 0
    if (discountType === 'percentage') return (subtotal * val) / 100
    return val // fixed or per_product
  }, [subtotal, discountType, discountValue])

  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount],
  )

  const orderNumber = useMemo(() => {
    const now = new Date()
    return `NV-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  }, [])

  const resetForm = useCallback(() => {
    setClient(null)
    setCustomer(EMPTY_CUSTOMER)
    setItems([])
    setDiscountType('per_product')
    setDiscountValue('0.00')
    setPaymentMethod('EFECTIVO')
    setDeliveryMethod('ENTREGA_PERSONAL')
    setNotes('')
  }, [])

  const needsShipment = deliveryMethod.startsWith('SERVIENTREGA')

  /**
   * Qué falta para poder registrar la venta. Con envío la dirección no es
   * opcional: sin ella no hay a dónde despachar ni qué poner en el correo.
   */
  const customerError = useMemo(() => {
    if (clientMode === 'existing') {
      return client ? null : 'Selecciona un cliente'
    }
    if (!customer.firstName.trim()) return 'Falta el nombre del cliente'
    if (!customer.email.trim()) return 'Falta el correo del cliente'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      return 'El correo del cliente no es válido'
    }
    if (needsShipment && !customer.address.trim()) {
      return 'Falta la dirección de envío'
    }
    if (needsShipment && !customer.city.trim()) return 'Falta la ciudad'
    return null
  }, [clientMode, client, customer, needsShipment])

  const buildPayload = useCallback((): ManualSalePayload => {
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

    const trimmed = (value: string) => value.trim() || undefined

    return {
      ...(clientMode === 'existing'
        ? { userId: client!.id }
        : {
            customer: {
              firstName: customer.firstName.trim(),
              lastName: trimmed(customer.lastName),
              email: customer.email.trim(),
              phone: trimmed(customer.phone),
              cedula: trimmed(customer.cedula),
              city: trimmed(customer.city),
              province: trimmed(customer.province),
              address: trimmed(customer.address),
            },
          }),
      items: expandedItems,
      paymentMethod,
      deliveryMethod,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      notes: notes ? `[Venta manual] ${notes}` : '[Venta manual]',
    }
  }, [
    clientMode,
    client,
    customer,
    items,
    paymentMethod,
    deliveryMethod,
    discountAmount,
    notes,
  ])

  const canSubmit = !customerError && items.length > 0

  return {
    // State
    clientMode,
    client,
    customer,
    items,
    discountType,
    discountValue,
    paymentMethod,
    deliveryMethod,
    needsShipment,
    notes,
    users,
    allProducts,
    subtotal,
    discountAmount,
    total,
    orderNumber,
    canSubmit,
    customerError,
    // Setters
    setClientMode,
    setClient,
    setCustomerField,
    setDiscountType,
    setDiscountValue,
    setPaymentMethod,
    setDeliveryMethod,
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
