import { Textarea } from '@heroui/react'
import type { ProductFormData } from '../types'

interface FormSectionDetailProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
}

const fieldClassNames = {
  label: '!text-text',
  input: '!text-text',
  inputWrapper: 'bg-background border-border',
}

/**
 * Contenido editorial de la ficha (estilo minabaie, en español):
 * Características y detalles · Medidas y organización · Usos comunes.
 * "Envío y devoluciones" y la garantía van quemados en la web para todos
 * los productos, por eso no están aquí.
 */
export default function FormSectionDetail({
  formData,
  updateField,
}: FormSectionDetailProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-1 text-lg font-semibold text-text">
        Detalle de la ficha
      </h3>
      <p className="mb-4 text-xs text-text-muted">
        Estos bloques alimentan los acordeones de la página de producto.
      </p>
      <div className="flex flex-col gap-4">
        <Textarea
          label="Características y detalles"
          placeholder="Cuero vacuno genuino premium, forro resistente al agua, herrajes dorados..."
          value={formData.detailDescription}
          onValueChange={(v) => updateField('detailDescription', v)}
          classNames={fieldClassNames}
          minRows={4}
        />
        <Textarea
          label="Medidas y organización (un dato por línea)"
          placeholder={
            '39,4 × 30,5 × 19 cm aprox.\n6 bolsillos organizadores interiores\nCompartimento acolchado para laptop de 15"'
          }
          value={formData.benefits}
          onValueChange={(v) => updateField('benefits', v)}
          classNames={fieldClassNames}
          minRows={4}
        />
        <Textarea
          label="Usos comunes (uno por línea)"
          placeholder={'Pañalera\nBolso de trabajo\nBolso de viaje\nUso diario'}
          value={formData.commonUses}
          onValueChange={(v) => updateField('commonUses', v)}
          classNames={fieldClassNames}
          minRows={3}
        />
      </div>
    </div>
  )
}
