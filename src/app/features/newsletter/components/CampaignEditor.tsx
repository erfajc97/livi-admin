import { useState, useEffect } from 'react'
import { Button, Input, Textarea } from '@heroui/react'
import { ArrowLeftIcon, SaveIcon, SendIcon, EyeIcon } from 'lucide-react'
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from '../mutations/useNewsletterMutations'
import type { Campaign, CreateCampaignPayload } from '../types'

interface CampaignEditorProps {
  campaign: Campaign | null
  onBack: () => void
  onSend: (campaign: Campaign) => void
  onPreview: (campaignId: number) => void
}

const emptyForm: CreateCampaignPayload = {
  subject: '',
  heading: '',
  body: '',
  ctaText: '',
  ctaUrl: '',
  imageUrl: '',
}

export function CampaignEditor({
  campaign,
  onBack,
  onSend,
  onPreview,
}: CampaignEditorProps) {
  const [formData, setFormData] = useState<CreateCampaignPayload>(emptyForm)
  const isEditing = !!campaign

  const createMutation = useCreateCampaignMutation()
  const updateMutation = useUpdateCampaignMutation()
  const isSaving = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (campaign) {
      setFormData({
        subject: campaign.subject,
        heading: campaign.heading,
        body: campaign.body,
        ctaText: campaign.ctaText ?? '',
        ctaUrl: campaign.ctaUrl ?? '',
        imageUrl: campaign.imageUrl ?? '',
      })
    } else {
      setFormData(emptyForm)
    }
  }, [campaign])

  const handleChange = (key: keyof CreateCampaignPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const payload: CreateCampaignPayload = {
      subject: formData.subject,
      heading: formData.heading,
      body: formData.body,
      ...(formData.ctaText ? { ctaText: formData.ctaText } : {}),
      ...(formData.ctaUrl ? { ctaUrl: formData.ctaUrl } : {}),
      ...(formData.imageUrl ? { imageUrl: formData.imageUrl } : {}),
    }

    if (isEditing && campaign) {
      updateMutation.mutate(
        { id: campaign.id, data: payload },
        { onSuccess: () => onBack() },
      )
    } else {
      createMutation.mutate(payload, { onSuccess: () => onBack() })
    }
  }

  const isValid =
    formData.subject.trim() !== '' &&
    formData.heading.trim() !== '' &&
    formData.body.trim() !== ''

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button isIconOnly size="sm" variant="light" onPress={onBack}>
          <ArrowLeftIcon size={18} />
        </Button>
        <h2 className="font-heading text-lg font-semibold text-text">
          {isEditing ? 'Editar Campaña' : 'Nueva Campaña'}
        </h2>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
        <Input
          label="Asunto del email"
          placeholder="Ej: Nuevas fragancias de temporada"
          value={formData.subject}
          onValueChange={(v) => handleChange('subject', v)}
          isRequired
          classNames={{
            inputWrapper: 'bg-surface-raised border border-border',
            label: 'text-text-muted',
          }}
        />

        <Input
          label="Título principal"
          placeholder="Ej: Descubre lo nuevo"
          value={formData.heading}
          onValueChange={(v) => handleChange('heading', v)}
          isRequired
          classNames={{
            inputWrapper: 'bg-surface-raised border border-border',
            label: 'text-text-muted',
          }}
        />

        <Textarea
          label="Contenido"
          placeholder="Escribe el contenido del newsletter..."
          value={formData.body}
          onValueChange={(v) => handleChange('body', v)}
          minRows={6}
          isRequired
          classNames={{
            inputWrapper: 'bg-surface-raised border border-border',
            label: 'text-text-muted',
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Texto del botón (CTA)"
            placeholder="Ej: Ver catálogo"
            value={formData.ctaText}
            onValueChange={(v) => handleChange('ctaText', v)}
            classNames={{
              inputWrapper: 'bg-surface-raised border border-border',
              label: 'text-text-muted',
            }}
          />
          <Input
            label="URL del botón (CTA)"
            placeholder="https://nondecants.com/catalogo"
            value={formData.ctaUrl}
            onValueChange={(v) => handleChange('ctaUrl', v)}
            classNames={{
              inputWrapper: 'bg-surface-raised border border-border',
              label: 'text-text-muted',
            }}
          />
        </div>

        <Input
          label="URL de imagen (opcional)"
          placeholder="https://..."
          value={formData.imageUrl}
          onValueChange={(v) => handleChange('imageUrl', v)}
          classNames={{
            inputWrapper: 'bg-surface-raised border border-border',
            label: 'text-text-muted',
          }}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {isEditing && campaign && (
          <Button
            variant="flat"
            endContent={<EyeIcon size={16} />}
            onPress={() => onPreview(campaign.id)}
          >
            Preview
          </Button>
        )}
        <Button variant="flat" onPress={onBack}>
          Cancelar
        </Button>
        <Button
          color="warning"
          endContent={<SaveIcon size={16} />}
          onPress={handleSave}
          isLoading={isSaving}
          isDisabled={!isValid}
        >
          {isEditing ? 'Guardar cambios' : 'Crear campaña'}
        </Button>
        {isEditing && campaign && campaign.status === 'draft' && (
          <Button
            color="success"
            endContent={<SendIcon size={16} />}
            onPress={() => onSend(campaign)}
          >
            Enviar
          </Button>
        )}
      </div>
    </div>
  )
}
