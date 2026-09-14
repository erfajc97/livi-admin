import { Button } from '@heroui/react'
import { Image as ImageIcon, PencilIcon } from 'lucide-react'
import type { Banner, BannerType } from '../types'

interface SlotDef {
  type: Extract<BannerType, 'catalog_perfumes'>
  title: string
  hint: string
  banner: Banner | null
}

interface CatalogPageBannerSlotsProps {
  tienda: Banner | null
  onEdit: (banner: Banner) => void
  onCreate: (type: Extract<BannerType, 'catalog_perfumes'>) => void
}

export default function CatalogPageBannerSlots({
  tienda,
  onEdit,
  onCreate,
}: CatalogPageBannerSlotsProps) {
  const slots: SlotDef[] = [
    {
      type: 'catalog_perfumes',
      title: 'Tienda',
      hint: 'Página /tienda — escritorio y móvil.',
      banner: tienda,
    },
  ]

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-text">
          Banners de catálogo
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Imagen de portada de la página Tienda. Mismo criterio que el banner
          principal: arte de escritorio y, si quieres, uno vertical para el
          teléfono.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {slots.map((slot) => (
          <div
            key={slot.type}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row"
          >
            <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-raised sm:h-24 sm:w-32">
              {slot.banner?.imageUrl ? (
                <img
                  src={slot.banner.imageUrl}
                  alt={slot.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon size={28} className="text-text-muted" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-text">{slot.title}</h3>
                <p className="mt-0.5 text-xs text-text-muted">{slot.hint}</p>
                {slot.banner?.mobileImageUrl && (
                  <p className="mt-1 text-xs text-accent">Incluye arte móvil</p>
                )}
              </div>
              <div>
                {slot.banner ? (
                  <Button
                    size="sm"
                    variant="flat"
                    color="warning"
                    startContent={<PencilIcon size={14} />}
                    onPress={() => {
                      if (slot.banner) onEdit(slot.banner)
                    }}
                  >
                    Reemplazar imágenes
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    color="warning"
                    onPress={() => onCreate(slot.type)}
                  >
                    Subir imágenes
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
