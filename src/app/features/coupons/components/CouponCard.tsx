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
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30 sm:flex-row sm:gap-4">
      <div className="flex gap-3 sm:contents">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-accent/10 sm:h-16 sm:w-16">
          <Ticket size={28} className="text-accent" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-mono text-base font-bold text-accent">{coupon.code}</h3>
            <Chip size="sm" variant="flat" color={coupon.isActive && !isExpired ? 'success' : 'danger'}>
              {isExpired ? 'Expirado' : coupon.isActive ? 'Activo' : 'Inactivo'}
            </Chip>
            <Chip size="sm" variant="flat" color="warning">
              {typeLabels[coupon.type]}
            </Chip>
          </div>
          <p className="mt-1 break-words text-sm text-text-muted">
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
            <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{coupon.description}</p>
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

      <div className="flex shrink-0 flex-wrap items-start gap-1 self-end sm:self-start">
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
