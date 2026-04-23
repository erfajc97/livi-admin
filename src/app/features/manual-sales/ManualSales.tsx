import { useState } from 'react'
import { Button, addToast } from '@heroui/react'
import { Package, Gift } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useManualSaleHook } from './hooks/useManualSaleHook'
import { useCreateManualOrderMutation } from './mutations/useManualSaleMutation'
import ClientSelector from './components/ClientSelector'
import ProductSearch from './components/ProductSearch'
import ComboSearch from './components/ComboSearch'
import SaleItemsList from './components/SaleItemsList'
import OrderInfoHeader from './components/OrderInfoHeader'
import DiscountSection from './components/DiscountSection'
import PaymentMethodSelector from './components/PaymentMethodSelector'
import OrderSummary from './components/OrderSummary'

type SaleMode = 'product' | 'combo'

export function ManualSales() {
  const { userName } = useAuthStore()
  const [mode, setMode] = useState<SaleMode>('product')
  const {
    client,
    items,
    discountType,
    discountValue,
    paymentMethod,
    users,
    allProducts,
    subtotal,
    discountAmount,
    total,
    orderNumber,
    canSubmit,
    setClient,
    setDiscountType,
    setDiscountValue,
    setPaymentMethod,
    addItem,
    updateItemQuantity,
    removeItem,
    resetForm,
    buildPayload,
  } = useManualSaleHook()

  const createMutation = useCreateManualOrderMutation()

  const handleSubmit = () => {
    if (!client) {
      addToast({ title: 'Selecciona un cliente primero', color: 'warning' })
      return
    }
    if (items.length === 0) {
      addToast({ title: `Agrega al menos un ${mode === 'combo' ? 'combo' : 'producto'}`, color: 'warning' })
      return
    }
    const payload = buildPayload()
    payload.notes = mode === 'combo' ? '[Venta manual - Combo]' : '[Venta manual]'
    createMutation.mutate(payload, {
      onSuccess: () => {
        resetForm()
        setMode('product')
      },
    })
  }

  const handleModeChange = (newMode: SaleMode) => {
    if (items.length > 0 && newMode !== mode) {
      // Clear items when switching mode
      resetForm()
    }
    setMode(newMode)
  }

  const isComboMode = mode === 'combo'

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">Registrar venta manual</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <ClientSelector users={users} selectedClient={client} onSelect={setClient} />

          {/* Mode toggle */}
          <div className="flex gap-2">
            <Button
              startContent={<Package size={16} />}
              variant={mode === 'product' ? 'solid' : 'flat'}
              color={mode === 'product' ? 'warning' : 'default'}
              onPress={() => handleModeChange('product')}
            >
              Producto
            </Button>
            <Button
              startContent={<Gift size={16} />}
              variant={mode === 'combo' ? 'solid' : 'flat'}
              color={mode === 'combo' ? 'warning' : 'default'}
              onPress={() => handleModeChange('combo')}
            >
              Combo
            </Button>
          </div>

          {mode === 'product' && (
            <ProductSearch products={allProducts} items={items} onAddItem={addItem} />
          )}

          {mode === 'combo' && (
            <ComboSearch onAddCombo={addItem} />
          )}

          <SaleItemsList
            items={items}
            onUpdateQuantity={updateItemQuantity}
            onRemove={removeItem}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5">
            <OrderInfoHeader orderNumber={orderNumber} />

            {/* Discount only for products, not combos */}
            {!isComboMode ? (
              <DiscountSection
                discountType={discountType}
                discountValue={discountValue}
                onTypeChange={setDiscountType}
                onValueChange={setDiscountValue}
              />
            ) : (
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                <p className="text-xs text-accent font-medium">Los combos ya incluyen descuento aplicado en su precio final.</p>
              </div>
            )}

            <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
          </div>

          <OrderSummary
            subtotal={subtotal}
            discountAmount={isComboMode ? 0 : discountAmount}
            total={isComboMode ? subtotal : total}
            isSubmitting={createMutation.isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
