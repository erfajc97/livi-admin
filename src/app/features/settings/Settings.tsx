import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Input } from '@heroui/react'
import { Save, RotateCcw, Settings as SettingsIcon } from 'lucide-react'
import { settingsService } from './services/settingsService'
import { useUpdateSettingMutation } from './mutations/useSettingsMutations'

const DELIVERY_KEY = 'delivery_days_offset'

export const Settings = () => {
  const [offset, setOffset] = useState('0')

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

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <SettingsIcon size={28} className="text-accent" />
        <h1 className="text-2xl font-bold">Ajustes</h1>
      </div>

      <div className="bg-content1 rounded-xl p-6 shadow-sm max-w-xl">
        <h2 className="text-lg font-semibold mb-1">Días de entrega</h2>
        <p className="text-sm text-default-500 mb-5">
          Días adicionales para la entrega. Si pones 2, los clientes verán 4 días de entrega en vez
          de 2.
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
    </div>
  )
}
