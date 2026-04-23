import { Button, Spinner } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useProductTypesPageHook } from './hooks/useProductTypesPageHook'
import ProductTypeCard from './components/ProductTypeCard'
import FormModal from './components/modals/FormModal'
import DeleteModal from './components/modals/DeleteModal'

export function TiposProducto() {
  const {
    productTypes,
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
  } = useProductTypesPageHook()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
            Tipos de Producto
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Gestiona los tipos de producto (Perfume, Decant, etc.).
          </p>
        </div>
        <Button
          color="warning"
          radius="full"
          endContent={<PlusIcon size={18} />}
          onPress={handleCreateClick}
        >
          Crear Tipo
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : productTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-text-muted">No hay tipos de producto creados.</p>
          <Button
            color="warning"
            variant="flat"
            className="mt-4"
            onPress={handleCreateClick}
          >
            Crear el primero
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {productTypes.map((pt) => (
            <ProductTypeCard
              key={pt.id}
              productType={pt}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
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
        productType={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
