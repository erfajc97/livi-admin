import { Button, Chip, Switch } from '@heroui/react'
import { PencilIcon, TrashIcon, Image, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Banner } from '../types'
import { useToggleBannerVisibilityMutation } from '../mutations/useBannerMutations'

interface BannerCardProps {
  banner: Banner
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
}

export default function BannerCard({ banner, onEdit, onDelete }: BannerCardProps) {
  const toggleVisibility = useToggleBannerVisibilityMutation()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: banner.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex shrink-0 cursor-grab items-center active:cursor-grabbing"
      >
        <GripVertical size={20} className="text-text-muted" />
      </div>

      {/* Image thumbnail */}
      <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-raised">
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image size={32} className="text-text-muted" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-text">{banner.title}</h3>
            <Switch
              size="sm"
              color="warning"
              isSelected={banner.isVisible}
              isDisabled={toggleVisibility.isPending}
              onValueChange={(val) =>
                toggleVisibility.mutate({ id: String(banner.id), isVisible: val })
              }
              aria-label="Visibilidad en landing"
            />
            <Chip
              size="sm"
              variant="flat"
              color={banner.isVisible ? 'success' : 'default'}
            >
              {banner.isVisible ? 'Visible' : 'Oculto'}
            </Chip>
          </div>
          {banner.subtitle && (
            <p className="mt-1 text-sm text-text-muted">{banner.subtitle}</p>
          )}
          {banner.link && (
            <p className="mt-1 text-xs text-text-muted">
              Link: <span className="text-accent">{banner.link}</span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-start gap-1">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => onEdit(banner)}
          aria-label="Editar banner"
        >
          <PencilIcon size={16} className="text-text-muted" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onDelete(banner)}
          aria-label="Eliminar banner"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
    </div>
  )
}
