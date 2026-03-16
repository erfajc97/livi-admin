import { Input } from '@heroui/react'
import { Search } from 'lucide-react'

interface OrdersListHeaderProps {
  search: string
  onSearch: (value: string) => void
}

export default function OrdersListHeader({ search, onSearch }: OrdersListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
        Ordenes
      </h1>

      <Input
        placeholder="Buscar por N. orden o cliente..."
        value={search}
        onValueChange={onSearch}
        startContent={<Search size={16} className="text-text-muted" />}
        classNames={{
          base: 'max-w-xs',
          inputWrapper: 'bg-surface-raised border border-border',
          input: 'text-text placeholder:text-text-muted',
        }}
      />
    </div>
  )
}
