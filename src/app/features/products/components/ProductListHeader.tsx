import { Button, Input } from '@heroui/react'
import { Plus, Search } from 'lucide-react'

interface ProductListHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  onCreate: () => void
}

export default function ProductListHeader({ search, onSearchChange, onCreate }: ProductListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Input
        placeholder="Buscar producto..."
        value={search}
        onValueChange={onSearchChange}
        startContent={<Search size={16} className="text-text-muted" />}
        classNames={{ inputWrapper: 'bg-surface border-border' }}
        className="max-w-xs"
      />
      <Button color="primary" startContent={<Plus size={16} />} onPress={onCreate}>
        Nuevo Producto
      </Button>
    </div>
  )
}
