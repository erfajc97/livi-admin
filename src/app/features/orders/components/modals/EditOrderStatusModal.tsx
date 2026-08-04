import { useState, useEffect } from 'react'
import { Button, RadioGroup, Radio, Textarea } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import { ORDER_STATUS_OPTIONS } from '../../data'
import type { OrderStatus } from '../../types'

interface EditOrderStatusModalProps {
  isOpen: boolean
  currentStatus: OrderStatus
  isLoading: boolean
  onConfirm: (status: OrderStatus, note?: string) => void
  onClose: () => void
}

export default function EditOrderStatusModal({
  isOpen,
  currentStatus,
  isLoading,
  onConfirm,
  onClose,
}: EditOrderStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus)
      setNote('')
    }
  }, [isOpen, currentStatus])

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      headerContent={<span className="text-text">Cambiar estado de orden</span>}
    >
      <div className="flex flex-col gap-4 p-4">
        <RadioGroup
          value={status}
          onValueChange={(val) => setStatus(val as OrderStatus)}
          classNames={{ wrapper: 'gap-2' }}
        >
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              value={opt.value}
              classNames={{
                label: 'text-text',
                wrapper: 'group-data-[selected=true]:border-accent',
                control: 'group-data-[selected=true]:bg-accent',
              }}
            >
              {opt.label}
            </Radio>
          ))}
        </RadioGroup>

        <Textarea
          label="Nota (opcional)"
          placeholder="Ej: Entregado a Servientrega, guía 123456"
          value={note}
          onValueChange={setNote}
          classNames={{ label: '!text-text', input: '!text-text' }}
          minRows={2}
        />

        <div className="flex justify-end gap-2">
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={() => onConfirm(status, note || undefined)}
            isLoading={isLoading}
            isDisabled={status === currentStatus}
          >
            Guardar
          </Button>
        </div>
      </div>
    </CustomModalNextUI>
  )
}
