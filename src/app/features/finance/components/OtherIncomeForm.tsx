import { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { Plus, DollarSign } from 'lucide-react'
import { useCreateTransactionMutation } from '../mutations/useFinanceMutations'
import { usePaymentMethodsQuery } from '@/app/tanstack-queries/financeQuery'

const INCOME_CATEGORIES = [
  'Venta Directa',
  'Servicios',
  'Reembolso',
  'Otro',
] as const

export default function OtherIncomeForm() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] =
    useState<(typeof INCOME_CATEGORIES)[number]>('Otro')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('Efectivo')

  const { data: paymentMethods = [] } = usePaymentMethodsQuery()
  const createMutation = useCreateTransactionMutation()

  const handleSubmit = () => {
    const amountNum = Number(amount)
    if (!amountNum || amountNum <= 0) return
    if (!description.trim()) return

    createMutation.mutate(
      {
        type: 'income',
        category,
        amount: amountNum,
        date,
        paymentMethod,
        status: 'Recibido',
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setAmount('')
          setDescription('')
          setCategory('Otro')
        },
      },
    )
  }

  return (
    <div className="rounded-xl border border-green-500/30 bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <DollarSign size={16} className="text-green-500" />
        <h3 className="text-sm font-heading font-bold uppercase tracking-wide text-text">
          Registrar otro ingreso
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Input
          type="number"
          label="Monto"
          placeholder="0.00"
          value={amount}
          onValueChange={setAmount}
          startContent={<span className="text-text-muted text-xs">$</span>}
          size="sm"
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-bg border-border',
          }}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as (typeof INCOME_CATEGORIES)[number])
          }
          className="rounded-medium border border-border bg-bg px-3 py-2 text-sm text-text"
        >
          {INCOME_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="rounded-medium border border-border bg-bg px-3 py-2 text-sm text-text"
        >
          {paymentMethods
            .filter((pm) => pm.isActive)
            .map((pm) => (
              <option key={pm.id} value={pm.name}>
                {pm.name}
              </option>
            ))}
          {paymentMethods.length === 0 && <option>Efectivo</option>}
        </select>

        <Input
          type="date"
          label="Fecha"
          value={date}
          onValueChange={setDate}
          size="sm"
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-bg border-border',
          }}
        />

        <Input
          label="Descripción"
          placeholder="Ej: Servicio fotografía"
          value={description}
          onValueChange={setDescription}
          size="sm"
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-bg border-border',
          }}
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          color="success"
          startContent={<Plus size={16} />}
          onPress={handleSubmit}
          isLoading={createMutation.isPending}
          isDisabled={!amount || !description.trim() || Number(amount) <= 0}
        >
          Registrar ingreso
        </Button>
      </div>
    </div>
  )
}
