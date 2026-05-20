import { Button, Spinner } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useCouponsPageHook } from './hooks/useCouponsPageHook'
import CouponCard from './components/CouponCard'
import FormModal from './components/modals/FormModal'
import DeleteModal from './components/modals/DeleteModal'

export function Coupons() {
  const {
    coupons,
    isLoading,
    formHook,
    deleteTarget,
    isOpen,
    isDeleteOpen,
    isDeleting,
    onDeleteOpenChange,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleFormModalOpenChange,
  } = useCouponsPageHook()

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">Cupones</h1>
          <p className="mt-1 text-sm text-text-muted">Gestiona los cupones de descuento.</p>
        </div>
        <Button color="warning" radius="full" endContent={<PlusIcon size={18} />} onPress={handleCreateClick} className="w-full sm:w-auto">
          Crear Cupón
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-text-muted">No hay cupones creados.</p>
          <Button color="warning" variant="flat" className="mt-4" onPress={handleCreateClick}>
            Crear el primero
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} onEdit={handleEditClick} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      <FormModal
        isOpen={isOpen}
        onOpenChange={handleFormModalOpenChange}
        isThereId={formHook.isThereId}
        isSubmitting={formHook.isSubmitting}
        formData={formHook.formData}
        onInputChange={formHook.onInputChange}
        onSubmit={formHook.handleSubmit}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        coupon={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
