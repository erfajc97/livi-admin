import { Button } from '@heroui/react'
import { SendIcon } from 'lucide-react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { Campaign } from '../../types'

interface SendCampaignModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  campaign: Campaign | null
  activeSubscribers: number
  isSending: boolean
  onConfirm: () => void
}

export function SendCampaignModal({
  isOpen,
  onOpenChange,
  campaign,
  activeSubscribers,
  isSending,
  onConfirm,
}: SendCampaignModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      headerContent="Enviar campaña"
      footerContent={
        <div className="flex gap-2">
          <Button variant="flat" onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            color="success"
            endContent={<SendIcon size={16} />}
            onPress={onConfirm}
            isLoading={isSending}
          >
            Enviar ahora
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <p className="text-text-muted">
          ¿Enviar la campaña{' '}
          <strong className="text-text">&quot;{campaign?.subject}&quot;</strong>{' '}
          a{' '}
          <strong className="text-accent">{activeSubscribers}</strong>{' '}
          suscriptores activos?
        </p>
        <p className="text-sm text-text-muted">
          Esta acción no se puede deshacer. Los emails se enviarán
          inmediatamente.
        </p>
      </div>
    </CustomModalNextUI>
  )
}
