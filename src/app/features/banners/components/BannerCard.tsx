import { Button, Chip } from '@heroui/react'
import { PencilIcon, TrashIcon, Image } from 'lucide-react'
import type { Banner } from '../types'

interface BannerCardProps {
  banner: Banner
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
}

export default function BannerCard({ banner, onEdit, onDelete }: BannerCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30">
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
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-text">{banner.title}</h3>
            <Chip
              size="sm"
              variant="flat"
              color={banner.isVisible ? 'success' : 'default'}
            >
              {banner.isVisible ? 'Activo' : 'Inactivo'}
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
