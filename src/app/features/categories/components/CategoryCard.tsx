import { useState } from 'react'
import { Button, Chip } from '@heroui/react'
import { PencilIcon, TrashIcon, Image, ChevronDownIcon } from 'lucide-react'
import type { Category } from '../types'
import MarcaList from './MarcaList'
import { useMarcaHook } from '../hooks/useMarcaHook'
import MarcaFormModal from './modals/MarcaFormModal'
import MarcaDeleteModal from './modals/MarcaDeleteModal'

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false)

  const marcaHook = useMarcaHook(expanded ? category.id : null)

  const marcaCount = category.marcas?.length ?? 0

  return (
    <div className="rounded-xl border border-border bg-surface transition hover:border-accent/30">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:gap-4">
        {/* Image thumbnail */}
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-raised sm:h-24 sm:w-32">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image size={32} className="text-text-muted" />
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="truncate text-base font-semibold text-text">
                {category.name}
              </h3>
              <Chip
                size="sm"
                variant="bordered"
                color="default"
                className="h-5 font-mono text-[10px]"
                title="Usa este ID en la columna categoria_id del Excel de importación"
              >
                ID: {category.id}
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                color={category.isActive ? 'success' : 'default'}
              >
                {category.isActive ? 'Activa' : 'Inactiva'}
              </Chip>
              {category.bajoPedido && (
                <Chip size="sm" variant="flat" color="warning">
                  Bajo Pedido
                </Chip>
              )}
            </div>
            {category.description && (
              <p className="mt-1 line-clamp-2 text-sm text-text-muted">
                {category.description}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant="light"
            className="mt-2 w-fit text-accent"
            endContent={
              <ChevronDownIcon
                size={14}
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            }
            onPress={() => setExpanded(!expanded)}
          >
            Marcas ({marcaCount})
          </Button>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-wrap items-start gap-1 self-end sm:self-start">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onEdit(category)}
            aria-label="Editar categoría"
          >
            <PencilIcon size={16} className="text-text-muted" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={() => onDelete(category)}
            aria-label="Eliminar categoría"
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      </div>

      {/* Expandable marca section */}
      {expanded && (
        <div className="border-t border-border/50 px-4 py-3">
          <MarcaList
            marcas={marcaHook.marcas}
            isLoading={marcaHook.isLoading}
            onAdd={marcaHook.handleCreateClick}
            onEdit={marcaHook.handleEditClick}
            onDelete={marcaHook.handleDeleteClick}
          />

          <MarcaFormModal
            isOpen={marcaHook.isFormOpen}
            onOpenChange={marcaHook.handleFormModalOpenChange}
            isEditing={marcaHook.isEditing}
            isSubmitting={marcaHook.isSubmitting}
            formData={marcaHook.formData}
            onInputChange={marcaHook.onInputChange}
            onImageChange={marcaHook.onImageChange}
            onSubmit={marcaHook.handleSubmit}
          />

          <MarcaDeleteModal
            isOpen={marcaHook.isDeleteOpen}
            onOpenChange={marcaHook.onDeleteOpenChange}
            marca={marcaHook.deleteTarget}
            isDeleting={marcaHook.isDeleting}
            onConfirm={marcaHook.handleConfirmDelete}
          />
        </div>
      )}
    </div>
  )
}
