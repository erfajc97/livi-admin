import { useState, useEffect } from 'react'
import { Chip, Button, Input, Spinner } from '@heroui/react'
import { ArrowLeft, Save } from 'lucide-react'
import { useOrderByIdQuery } from '@/app/tanstack-queries/ordersQuery'
import { useUpdateOrderMutation } from '../mutations/useOrderMutations'
import { STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../data'
import axiosInstance from '@/app/config/axiosConfig'

const DELIVERY_LABELS: Record<string, string> = {
  ENTREGA_PERSONAL: 'Entrega personal Plaza Tía (La Joya)',
  RETIRO_PIWU: 'Retiro en Piwu Market (Urdesa)',
  SERVIENTREGA_GYE: 'Servientrega (Guayaquil - Durán - Samborondón)',
  SERVIENTREGA_NACIONAL: 'Servientrega Nacional (Provincias)',
}

const isServientrega = (method?: string) =>
  method === 'SERVIENTREGA_GYE' || method === 'SERVIENTREGA_NACIONAL'

interface OrderDetailViewProps {
  orderId: number
  onBack: () => void
}

interface HistoryEntry {
  id: number
  fromStatus: string
  toStatus: string
  changedBy: string
  note?: string
  createdAt: string
}

export default function OrderDetailView({
  orderId,
  onBack,
}: OrderDetailViewProps) {
  const { data: order, isLoading } = useOrderByIdQuery(orderId)
  const updateMutation = useUpdateOrderMutation()
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingLoaded, setTrackingLoaded] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Load tracking code from order once fetched
  if (order && !trackingLoaded) {
    setTrackingCode(order.trackingCode ?? '')
    setTrackingLoaded(true)
  }

  useEffect(() => {
    if (orderId) {
      axiosInstance
        .get(`/orders/${orderId}/history`)
        .then(({ data }) => setHistory(data?.data ?? data ?? []))
        .catch(() => {})
    }
  }, [orderId, order?.status])

  const handleSaveTracking = () => {
    if (!order) return
    updateMutation.mutate({ id: order.id, payload: { trackingCode } })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-text-muted">
        Orden no encontrada
      </div>
    )
  }

  const statusInfo = STATUS_LABELS[order.status] || {
    label: order.status,
    color: 'default' as const,
  }
  const paymentInfo = PAYMENT_STATUS_LABELS[
    order.paymentStatus || 'pending'
  ] || { label: order.paymentStatus || 'N/A', color: 'default' as const }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button isIconOnly variant="flat" onPress={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-text">
            Orden {order.orderNumber}
          </h2>
          <p className="text-xs text-text-muted">
            {new Date(order.createdAt).toLocaleString('es-EC', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>
        <Chip size="sm" variant="flat" color={statusInfo.color}>
          {statusInfo.label}
        </Chip>
        <Chip size="sm" variant="flat" color={paymentInfo.color}>
          {paymentInfo.label}
        </Chip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Products + Totals */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-medium text-text-muted uppercase mb-4">
              Productos
            </h3>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => {
                return (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="w-14 h-14 rounded-lg bg-bg-alt overflow-hidden shrink-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px]">
                          Sin img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {item.productName || `#${item.productId}`}
                      </p>
                      <p className="text-xs text-text-muted">
                        {[item.variationName, item.variationSize ? `Talla ${item.variationSize}` : '']
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-text">
                        ${Number(item.subtotal).toFixed(2)}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-border mt-4 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              {Number(order.couponDiscount) > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Cupón</span>
                  <span>-${Number(order.couponDiscount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-muted">
                <span>Envío</span>
                <span>${Number(order.deliveryCost).toFixed(2)}</span>
              </div>
              {Number(order.payphoneSurcharge) > 0 && (
                <div className="flex justify-between text-text-muted">
                  <span>Recargo PayPhone 6%</span>
                  <span>${Number(order.payphoneSurcharge).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-text text-base pt-2 border-t border-border">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tracking input for Servientrega orders */}
          {isServientrega(order.deliveryMethod) && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium text-text-muted uppercase mb-3">
                Número de guía Servientrega
              </h3>
              <div className="flex gap-3">
                <Input
                  value={trackingCode}
                  onValueChange={setTrackingCode}
                  placeholder="Ej: 1234567890"
                  classNames={{ label: '!text-text', input: '!text-text' }}
                  className="flex-1"
                />
                <Button
                  color="warning"
                  startContent={<Save size={16} />}
                  onPress={handleSaveTracking}
                  isLoading={updateMutation.isPending}
                >
                  Guardar
                </Button>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Al guardar la guía el pedido pasa a "Enviado" y al cliente le
                llega el correo con su número de tracking.
              </p>
            </div>
          )}

          {/* Transfer receipt */}
          {order.transferReceiptUrl && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium text-text-muted uppercase mb-3">
                Comprobante de transferencia
              </h3>
              <a
                href={order.transferReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={order.transferReceiptUrl}
                  alt="Comprobante"
                  className="max-h-80 rounded-lg border border-border hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          )}

          {/* Status History Timeline */}
          {history.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium text-text-muted uppercase mb-4">
                Historial de estados
              </h3>
              <div className="relative pl-6">
                <div className="absolute left-[9px] top-1 bottom-1 w-px bg-border" />
                {history.map((entry, i) => {
                  const label =
                    STATUS_LABELS[entry.toStatus]?.label ?? entry.toStatus
                  const isLast = i === history.length - 1
                  return (
                    <div key={entry.id} className="relative pb-4 last:pb-0">
                      <div
                        className={`absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${isLast ? 'bg-accent border-accent' : 'bg-surface border-border'}`}
                      >
                        {isLast && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-text">{label}</p>
                      <p className="text-[11px] text-text-muted">
                        {new Date(entry.createdAt).toLocaleString('es-EC', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                        {entry.changedBy && <span> · {entry.changedBy}</span>}
                      </p>
                      {entry.note && (
                        <p className="text-[11px] text-text-muted italic mt-0.5">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Client + Delivery + Payment + Notes */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-xs font-medium text-text-muted uppercase mb-2">
              Cliente
            </h3>
            <p className="text-sm font-medium text-text">
              {order.customerName || order.userName || 'N/A'}
            </p>
            <p className="text-xs text-text-muted">
              {order.customerEmail || '—'}
            </p>
            <p className="text-xs text-text-muted">
              {order.customerPhone || '—'}
            </p>
            {order.customerCedula && (
              <p className="text-xs text-text-muted">
                C.I. {order.customerCedula}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-xs font-medium text-text-muted uppercase mb-2">
              Envío
            </h3>
            <p className="text-sm font-medium text-text">
              {order.deliveryMethod
                ? DELIVERY_LABELS[order.deliveryMethod] || order.deliveryMethod
                : 'N/A'}
            </p>
            {order.shippingAddress && (
              <p className="text-xs text-text-muted mt-1">
                {order.shippingAddress}
              </p>
            )}
            {(order.shippingCity || order.shippingProvince) && (
              <p className="text-xs text-text-muted">
                {[order.shippingCity, order.shippingProvince]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {order.trackingCode && (
              <p className="text-xs text-accent mt-1">
                Guía: {order.trackingCode}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-xs font-medium text-text-muted uppercase mb-2">
              Pago
            </h3>
            <p className="text-sm font-medium text-text">
              {order.paymentMethod || 'N/A'}
            </p>
            {order.paymentReference && (
              <p className="text-xs text-text-muted mt-1">
                Ref: {order.paymentReference}
              </p>
            )}
          </div>

          {order.notes && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="text-xs font-medium text-text-muted uppercase mb-2">
                Notas
              </h3>
              <p className="text-xs text-text-muted">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
