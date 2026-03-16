import { useAuthStore } from '@/app/store/auth/authStore'
import WelcomeBanner from '@/app/features/dashboard/components/WelcomeBanner'
import { useManualSaleHook } from './hooks/useManualSaleHook'
import { useCreateManualOrderMutation } from './mutations/useManualSaleMutation'
import ClientSelector from './components/ClientSelector'
import ProductSearch from './components/ProductSearch'
import SaleItemsList from './components/SaleItemsList'
import OrderInfoHeader from './components/OrderInfoHeader'
import DiscountSection from './components/DiscountSection'
import PaymentMethodSelector from './components/PaymentMethodSelector'
import OrderSummary from './components/OrderSummary'

export function ManualSales() {
  const { userName } = useAuthStore()
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
    if (!canSubmit) return
    createMutation.mutate(buildPayload(), {
      onSuccess: () => resetForm(),
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <WelcomeBanner
        userName={userName}
        subtitle="Busca productos, selecciona variantes y aplica descuentos"
      />

      <h2 className="text-xl font-semibold text-text">
        Información para crear tu producto
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <ClientSelector users={users} selectedClient={client} onSelect={setClient} />
          <ProductSearch products={allProducts} items={items} onAddItem={addItem} />
          <SaleItemsList
            items={items}
            onUpdateQuantity={updateItemQuantity}
            onRemove={removeItem}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5">
            <OrderInfoHeader orderNumber={orderNumber} />
            <DiscountSection
              discountType={discountType}
              discountValue={discountValue}
              onTypeChange={setDiscountType}
              onValueChange={setDiscountValue}
            />
            <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
          </div>

          <OrderSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={total}
            canSubmit={canSubmit}
            isSubmitting={createMutation.isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
