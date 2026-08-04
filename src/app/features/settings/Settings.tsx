import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Input } from '@heroui/react'
import {
  Save,
  RotateCcw,
  Settings as SettingsIcon,
  Plus,
  Trash2,
} from 'lucide-react'
import { settingsService } from './services/settingsService'
import { useUpdateSettingMutation } from './mutations/useSettingsMutations'

const DELIVERY_KEY = 'delivery_days_offset'
const ANNOUNCEMENT_KEY = 'announcement_bar'
const ANNOUNCEMENT_DEFAULT = 'Envíos a todo el Ecuador · Servientrega 24–72h'
const ANNOUNCEMENT_DESCRIPTION = 'Textos de la barra superior (JSON array)'

/**
 * El setting guarda un JSON array de textos. Se acepta el formato antiguo
 * (un solo string) para no romper lo ya guardado en producción.
 */
const parseAnnouncements = (raw: string): string[] => {
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      const list = parsed.filter(
        (t): t is string => typeof t === 'string' && t.trim() !== '',
      )
      return list.length > 0 ? list : [ANNOUNCEMENT_DEFAULT]
    }
  } catch {
    /* valor plano (formato antiguo) */
  }
  return raw.trim() ? [raw] : [ANNOUNCEMENT_DEFAULT]
}

export const Settings = () => {
  const [offset, setOffset] = useState('0')
  const [announcements, setAnnouncements] = useState<string[]>([
    ANNOUNCEMENT_DEFAULT,
  ])

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getAll,
  })

  const updateMutation = useUpdateSettingMutation()

  useEffect(() => {
    if (settings) {
      const deliverySetting = settings.find((s) => s.key === DELIVERY_KEY)
      if (deliverySetting) {
        setOffset(deliverySetting.value)
      }
      const announcementSetting = settings.find(
        (s) => s.key === ANNOUNCEMENT_KEY,
      )
      if (announcementSetting) {
        setAnnouncements(parseAnnouncements(announcementSetting.value))
      }
    }
  }, [settings])

  const handleSave = () => {
    updateMutation.mutate({
      key: DELIVERY_KEY,
      value: offset,
      description: 'Días adicionales para la entrega',
    })
  }

  const handleRestore = () => {
    setOffset('0')
    updateMutation.mutate({
      key: DELIVERY_KEY,
      value: '0',
      description: 'Días adicionales para la entrega',
    })
  }

  const updateAnnouncement = (index: number, value: string) =>
    setAnnouncements((prev) => prev.map((t, i) => (i === index ? value : t)))

  const addAnnouncement = () => setAnnouncements((prev) => [...prev, ''])

  const removeAnnouncement = (index: number) =>
    setAnnouncements((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    )

  const handleSaveAnnouncement = () => {
    const clean = announcements.map((t) => t.trim()).filter(Boolean)
    updateMutation.mutate({
      key: ANNOUNCEMENT_KEY,
      value: JSON.stringify(clean.length > 0 ? clean : [ANNOUNCEMENT_DEFAULT]),
      description: ANNOUNCEMENT_DESCRIPTION,
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <SettingsIcon size={28} className="text-accent" />
        <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
          Ajustes
        </h1>
      </div>

      <div className="bg-content1 rounded-xl p-6 shadow-sm max-w-xl">
        <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-text mb-1">
          Días de entrega
        </h2>
        <p className="text-sm text-default-500 mb-5">
          Días adicionales para la entrega. Si pones 2, los clientes verán 4
          días de entrega en vez de 2.
        </p>

        <Input
          type="number"
          label="Días adicionales"
          placeholder="0"
          min={0}
          value={offset}
          onValueChange={setOffset}
          isDisabled={isLoading}
          className="max-w-xs mb-5"
        />

        <div className="flex gap-3">
          <Button
            color="primary"
            startContent={<Save size={16} />}
            onPress={handleSave}
            isLoading={updateMutation.isPending}
          >
            Guardar
          </Button>
          <Button
            variant="flat"
            startContent={<RotateCcw size={16} />}
            onPress={handleRestore}
            isLoading={updateMutation.isPending}
          >
            Restaurar defecto
          </Button>
        </div>
      </div>

      <div className="bg-content1 rounded-xl p-6 shadow-sm max-w-xl">
        <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-text mb-1">
          Barra superior (promociones)
        </h2>
        <p className="text-sm text-default-500 mb-5">
          Textos que rotan en la barra superior del sitio. Agrega los que
          quieras: el visitante los cambia con las flechas de los extremos.
        </p>

        <div className="mb-4 flex flex-col gap-3">
          {announcements.map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                type="text"
                label={`Promoción ${i + 1}`}
                placeholder={ANNOUNCEMENT_DEFAULT}
                value={text}
                onValueChange={(v) => updateAnnouncement(i, v)}
                isDisabled={isLoading}
              />
              <Button
                isIconOnly
                variant="light"
                color="danger"
                isDisabled={announcements.length === 1}
                onPress={() => removeAnnouncement(i)}
                aria-label="Quitar promoción"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        <Button
          size="sm"
          variant="flat"
          color="primary"
          startContent={<Plus size={16} />}
          onPress={addAnnouncement}
          className="mb-5"
        >
          Agregar texto
        </Button>

        <div className="flex gap-3">
          <Button
            color="primary"
            startContent={<Save size={16} />}
            onPress={handleSaveAnnouncement}
            isLoading={updateMutation.isPending}
          >
            Guardar
          </Button>
          <Button
            variant="flat"
            startContent={<RotateCcw size={16} />}
            onPress={() => {
              setAnnouncements([ANNOUNCEMENT_DEFAULT])
              updateMutation.mutate({
                key: ANNOUNCEMENT_KEY,
                value: JSON.stringify([ANNOUNCEMENT_DEFAULT]),
                description: ANNOUNCEMENT_DESCRIPTION,
              })
            }}
            isLoading={updateMutation.isPending}
          >
            Restaurar defecto
          </Button>
        </div>
      </div>
    </div>
  )
}
