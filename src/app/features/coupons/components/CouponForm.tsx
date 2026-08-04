import { Input, Select, SelectItem, Switch } from '@heroui/react'
import type { CouponFormData, CouponType } from '../types'

const inputClasses = { label: '!text-text' }

const typeOptions: { value: CouponType; label: string }[] = [
  { value: 'percentage', label: 'Porcentaje (%)' },
  { value: 'fixed_amount', label: 'Monto fijo ($)' },
  { value: 'free_shipping', label: 'Envío gratis' },
]

interface CouponFormProps {
  formData: CouponFormData
  onInputChange: (field: keyof CouponFormData, value: string | boolean) => void
}

export default function CouponForm({
  formData,
  onInputChange,
}: CouponFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Código del cupón"
        labelPlacement="outside"
        placeholder="Ej: VERANO2026"
        description="Cualquier palabra, siempre se guarda en MAYÚSCULAS"
        value={formData.code}
        onValueChange={(v) => onInputChange('code', v.toUpperCase())}
        classNames={inputClasses}
        autoComplete="off"
        isRequired
      />

      <Select
        label="Tipo de descuento"
        labelPlacement="outside"
        selectedKeys={[formData.type]}
        onSelectionChange={(keys) => {
          const val = Array.from(keys)[0] as string
          if (val) onInputChange('type', val)
        }}
        classNames={inputClasses}
      >
        {typeOptions.map((o) => (
          <SelectItem key={o.value}>{o.label}</SelectItem>
        ))}
      </Select>

      <Input
        label="Descripción"
        labelPlacement="outside"
        placeholder="Ej: Descuento de verano 2026"
        value={formData.description}
        onValueChange={(v) => onInputChange('description', v)}
        classNames={inputClasses}
        autoComplete="off"
      />

      {formData.type !== 'free_shipping' && (
        <Input
          label={
            formData.type === 'percentage'
              ? 'Porcentaje de descuento (%)'
              : 'Monto de descuento ($)'
          }
          labelPlacement="outside"
          placeholder={formData.type === 'percentage' ? 'Ej: 15' : 'Ej: 5.00'}
          type="number"
          value={formData.value}
          onValueChange={(v) => onInputChange('value', v)}
          classNames={inputClasses}
          isRequired
        />
      )}

      {/* Scope fijo: solo productos, no combos */}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Límite de usos (total)"
          labelPlacement="outside"
          placeholder="Vacío = ilimitado"
          description="Máximo de veces que se puede usar este cupón en total"
          type="number"
          value={formData.maxUses}
          onValueChange={(v) => onInputChange('maxUses', v)}
          classNames={inputClasses}
        />
        <Input
          label="Monto mínimo de compra ($)"
          labelPlacement="outside"
          placeholder="Vacío = sin mínimo"
          description="El subtotal debe superar este monto para aplicar"
          type="number"
          value={formData.minOrderAmount}
          onValueChange={(v) => onInputChange('minOrderAmount', v)}
          classNames={inputClasses}
        />
      </div>

      <Input
        label="Fecha y hora de expiración (hora Ecuador)"
        labelPlacement="outside"
        type="datetime-local"
        placeholder=" "
        value={formData.expiresAt}
        onValueChange={(v) => onInputChange('expiresAt', v)}
        classNames={inputClasses}
        isRequired
      />

      <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">
              Uso único por cliente
            </p>
            <p className="text-xs text-text-muted">
              {formData.singleUsePerCustomer
                ? 'Cada cliente solo puede usar este cupón 1 vez'
                : 'Un cliente puede usar este cupón varias veces'}
            </p>
          </div>
          <Switch
            isSelected={formData.singleUsePerCustomer}
            onValueChange={(v) => onInputChange('singleUsePerCustomer', v)}
            size="sm"
          />
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Cupón activo</p>
            <p className="text-xs text-text-muted">
              {formData.isActive
                ? 'El cupón está disponible para usar'
                : 'El cupón está deshabilitado'}
            </p>
          </div>
          <Switch
            isSelected={formData.isActive}
            onValueChange={(v) => onInputChange('isActive', v)}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}
