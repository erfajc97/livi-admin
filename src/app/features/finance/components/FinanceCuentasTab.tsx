import { useState } from 'react'
import { Button, Input, Select, SelectItem, Textarea, Chip } from '@heroui/react'
import { Plus, Trash2, Check, AlertTriangle, Clock, X } from 'lucide-react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import { useCreateBillMutation, useUpdateBillMutation, useDeleteBillMutation } from '../mutations/useFinanceMutations'
import { PAYMENT_METHODS } from '../data'
import type { FinanceStats } from '../types'

interface BillItem {
  description: string
  amount: string
}

interface FinanceCuentasTabProps {
  stats: FinanceStats | null
  onMarkPaid: (id: number) => void
  onCreateBill: (data: any) => void
}

const inputClasses = { label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }
const selectClasses = { label: '!text-text', popoverContent: 'bg-surface border border-border', listbox: 'text-text' }

export default function FinanceCuentasTab({ stats, onMarkPaid }: FinanceCuentasTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [bank, setBank] = useState('')
  const [items, setItems] = useState<BillItem[]>([{ description: '', amount: '' }])

  const createMutation = useCreateBillMutation()
  const updateMutation = useUpdateBillMutation()
  const deleteMutation = useDeleteBillMutation()

  const bills = stats?.bills?.all ?? []
  const pendingBills = bills.filter((b) => b.status !== 'paid')
  const paidBills = bills.filter((b) => b.status === 'paid')

  const today = new Date().toISOString().split('T')[0]

  const resetForm = () => {
    setName(''); setDescription(''); setAmount(''); setDueDate(''); setPaymentMethod(''); setBank('')
    setItems([{ description: '', amount: '' }])
    setShowForm(false)
  }

  const handleCreate = () => {
    const billItems = items
      .filter((i) => i.description && i.amount)
      .map((i) => ({ description: i.description, amount: Number(i.amount) }))

    createMutation.mutate(
      {
        name,
        description: description || undefined,
        amount: Number(amount),
        dueDate,
        paymentMethod: paymentMethod || undefined,
        bank: bank || undefined,
        items: billItems.length > 0 ? billItems : undefined,
      },
      { onSuccess: resetForm },
    )
  }

  const handleMarkPaid = (id: number) => {
    updateMutation.mutate({ id, payload: { status: 'paid' } })
  }

  const addItem = () => setItems((prev) => [...prev, { description: '', amount: '' }])
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx))
  const updateItem = (idx: number, field: keyof BillItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)))
  }

  const selectedBill = selectedBillId ? bills.find((b) => Number(b.id) === selectedBillId) : null

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold text-text">Cuentas por Pagar</h2>
          <p className="text-xs text-text-muted">
            {pendingBills.length} pendientes · Total: <strong className="text-red-400">${stats?.bills?.pendingTotal?.toFixed(2) ?? '0.00'}</strong>
          </p>
        </div>
        <Button color="warning" size="sm" startContent={<Plus size={14} />} onPress={() => setShowForm(!showForm)}>
          Nueva Cuenta
        </Button>
      </div>

      {/* Create bill form */}
      {showForm && (
        <div className="rounded-xl border border-accent/30 bg-surface p-5">
          <h3 className="text-sm font-bold text-accent mb-4">Registrar cuenta por pagar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input label="Descripción de la compra" value={name} onValueChange={setName} classNames={inputClasses} isRequired />
            <Input label="Monto total ($)" type="number" value={amount} onValueChange={setAmount} classNames={inputClasses} isRequired />
            <Input label="Fecha límite de pago" type="date" value={dueDate} onValueChange={setDueDate} classNames={inputClasses} isRequired />
            <Select label="Método de pago" selectedKeys={paymentMethod ? [paymentMethod] : []} onSelectionChange={(k) => setPaymentMethod(String(Array.from(k)[0] || ''))} classNames={selectClasses}>
              {PAYMENT_METHODS.map((m) => <SelectItem key={m}>{m}</SelectItem>)}
            </Select>
            <Input label="Banco / Cuenta" value={bank} onValueChange={setBank} classNames={inputClasses} placeholder="Ej: TC Produbanco" />
            <div className="sm:col-span-2 lg:col-span-3">
              <Textarea label="Descripción detallada (opcional)" value={description} onValueChange={setDescription} classNames={{ label: '!text-text', input: '!text-text' }} minRows={1} />
            </div>
          </div>

          {/* Items */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-text-muted uppercase">Desglose de ítems</span>
              <Button size="sm" variant="flat" startContent={<Plus size={12} />} onPress={addItem} className="text-xs">Agregar ítem</Button>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <Input label="Descripción" size="sm" value={item.description} onValueChange={(v) => updateItem(idx, 'description', v)} classNames={inputClasses} className="flex-1" />
                  <Input label="Monto ($)" size="sm" type="number" value={item.amount} onValueChange={(v) => updateItem(idx, 'amount', v)} classNames={inputClasses} className="w-32" />
                  {items.length > 1 && (
                    <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => removeItem(idx)}>
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="flat" onPress={resetForm}>Cancelar</Button>
            <Button color="warning" onPress={handleCreate} isLoading={createMutation.isPending} isDisabled={!name || !amount || !dueDate}>
              Crear cuenta
            </Button>
          </div>
        </div>
      )}

      {/* Pending bills */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="text-sm font-heading font-bold text-text uppercase tracking-wider mb-3">Pendientes</h3>
        {pendingBills.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">No hay cuentas pendientes.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {pendingBills.map((bill) => {
              const isOverdue = bill.dueDate < today
              return (
                <div key={bill.id} className="flex items-center justify-between py-3 px-1 cursor-pointer hover:bg-bg/50 rounded" onClick={() => setSelectedBillId(Number(bill.id))}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text truncate">{bill.name}</p>
                      {isOverdue && (
                        <Chip size="sm" color="danger" variant="flat" startContent={<AlertTriangle size={10} />}>
                          Vencida
                        </Chip>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      Vence: {bill.dueDate} · {bill.paymentMethod || bill.bank || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-text">${Number(bill.amount).toFixed(2)}</span>
                    <Button size="sm" color="success" variant="flat" startContent={<Check size={12} />} onPress={(e) => { e.stopPropagation?.(); handleMarkPaid(Number(bill.id)); }}>
                      Pagar
                    </Button>
                    <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => deleteMutation.mutate(Number(bill.id))}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Paid bills */}
      {paidBills.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-heading font-bold text-text uppercase tracking-wider mb-3">Pagadas</h3>
          <div className="flex flex-col divide-y divide-border">
            {paidBills.slice(0, 10).map((bill) => (
              <div key={bill.id} className="flex items-center justify-between py-3 px-1 cursor-pointer hover:bg-bg/50 rounded" onClick={() => setSelectedBillId(Number(bill.id))}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-muted truncate">{bill.name}</p>
                  <p className="text-xs text-text-muted">Pagada · {bill.paidAt ? new Date(bill.paidAt).toLocaleDateString('es-EC') : bill.dueDate}</p>
                </div>
                <span className="text-sm text-text-muted">${Number(bill.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bill detail modal */}
      <CustomModalNextUI
        isOpen={!!selectedBill}
        onOpenChange={(open) => { if (!open) setSelectedBillId(null) }}
        size="lg"
        headerContent={<span className="text-text">{selectedBill?.name}</span>}
      >
        {selectedBill && (
          <div className="flex flex-col gap-4 p-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-text-muted">Monto:</span>
                <p className="font-bold text-text">${Number(selectedBill.amount).toFixed(2)}</p>
              </div>
              <div>
                <span className="text-text-muted">Fecha límite:</span>
                <p className="text-text">{selectedBill.dueDate}</p>
              </div>
              <div>
                <span className="text-text-muted">Estado:</span>
                <Chip size="sm" color={selectedBill.status === 'paid' ? 'success' : 'warning'} variant="flat">
                  {selectedBill.status === 'paid' ? 'Pagada' : 'Pendiente'}
                </Chip>
              </div>
              <div>
                <span className="text-text-muted">Método:</span>
                <p className="text-text">{selectedBill.paymentMethod || selectedBill.bank || '—'}</p>
              </div>
            </div>

            {selectedBill.description && (
              <div>
                <span className="text-xs text-text-muted">Descripción:</span>
                <p className="text-sm text-text">{selectedBill.description}</p>
              </div>
            )}

            {selectedBill.items && selectedBill.items.length > 0 && (
              <div>
                <span className="text-xs text-text-muted font-bold uppercase">Desglose:</span>
                <div className="mt-2 flex flex-col divide-y divide-border">
                  {selectedBill.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-2 text-sm">
                      <span className="text-text">{item.description}</span>
                      <span className="text-text font-bold">${Number(item.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CustomModalNextUI>
    </div>
  )
}
