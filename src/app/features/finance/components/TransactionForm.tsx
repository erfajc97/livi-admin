import { Input, Select, SelectItem, Textarea, Button } from '@heroui/react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../data'
import type { TransactionFormData } from '../types'

interface TransactionFormProps {
  formData: TransactionFormData
  isSubmitting: boolean
  onUpdateField: <K extends keyof TransactionFormData>(key: K, value: TransactionFormData[K]) => void
  onSubmit: () => void
}

export default function TransactionForm({
  formData,
  isSubmitting,
  onUpdateField,
  onSubmit,
}: TransactionFormProps) {
  const categories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const label = formData.type === 'expense' ? 'Egreso' : 'Ingreso'

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="mb-5 text-base font-semibold text-text">Registrar {label}</h3>

      <div className="flex flex-col gap-4">
        {/* Row 1: Tipo, Monto, Fecha */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Tipo de gasto"
            selectedKeys={[formData.category]}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string
              if (val) onUpdateField('category', val)
            }}
            classNames={{
              trigger: 'bg-surface-raised border border-border',
              value: 'text-text',
              label: 'text-text-muted',
              listboxWrapper: 'bg-surface',
              popoverContent: 'bg-surface border border-border',
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={cat} classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}>
                {cat}
              </SelectItem>
            ))}
          </Select>

          <Input
            type="number"
            label="Monto ($)"
            value={formData.amount}
            onValueChange={(val) => onUpdateField('amount', val)}
            classNames={{
              inputWrapper: 'bg-surface-raised border border-border',
              input: 'text-text',
              label: 'text-text-muted',
            }}
          />

          <Input
            type="date"
            label="Fecha"
            value={formData.date}
            onValueChange={(val) => onUpdateField('date', val)}
            classNames={{
              inputWrapper: 'bg-surface-raised border border-border',
              input: 'text-text',
              label: 'text-text-muted',
            }}
          />
        </div>

        {/* Descripción */}
        <Input
          label="Descripción"
          placeholder="Descripción del gasto..."
          value={formData.description}
          onValueChange={(val) => onUpdateField('description', val)}
          classNames={{
            inputWrapper: 'bg-surface-raised border border-border',
            input: 'text-text placeholder:text-text-muted',
            label: 'text-text-muted',
          }}
        />

        {/* Row 2: Método, Cuenta */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Método de pago"
            selectedKeys={[formData.paymentMethod]}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string
              if (val) onUpdateField('paymentMethod', val)
            }}
            classNames={{
              trigger: 'bg-surface-raised border border-border',
              value: 'text-text',
              label: 'text-text-muted',
              listboxWrapper: 'bg-surface',
              popoverContent: 'bg-surface border border-border',
            }}
          >
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method} classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}>
                {method}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Cuenta asociada (opcional)"
            placeholder="Ej: Banco Pichincha"
            value={formData.accountName}
            onValueChange={(val) => onUpdateField('accountName', val)}
            classNames={{
              inputWrapper: 'bg-surface-raised border border-border',
              input: 'text-text placeholder:text-text-muted',
              label: 'text-text-muted',
            }}
          />
        </div>

        {/* Notas */}
        <Textarea
          label="Notas internas"
          placeholder="Notas adicionales..."
          value={formData.notes}
          onValueChange={(val) => onUpdateField('notes', val)}
          classNames={{
            inputWrapper: 'bg-surface-raised border border-border',
            input: 'text-text placeholder:text-text-muted',
            label: 'text-text-muted',
          }}
        />

        <Button
          fullWidth
          color="default"
          variant="solid"
          onPress={onSubmit}
          isLoading={isSubmitting}
          isDisabled={!formData.amount || parseFloat(formData.amount) <= 0}
          className="bg-bg font-semibold text-text"
        >
          Registrar {label}
        </Button>
      </div>
    </div>
  )
}
