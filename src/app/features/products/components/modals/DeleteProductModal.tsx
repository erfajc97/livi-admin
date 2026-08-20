import { Button } from '@heroui/react'
import { AlertTriangle } from 'lucide-react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { Product } from '../../types'

interface DeleteProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onConfirm: () => void
  isDeleting: boolean
  /**
   * Motivo que devolvió el backend cuando el producto ya se vendió (409).
   * Mientras esté presente, el modal pasa al segundo paso: borrar de todas
   * formas desvinculando los pedidos.
   */
  conflict?: string | null
  onForce?: () => void
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onConfirm,
  isDeleting,
  conflict,
  onForce,
}: DeleteProductModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      headerContent={
        <h3>{conflict ? 'Este producto tiene pedidos' : 'Eliminar producto'}</h3>
      }
    >
      <div className="flex flex-col gap-4">
        {conflict ? (
          <>
            <div className="flex gap-3 rounded-medium border border-warning/40 bg-warning/10 p-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-warning"
              />
              <p className="text-sm text-text">{conflict}</p>
            </div>
            <p className="text-sm text-text-muted">
              Si lo borras igual, los pedidos <strong>no se pierden</strong>:
              conservan precio, cantidad y total, pero esa línea deja de mostrar{' '}
              <strong className="text-text">{product?.name}</strong>. El stock
              que ya descontaron esos pedidos tampoco vuelve.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
                Cancelar
              </Button>
              <Button color="danger" onPress={onForce} isLoading={isDeleting}>
                Eliminar de todas formas
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-text-muted">
              ¿Estás seguro de eliminar{' '}
              <strong className="text-text">{product?.name}</strong>? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
                Cancelar
              </Button>
              <Button color="danger" onPress={onConfirm} isLoading={isDeleting}>
                Eliminar
              </Button>
            </div>
          </>
        )}
      </div>
    </CustomModalNextUI>
  )
}
