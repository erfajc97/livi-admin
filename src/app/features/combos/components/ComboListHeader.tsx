import { Button, Input } from '@heroui/react'
import { Plus, Search } from 'lucide-react'

interface ComboListHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  onCreate: () => void
}

export default function ComboListHeader({
  search,
  onSearchChange,
  onCreate,
}: ComboListHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Input
        placeholder="Buscar combos..."
        value={search}
        onValueChange={onSearchChange}
        startContent={<Search size={18} className="text-text-muted" />}
        classNames={{
          label: '!text-text',
          input: '!text-text',
          inputWrapper: 'bg-surface border-border',
        }}
        className="max-w-sm"
      />
      <Button
        color="warning"
        startContent={<Plus size={18} />}
        onPress={onCreate}
      >
        Nuevo Combo
      </Button>
    </div>
  )
}
