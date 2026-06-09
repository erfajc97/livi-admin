import { Button, Chip, Spinner, Switch } from '@heroui/react'
import { PlusIcon, PencilIcon, TrashIcon, Image as ImageIcon } from 'lucide-react'
import { usePublicidadNavbarHook } from './hooks/usePublicidadNavbarHook'
import PublicidadFormModal from './components/PublicidadFormModal'
import DeleteModal from '@/app/features/banners/components/modals/DeleteModal'
import { useToggleBannerVisibilityMutation } from '@/app/features/banners/mutations/useBannerMutations'
import type { Banner } from '@/app/features/banners/types'

function PublicidadCard({
  banner,
  onEdit,
  onDelete,
}: {
  banner: Banner
  onEdit: (b: Banner) => void
  onDelete: (b: Banner) => void
}) {
  const toggleVisibility = useToggleBannerVisibilityMutation()

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30 sm:flex-row sm:gap-4">
      {/* Imagen */}
      <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-raised">
        {banner.imageUrl ? (
          <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon size={32} className="text-text-muted" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="truncate text-base font-semibold text-text">{banner.title}</h3>
            <Switch
              size="sm"
              color="warning"
              isSelected={banner.isVisible}
              isDisabled={toggleVisibility.isPending}
              onValueChange={(val) =>
                toggleVisibility.mutate({ id: String(banner.id), isVisible: val })
              }
              aria-label="Visibilidad en el mega menú"
            />
            <Chip size="sm" variant="flat" color={banner.isVisible ? 'success' : 'default'}>
              {banner.isVisible ? 'Visible' : 'Oculto'}
            </Chip>
          </div>
          {banner.subtitle && (
            <p className="mt-1 line-clamp-2 text-sm text-text-muted">{banner.subtitle}</p>
          )}
          {banner.link && (
            <p className="mt-1 truncate text-xs text-text-muted">
              Link: <span className="text-accent">{banner.link}</span>
            </p>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex shrink-0 flex-wrap items-start gap-1 self-end sm:self-start">
        <Button isIconOnly size="sm" variant="light" onPress={() => onEdit(banner)} aria-label="Editar">
          <PencilIcon size={16} className="text-text-muted" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onDelete(banner)}
          aria-label="Eliminar"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
    </div>
  )
}

export function PublicidadNavbar() {
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
  } = usePublicidadNavbarHook()

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
            Publicidad navbar
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Imagen destacada del mega menú del navbar (panel "Destacado"). Sube imagen, descripción y link.
          </p>
        </div>
        <Button
          color="warning"
          radius="full"
          endContent={<PlusIcon size={18} />}
          onPress={handleCreateClick}
          className="w-full sm:w-auto"
        >
          Crear publicidad
        </Button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-text-muted">Aún no hay publicidad de navbar.</p>
          <Button color="warning" variant="flat" className="mt-4" onPress={handleCreateClick}>
            Crear la primera
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {banners.map((banner) => (
            <PublicidadCard
              key={banner.id}
              banner={banner}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      <PublicidadFormModal
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
        banner={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
