import { Input, Switch } from '@heroui/react'
import type { ProductFormData } from '../types'

interface FormSectionPricingProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
}

export default function FormSectionPricing({ formData, updateField }: FormSectionPricingProps) {
  // Solo se marca en rojo si escribieron algo inválido (vacío lo avisa el
  // resumen de arriba del botón guardar).
  const priceInvalid = formData.price.trim() !== '' && !(Number(formData.price) > 0)

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Precio y Descuentos</h3>
      <div className="flex flex-col gap-4">
        <Input
          label="Precio base (USD)"
          placeholder="0.00"
          type="number"
          value={formData.price}
          onValueChange={(v) => updateField('price', v)}
          startContent={<span className="text-text-muted text-sm">$</span>}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          isRequired
          isInvalid={priceInvalid}
          errorMessage={priceInvalid ? 'El precio debe ser mayor a 0.' : undefined}
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Producto activo</p>
            <p className="text-xs text-text-muted">Visible en el catálogo</p>
          </div>
          <Switch
            isSelected={formData.isActive}
            onValueChange={(v) => updateField('isActive', v)}
            color="success"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Bajo pedido</p>
            <p className="text-xs text-text-muted">Aparece en la sección Bajo Pedido</p>
          </div>
          <Switch
            isSelected={formData.bajoPedido}
            onValueChange={(v) => updateField('bajoPedido', v)}
            color="warning"
          />
        </div>
      </div>
    </div>
  )
}
