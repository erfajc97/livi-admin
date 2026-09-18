import { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { AlertTriangle } from 'lucide-react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import { useResetOrdersMutation } from '../../mutations/useOrderMutations'

interface ResetOrdersModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  /** Cuántas órdenes hay ahora mismo, para que el admin vea qué va a perder. */
  ordersCount: number
}

const CONFIRM_WORD = 'RESET'

/**
 * Borrado masivo del historial de órdenes. Pide escribir la palabra completa:
 * es irreversible y no hay papelera, así que un clic no puede dispararlo.
 */
export default function ResetOrdersModal({
  isOpen,
  onOpenChange,
  ordersCount,
}: ResetOrdersModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const { mutate: resetOrders, isPending } = useResetOrdersMutation()

  const close = () => {
    setConfirmText('')
    onOpenChange(false)
  }

  const handleReset = () => {
    if (confirmText !== CONFIRM_WORD) return
    resetOrders(undefined, { onSuccess: close })
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpenChange(true) : close())}
      isDismissable={!isPending}
      size="lg"
      headerContent={<h3>Reiniciar todas las órdenes</h3>}
      footerContent={
        <>
          <Button
            color="default"
            variant="flat"
            onPress={close}
            isDisabled={isPending}
          >
            <p className="text-text">Cancelar</p>
          </Button>
          <Button
            color="danger"
            isLoading={isPending}
            isDisabled={confirmText !== CONFIRM_WORD}
            onPress={handleReset}
          >
            Borrar {ordersCount} órdenes
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 rounded-medium border border-danger/40 bg-danger/10 p-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-danger" />
          <p className="text-sm text-text">
            Se borran las <strong>{ordersCount} órdenes</strong> con sus items,
            su historial de estados y las transacciones automáticas que
            generaron (COGS y comisión Payphone). No hay forma de deshacerlo.
          </p>
        </div>

        <p className="text-sm text-text-muted">
          No se tocan productos, usuarios ni clientes. El stock que esas órdenes
          descontaron <strong>no vuelve</strong>: ajústalo desde inventario si
          hace falta.
        </p>

        <Input
          label={`Escribe ${CONFIRM_WORD} para confirmar`}
          value={confirmText}
          onValueChange={setConfirmText}
          isDisabled={isPending}
          autoComplete="off"
          classNames={{
            inputWrapper: 'bg-bg-alt border border-border',
            input: 'text-text',
          }}
        />
      </div>
    </CustomModalNextUI>
  )
}
