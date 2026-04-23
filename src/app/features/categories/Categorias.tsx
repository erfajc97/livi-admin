import { Button, Spinner } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useCategoriesPageHook } from './hooks/useCategoriesPageHook'
import CategoryCard from './components/CategoryCard'
import FormModal from './components/modals/FormModal'
import DeleteModal from './components/modals/DeleteModal'

export function Categorias() {
  const {
    categories,
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
  } = useCategoriesPageHook()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
            Categorías
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Gestiona las categorías de productos de la tienda.
          </p>
        </div>
        <Button
          color="warning"
          radius="full"
          endContent={<PlusIcon size={18} />}
          onPress={handleCreateClick}
        >
          Crear Categoría
        </Button>
      </div>

      {/* Category cards list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-text-muted">No hay categorías creadas.</p>
          <Button
            color="warning"
            variant="flat"
            className="mt-4"
            onPress={handleCreateClick}
          >
            Crear la primera
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
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
        imagePreview={formHook.imagePreview}
        onInputChange={formHook.onInputChange}
        onImageChange={formHook.onImageChange}
        onSubmit={formHook.handleSubmit}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        category={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
