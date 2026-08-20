import { Button, Spinner } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBannersPageHook } from './hooks/useBannersPageHook'
import BannerCard from './components/BannerCard'
import FormModal from './components/modals/FormModal'
import DeleteModal from './components/modals/DeleteModal'

export function Banners() {
  const {
    banners,
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
    handleDragEnd,
  } = useBannersPageHook()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
            Banners
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Gestiona los banners promocionales de la tienda. Arrastra para
            reordenar.
          </p>
        </div>
        <Button
          color="warning"
          radius="full"
          endContent={<PlusIcon size={18} />}
          onPress={handleCreateClick}
          className="w-full sm:w-auto"
        >
          Crear Banner
        </Button>
      </div>

      {/* Banner cards list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-text-muted">No hay banners creados.</p>
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={banners.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {banners.map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      <FormModal
        isOpen={isOpen}
        onOpenChange={handleFormModalOpenChange}
        isThereId={formHook.isThereId}
        isSubmitting={formHook.isSubmitting}
        formData={formHook.formData}
        imagePreview={formHook.imagePreview}
        mobileImagePreview={formHook.mobileImagePreview}
        onInputChange={formHook.onInputChange}
        onImageChange={formHook.onImageChange}
        onMobileImageChange={formHook.onMobileImageChange}
        onSubmit={formHook.handleSubmit}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        banner={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
