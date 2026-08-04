import { useState } from 'react'
import { Button, Input, useDisclosure } from '@heroui/react'
import { Download, FileSpreadsheet, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import ImportProductsModal from './modals/ImportProductsModal'
import { exportAllProductsToExcel } from '../utils/exportProductsExcel'

interface ProductListHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  onCreate: () => void
}

export default function ProductListHeader({
  search,
  onSearchChange,
  onCreate,
}: ProductListHeaderProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const count = await exportAllProductsToExcel()
      toast.success(`Backup descargado: ${count} productos`)
    } catch {
      toast.error('No se pudo generar el backup de productos')
    } finally {
      setIsExporting(false)
    }
  }

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
      <div className="flex gap-2 self-start sm:self-auto">
        <Button
          variant="flat"
          startContent={<Download size={16} />}
          onPress={handleExport}
          isLoading={isExporting}
          className="h-10"
          title="Descarga un Excel con TODOS los productos (activos e inactivos) y todos sus campos"
        >
          Exportar Excel
        </Button>
        <Button
          variant="flat"
          startContent={<FileSpreadsheet size={16} />}
          onPress={onOpen}
          className="h-10"
        >
          Importar Excel
        </Button>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={onCreate}
          className="h-10"
        >
          Nuevo Producto
        </Button>
      </div>

      <ImportProductsModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  )
}
