import { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'

interface AdjustMlModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentOpenMl: number
  isLoading: boolean
  onConfirm: (newOpenMl: number, note?: string) => void
}

export default function AdjustMlModal({
  isOpen,
  onOpenChange,
  currentOpenMl,
  isLoading,
  onConfirm,
}: AdjustMlModalProps) {
  const [newMl, setNewMl] = useState(String(currentOpenMl))
  const [note, setNote] = useState('')

  const handleConfirm = () => {
    const ml = Number(newMl)
    if (isNaN(ml) || ml < 0) return
    onConfirm(ml, note.trim() || undefined)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setNewMl(String(currentOpenMl))
      setNote('')
    }
    onOpenChange(open)
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="md"
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      headerContent={
        <h3 className="text-lg font-semibold text-text">Ajustar ML abiertos</h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button
            color="danger"
            variant="flat"
            onPress={() => handleClose(false)}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            color="warning"
            onPress={handleConfirm}
            isLoading={isLoading}
            isDisabled={!newMl}
          >
            Guardar ajuste
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">
          Ajusta manualmente los ML restantes en la botella abierta. Valor
          actual: <strong className="text-text">{currentOpenMl}ml</strong>
        </p>

        <Input
          label="Nuevos ML abiertos"
          placeholder="0"
          type="number"
          value={newMl}
          onValueChange={setNewMl}
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-background border-border',
          }}
          isRequired
        />

        <Input
          label="Nota (opcional)"
          placeholder="Ej: Correccion por derrame"
          size="sm"
          value={note}
          onValueChange={setNote}
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-background border-border',
          }}
        />
      </div>
    </CustomModalNextUI>
  )
}
