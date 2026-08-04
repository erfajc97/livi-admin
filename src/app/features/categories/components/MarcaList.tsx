import { Button, Chip, Spinner } from '@heroui/react'
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react'
import type { Marca } from '../types'

interface MarcaListProps {
  marcas: Marca[]
  isLoading: boolean
  onAdd: () => void
  onEdit: (marca: Marca) => void
  onDelete: (marca: Marca) => void
}

export default function MarcaList({
  marcas,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: MarcaListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" color="warning" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted">Marcas</span>
        <Button
          size="sm"
          color="warning"
          variant="flat"
          endContent={<PlusIcon size={14} />}
          onPress={onAdd}
        >
          Agregar
        </Button>
      </div>

      {marcas.length === 0 ? (
        <p className="py-2 text-center text-xs text-text-muted">
          No hay marcas creadas.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {marcas.map((marca) => (
            <div
              key={marca.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-bg px-3 py-2"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="truncate text-sm text-text">{marca.name}</span>
                <Chip
                  size="sm"
                  variant="bordered"
                  color="default"
                  className="h-5 font-mono text-[10px]"
                  title="Usa este ID en la columna marca_id del Excel de importación"
                >
                  ID: {marca.id}
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  color={marca.isActive ? 'success' : 'default'}
                  className="h-5 text-[10px]"
                >
                  {marca.isActive ? 'Activa' : 'Inactiva'}
                </Chip>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onEdit(marca)}
                  aria-label="Editar marca"
                >
                  <PencilIcon size={14} className="text-text-muted" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => onDelete(marca)}
                  aria-label="Eliminar marca"
                >
                  <TrashIcon size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
