import { Button, Chip } from '@heroui/react'
import { PencilIcon, TrashIcon, Ticket } from 'lucide-react'
import type { Coupon } from '../types'

const typeLabels: Record<string, string> = {
  fixed_amount: 'Monto fijo',
  percentage: 'Porcentaje',
  free_shipping: 'Envío gratis',
}

interface CouponCardProps {
  coupon: Coupon
  onEdit: (coupon: Coupon) => void
  onDelete: (coupon: Coupon) => void
}

export default function CouponCard({ coupon, onEdit, onDelete }: CouponCardProps) {
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date()
  const usageText = coupon.maxUses
    ? `${coupon.currentUses}/${coupon.maxUses} usos`
    : `${coupon.currentUses} usos`

  const valueText =
    coupon.type === 'percentage'
      ? `${coupon.value}%`
      : coupon.type === 'fixed_amount'
        ? `$${coupon.value}`
        : 'Envío gratis'

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-accent/10">
        <Ticket size={28} className="text-accent" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-base font-bold text-accent">{coupon.code}</h3>
            <Chip size="sm" variant="flat" color={coupon.isActive && !isExpired ? 'success' : 'danger'}>
              {isExpired ? 'Expirado' : coupon.isActive ? 'Activo' : 'Inactivo'}
            </Chip>
            <Chip size="sm" variant="flat" color="warning">
              {typeLabels[coupon.type]}
            </Chip>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            Descuento: <span className="font-semibold text-text">{valueText}</span>
            {' · '}
            {usageText}
            {coupon.expiresAt && (
              <>
                {' · Expira: '}
                {new Date(coupon.expiresAt).toLocaleDateString('es-EC', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </>
            )}
          </p>
          {coupon.description && (
            <p className="mt-0.5 text-xs text-text-muted">{coupon.description}</p>
          )}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {coupon.minOrderAmount && (
              <Chip size="sm" variant="flat" color="default">
                Mín. ${coupon.minOrderAmount}
              </Chip>
            )}
            <Chip size="sm" variant="flat" color={coupon.singleUsePerCustomer ? 'secondary' : 'default'}>
              {coupon.singleUsePerCustomer ? '1 uso/cliente' : 'Multi-uso/cliente'}
            </Chip>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-1">
        <Button isIconOnly size="sm" variant="light" onPress={() => onEdit(coupon)} aria-label="Editar cupón">
          <PencilIcon size={16} className="text-text-muted" />
        </Button>
        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onDelete(coupon)} aria-label="Eliminar cupón">
          <TrashIcon size={16} />
        </Button>
      </div>
    </div>
  )
}
