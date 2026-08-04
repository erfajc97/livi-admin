import { Select, SelectItem, Input } from '@heroui/react'
import {
  GENDERS,
  TIME_OF_DAY_OPTIONS,
  CONCENTRATIONS,
  PROJECTIONS,
} from '../data'
import type { ProductFormData } from '../types'

interface FormSectionFragranceProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
}

export default function FormSectionFragrance({
  formData,
  updateField,
}: FormSectionFragranceProps) {
  const discountInvalid =
    formData.discount.trim() !== '' &&
    (Number.isNaN(Number(formData.discount)) ||
      Number(formData.discount) < 0 ||
      Number(formData.discount) > 100)

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">
        Características de Fragancia
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Género"
          placeholder="Seleccionar género"
          selectedKeys={formData.gender ? [formData.gender] : []}
          onSelectionChange={(keys) => {
            const val = (Array.from(keys)[0] as string) ?? ''
            updateField('gender', val)
          }}
          classNames={{
            label: '!text-text',
            value: '!text-text',
            trigger: 'bg-background border-border',
          }}
        >
          {GENDERS.map((g) => (
            <SelectItem key={g.value}>{g.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Hora del día"
          placeholder="Seleccionar hora"
          selectedKeys={formData.timeOfDay ? [formData.timeOfDay] : []}
          onSelectionChange={(keys) => {
            const val = (Array.from(keys)[0] as string) ?? ''
            updateField('timeOfDay', val)
          }}
          classNames={{
            label: '!text-text',
            value: '!text-text',
            trigger: 'bg-background border-border',
          }}
        >
          {TIME_OF_DAY_OPTIONS.map((t) => (
            <SelectItem key={t.value}>{t.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Concentración"
          placeholder="Seleccionar concentración"
          selectedKeys={formData.concentration ? [formData.concentration] : []}
          onSelectionChange={(keys) => {
            const val = (Array.from(keys)[0] as string) ?? ''
            updateField('concentration', val)
          }}
          classNames={{
            label: '!text-text',
            value: '!text-text',
            trigger: 'bg-background border-border',
          }}
        >
          {CONCENTRATIONS.map((c) => (
            <SelectItem key={c.value}>{c.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Proyección"
          placeholder="Seleccionar proyección"
          selectedKeys={formData.projection ? [formData.projection] : []}
          onSelectionChange={(keys) => {
            const val = (Array.from(keys)[0] as string) ?? ''
            updateField('projection', val)
          }}
          classNames={{
            label: '!text-text',
            value: '!text-text',
            trigger: 'bg-background border-border',
          }}
        >
          {PROJECTIONS.map((p) => (
            <SelectItem key={p.value}>{p.label}</SelectItem>
          ))}
        </Select>

        <Input
          label="Descuento (%)"
          placeholder="0"
          type="number"
          value={formData.discount}
          onValueChange={(v) => updateField('discount', v)}
          isInvalid={discountInvalid}
          errorMessage={
            discountInvalid ? 'El descuento va de 0 a 100.' : undefined
          }
          endContent={<span className="text-text-muted text-sm">%</span>}
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-background border-border',
          }}
        />
      </div>
    </div>
  )
}
