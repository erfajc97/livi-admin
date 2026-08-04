import { useState } from 'react'
import { addToast, Tabs, Tab } from '@heroui/react'
import { Package, Gift } from 'lucide-react'
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
import type { ManualSaleItem } from './types'

export function ManualSales() {
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
  const [pickerTab, setPickerTab] = useState<'product' | 'combo'>('product')

  const hasCombo = items.some((i) => !!i.comboId)

  const handleAdd = (item: Omit<ManualSaleItem, 'quantity'>) => {
    addItem(item)
    addToast({
      title: item.comboId ? 'Combo agregado' : 'Producto agregado',
      description: item.productName,
      color: 'success',
      timeout: 1500,
    })
  }

  const handleSubmit = () => {
    if (!client) {
      addToast({ title: 'Selecciona un cliente primero', color: 'warning' })
      return
    }
    if (items.length === 0) {
      addToast({
        title: 'Agrega al menos un producto o combo',
        color: 'warning',
      })
      return
    }
    const payload = buildPayload()
    payload.notes = hasCombo ? '[Venta manual - Mixta]' : '[Venta manual]'
    createMutation.mutate(payload, {
      onSuccess: () => resetForm(),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent sm:text-3xl">
        Registrar venta manual
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column — pickers */}
        <div className="flex flex-col gap-5 lg:col-span-3">
          <ClientSelector
            users={users}
            selectedClient={client}
            onSelect={setClient}
          />

          <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <Tabs
              selectedKey={pickerTab}
              onSelectionChange={(key) =>
                setPickerTab(key as 'product' | 'combo')
              }
              color="warning"
              variant="solid"
              classNames={{
                tabList: 'bg-bg',
                tab: 'data-[selected=true]:bg-accent data-[selected=true]:text-bg',
                tabContent: 'text-text',
              }}
            >
              <Tab
                key="product"
                title={
                  <div className="flex items-center gap-2">
                    <Package size={14} />
                    <span>Producto</span>
                  </div>
                }
              >
                <div className="pt-4">
                  <ProductSearch
                    products={allProducts}
                    items={items}
                    onAddItem={handleAdd}
                  />
                </div>
              </Tab>
              <Tab
                key="combo"
                title={
                  <div className="flex items-center gap-2">
                    <Gift size={14} />
                    <span>Combo</span>
                  </div>
                }
              >
                <div className="pt-4">
                  <ComboSearch onAddCombo={handleAdd} />
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>

        {/* Right column — cart + summary (sticky on desktop) */}
        <div className="flex flex-col gap-5 lg:col-span-2 lg:sticky lg:top-4 lg:self-start">
          <SaleItemsList
            items={items}
            onUpdateQuantity={updateItemQuantity}
            onRemove={removeItem}
          />

          <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-4 sm:p-5">
            <OrderInfoHeader orderNumber={orderNumber} />

            <DiscountSection
              discountType={discountType}
              discountValue={discountValue}
              onTypeChange={setDiscountType}
              onValueChange={setDiscountValue}
            />

            {hasCombo && (
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                <p className="text-xs text-accent font-medium">
                  Los combos ya incluyen descuento aplicado. El descuento
                  adicional aquí aplica al total general.
                </p>
              </div>
            )}

            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          <OrderSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={total}
            itemCount={items.reduce((sum, i) => sum + i.quantity, 0)}
            isSubmitting={createMutation.isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
