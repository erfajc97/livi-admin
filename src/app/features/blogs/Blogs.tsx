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
import { useBlogsPageHook } from './hooks/useBlogsPageHook'
import BlogCard from './components/BlogCard'
import FormModal from './components/modals/FormModal'
import DeleteModal from './components/modals/DeleteModal'

export function Blogs() {
  const {
    blogs,
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
  } = useBlogsPageHook()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
            Blog
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Gestiona los posts del blog. Arrastra para reordenar.
          </p>
        </div>
        <Button
          color="warning"
          radius="full"
          endContent={<PlusIcon size={18} />}
          onPress={handleCreateClick}
          className="w-full sm:w-auto"
        >
          Crear Blog Post
        </Button>
      </div>

      {/* Blog cards list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-text-muted">No hay blog posts creados.</p>
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
            items={blogs.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
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
        onInputChange={formHook.onInputChange}
        onImageChange={formHook.onImageChange}
        onSubmit={formHook.handleSubmit}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        blog={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
