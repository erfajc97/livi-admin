import { Button, Chip, Spinner } from '@heroui/react'
import { EditIcon, Trash2Icon, SendIcon, EyeIcon, PlusIcon } from 'lucide-react'
import type { Campaign } from '../types'

interface CampaignsListProps {
  campaigns: Campaign[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (campaign: Campaign) => void
  onDelete: (campaign: Campaign) => void
  onSend: (campaign: Campaign) => void
  onPreview: (campaignId: number) => void
}

const statusConfig: Record<Campaign['status'], { color: 'warning' | 'success' | 'danger'; label: string }> = {
  draft: { color: 'warning', label: 'Borrador' },
  sent: { color: 'success', label: 'Enviada' },
  failed: { color: 'danger', label: 'Fallida' },
}

export function CampaignsList({
  campaigns,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onSend,
  onPreview,
}: CampaignsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center">
        <p className="text-text-muted">No hay campañas creadas.</p>
        <Button
          color="warning"
          variant="flat"
          className="mt-4"
          onPress={onCreate}
        >
          Crear la primera
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          color="warning"
          radius="full"
          endContent={<PlusIcon size={18} />}
          onPress={onCreate}
        >
          Nueva Campaña
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => {
          const statusInfo = statusConfig[campaign.status]
          return (
            <div
              key={campaign.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-base font-semibold text-text line-clamp-2">
                  {campaign.subject}
                </h3>
                <Chip size="sm" variant="flat" color={statusInfo.color}>
                  {statusInfo.label}
                </Chip>
              </div>

              <p className="text-sm text-text-muted line-clamp-2">{campaign.heading}</p>

              <div className="mt-auto flex items-center gap-2 text-xs text-text-muted">
                {campaign.status === 'sent' && campaign.sentAt && (
                  <span>
                    Enviada:{' '}
                    {new Date(campaign.sentAt).toLocaleDateString('es-EC', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
                {campaign.recipientCount > 0 && (
                  <span>{campaign.recipientCount} destinatarios</span>
                )}
              </div>

              <div className="flex items-center gap-1 border-t border-border pt-3">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onPreview(campaign.id)}
                >
                  <EyeIcon size={16} />
                </Button>
                {campaign.status === 'draft' && (
                  <>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => onEdit(campaign)}
                    >
                      <EditIcon size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="success"
                      endContent={<SendIcon size={14} />}
                      onPress={() => onSend(campaign)}
                      className="ml-auto"
                    >
                      Enviar
                    </Button>
                  </>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => onDelete(campaign)}
                  className={campaign.status !== 'draft' ? 'ml-auto' : ''}
                >
                  <Trash2Icon size={16} />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
