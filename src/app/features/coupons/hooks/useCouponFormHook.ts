import { useState } from 'react'
import type { Coupon, CouponFormData, CreateCouponPayload, UpdateCouponPayload } from '../types'
import { useCreateCouponMutation, useUpdateCouponMutation } from '../mutations/useCouponMutations'

/** Convert UTC ISO string to Ecuador local datetime-local value (YYYY-MM-DDTHH:mm) */
function toEcuadorLocalDatetime(isoString: string): string {
  const date = new Date(isoString)
  const ec = new Date(date.getTime() - 5 * 60 * 60 * 1000)
  return ec.toISOString().slice(0, 16)
}

const emptyForm: CouponFormData = {
  code: '',
  description: '',
  type: 'percentage',
  value: '',
  scope: 'all_products',
  maxUses: '',
  singleUsePerCustomer: true,
  minOrderAmount: '',
  isActive: true,
  expiresAt: '',
}

interface UseCouponFormHookParams {
  id: string | null
  onSuccess: () => void
}

export function useCouponFormHook({ id, onSuccess }: UseCouponFormHookParams) {
  const [formData, setFormData] = useState<CouponFormData>(emptyForm)

  const createMutation = useCreateCouponMutation()
  const updateMutation = useUpdateCouponMutation()

  const isThereId = Boolean(id)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onInputChange = (field: keyof CouponFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleToEditForm = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description ?? '',
      type: coupon.type,
      value: String(coupon.value),
      scope: coupon.scope,
      maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      singleUsePerCustomer: coupon.singleUsePerCustomer,
      minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : '',
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt
        ? toEcuadorLocalDatetime(coupon.expiresAt)
        : '',
    })
  }

  const resetForm = () => setFormData(emptyForm)

  const handleSubmit = () => {
    const base = {
      code: formData.code.toUpperCase(),
      description: formData.description || undefined,
      type: formData.type,
      value: Number(formData.value),
      scope: formData.scope,
      maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
      singleUsePerCustomer: formData.singleUsePerCustomer,
      minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : undefined,
      isActive: formData.isActive,
      // Enviar como ISO con timezone Ecuador (UTC-5) para que el backend guarde la hora correcta
      expiresAt: formData.expiresAt
        ? new Date(formData.expiresAt + ':00-05:00').toISOString()
        : undefined,
    }

    if (isThereId && id) {
      updateMutation.mutate({ id, data: base as UpdateCouponPayload }, { onSuccess })
    } else {
      createMutation.mutate(base as CreateCouponPayload, { onSuccess })
    }
  }

  return {
    formData,
    isThereId,
    isSubmitting,
    onInputChange,
    handleToEditForm,
    resetForm,
    handleSubmit,
  }
}
