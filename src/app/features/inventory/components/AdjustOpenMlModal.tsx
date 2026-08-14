import { useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  addToast,
} from '@heroui/react'
import { inventoryService } from '../services/inventoryService'

interface AdjustOpenMlModalProps {
  isOpen: boolean
  productId: number
  productName: string
  currentMl: number
  totalMl: number
  onClose: () => void
  onAdjusted: () => void
}

/**
 * Corrección manual de la botella abierta: se rompió, se derramó o el conteo
 * quedó mal. El movimiento se registra como evento, así que la línea de tiempo
 * conserva el antes y el después.
 */
export default function AdjustOpenMlModal({
  isOpen,
  productId,
  productName,
  currentMl,
  totalMl,
  onClose,
  onAdjusted,
}: AdjustOpenMlModalProps) {
  const [value, setValue] = useState(String(currentMl))
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const newMl = Number(value)
  const isValid =
    value.trim() !== '' && !Number.isNaN(newMl) && newMl >= 0 && newMl <= totalMl
  const diff = isValid ? newMl - currentMl : 0

  const handleSave = async () => {
    if (!isValid) return
    setIsSaving(true)
    try {
      await inventoryService.adjustOpenMl(productId, newMl, note.trim() || undefined)
      addToast({ title: 'Botella abierta actualizada', color: 'success' })
      onAdjusted()
      onClose()
    } catch (error: any) {
      addToast({
        title:
          error?.response?.data?.message || 'No se pudo ajustar la botella abierta',
        color: 'danger',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent className="bg-surface">
        <ModalHeader className="flex flex-col gap-1 text-text">
          Ajustar botella abierta
          <span className="text-xs font-normal text-text-muted">{productName}</span>
        </ModalHeader>
        <ModalBody className="gap-4">
          <div className="rounded-lg border border-border bg-bg p-3 text-sm text-text-muted">
            Ahora quedan{' '}
            <strong className="text-text">{currentMl} ml</strong> de una botella de{' '}
            {totalMl} ml.
          </div>

          <Input
            label="Mililitros restantes"
            type="number"
            min={0}
            max={totalMl}
            value={value}
            onValueChange={setValue}
            isRequired
            description={`Pon 0 si la botella se rompió o se vació por completo (máximo ${totalMl} ml)`}
            classNames={{ label: '!text-text', input: '!text-text' }}
          />

          <Textarea
            label="Motivo"
            placeholder="Se rompió la botella, derrame, conteo corregido…"
            value={note}
            onValueChange={setNote}
            minRows={2}
            classNames={{ label: '!text-text', input: '!text-text' }}
          />

          {isValid && diff !== 0 && (
            <p className="text-sm text-text-muted">
              Cambio:{' '}
              <strong className={diff < 0 ? 'text-danger' : 'text-success'}>
                {diff > 0 ? '+' : ''}
                {diff} ml
              </strong>
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isSaving}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isDisabled={!isValid || isSaving}
            isLoading={isSaving}
          >
            Guardar ajuste
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
