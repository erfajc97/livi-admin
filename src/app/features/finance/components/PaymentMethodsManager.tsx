import { useState } from 'react'
import { Button, Input, Chip } from '@heroui/react'
import { Plus, Edit2, Trash2, X, Save, CreditCard, AlertTriangle } from 'lucide-react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import { usePaymentMethodsQuery } from '@/app/tanstack-queries/financeQuery'
import {
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} from '../mutations/useFinanceMutations'
import type { PaymentMethod } from '../types'

export default function PaymentMethodsManager() {
  const { data: methods = [], isLoading } = usePaymentMethodsQuery()
  const createMutation = useCreatePaymentMethodMutation()
  const updateMutation = useUpdatePaymentMethodMutation()
  const deleteMutation = useDeletePaymentMethodMutation()

  const [newName, setNewName] = useState('')
  const [newDetail, setNewDetail] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDetail, setEditDetail] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null)

  const handleCreate = () => {
    if (!newName.trim()) return
    createMutation.mutate(
      { name: newName.trim(), detail: newDetail.trim() || undefined },
      {
        onSuccess: () => {
          setNewName('')
          setNewDetail('')
        },
      },
    )
  }

  const startEdit = (m: PaymentMethod) => {
    setEditId(m.id)
    setEditName(m.name)
    setEditDetail(m.detail ?? '')
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditName('')
    setEditDetail('')
  }

  const handleSaveEdit = () => {
    if (editId === null || !editName.trim()) return
    updateMutation.mutate(
      { id: editId, payload: { name: editName.trim(), detail: editDetail.trim() || undefined } },
      { onSuccess: cancelEdit },
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const handleToggleActive = (m: PaymentMethod) => {
    updateMutation.mutate({ id: m.id, payload: { isActive: !m.isActive } })
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-accent" />
          <h3 className="text-sm font-heading font-bold uppercase tracking-wide text-text">Métodos de pago</h3>
        </div>
        <Chip size="sm" variant="flat" color="default">{methods.length}</Chip>
      </div>

      {/* Create form */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-4 p-3 rounded-lg bg-bg border border-border/50">
        <Input
          placeholder="Nombre (ej: Tarjeta Pichincha)"
          value={newName}
          onValueChange={setNewName}
          size="sm"
          classNames={{ input: '!text-text', inputWrapper: 'bg-surface border-border' }}
        />
        <Input
          placeholder="Detalle (ej: cuenta corriente 2200xxxx)"
          value={newDetail}
          onValueChange={setNewDetail}
          size="sm"
          classNames={{ input: '!text-text', inputWrapper: 'bg-surface border-border' }}
        />
        <Button
          color="warning"
          startContent={<Plus size={14} />}
          onPress={handleCreate}
          isLoading={createMutation.isPending}
          isDisabled={!newName.trim()}
          size="sm"
        >
          Agregar
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-sm text-text-muted text-center py-4">Cargando...</p>
      ) : methods.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">No hay métodos de pago. Agrega uno arriba.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {methods.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border p-3 ${m.isActive ? 'border-border bg-bg' : 'border-border/30 bg-bg/50 opacity-60'}`}
            >
              {editId === m.id ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <Input
                    value={editName}
                    onValueChange={setEditName}
                    size="sm"
                    placeholder="Nombre"
                    classNames={{ input: '!text-text', inputWrapper: 'bg-surface border-border' }}
                  />
                  <Input
                    value={editDetail}
                    onValueChange={setEditDetail}
                    size="sm"
                    placeholder="Detalle"
                    classNames={{ input: '!text-text', inputWrapper: 'bg-surface border-border' }}
                  />
                  <div className="flex gap-1 shrink-0">
                    <Button isIconOnly size="sm" color="success" onPress={handleSaveEdit} isLoading={updateMutation.isPending}>
                      <Save size={14} />
                    </Button>
                    <Button isIconOnly size="sm" variant="flat" onPress={cancelEdit}>
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-text">{m.name}</span>
                      {!m.isActive && <Chip size="sm" variant="flat" color="default" className="h-5 text-[10px]">Inactivo</Chip>}
                    </div>
                    {m.detail && <p className="text-xs text-text-muted mt-0.5 break-words">{m.detail}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0 self-end sm:self-auto">
                    <Button isIconOnly size="sm" variant="flat" onPress={() => handleToggleActive(m)}>
                      {m.isActive ? <X size={14} /> : <Plus size={14} />}
                    </Button>
                    <Button isIconOnly size="sm" variant="flat" color="primary" onPress={() => startEdit(m)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => setDeleteTarget(m)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CustomModalNextUI
        isOpen={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        size="sm"
        isDismissable={!deleteMutation.isPending}
        hideCloseButton={deleteMutation.isPending}
        headerContent={
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-400" />
            <span className="text-text">Eliminar método de pago</span>
          </div>
        }
        footerContent={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="flat" onPress={() => setDeleteTarget(null)} isDisabled={deleteMutation.isPending}>
              Cancelar
            </Button>
            <Button color="danger" onPress={confirmDelete} isLoading={deleteMutation.isPending}>
              Eliminar
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-2 p-2">
          <p className="text-sm text-text">
            ¿Seguro que deseas eliminar <strong className="text-accent">{deleteTarget?.name}</strong>?
          </p>
          {deleteTarget?.detail && (
            <p className="text-xs text-text-muted">{deleteTarget.detail}</p>
          )}
          <p className="text-xs text-text-muted mt-2">
            Esta acción no se puede deshacer. Las cuentas registradas con este método conservarán el nombre como texto.
          </p>
        </div>
      </CustomModalNextUI>
    </div>
  )
}
