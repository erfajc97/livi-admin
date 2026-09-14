import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axiosInstance } from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import { Download, FileSpreadsheet, Upload } from 'lucide-react'
import { parseWorkbook, type ParsedRow } from '../../utils/parseProductsExcel'

interface ImportResult {
  row: number
  name?: string
  success: boolean
  id?: number
  error?: string
}

interface ImportProductsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImportProductsModal({ isOpen, onOpenChange }: ImportProductsModalProps) {
  const queryClient = useQueryClient()
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [results, setResults] = useState<ImportResult[] | null>(null)

  const valid = rows.filter((r) => r.missing.length === 0)
  const invalid = rows.filter((r) => r.missing.length > 0)

  const reset = () => {
    setRows([])
    setFileName('')
    setResults(null)
  }

  const handleFile = async (file: File) => {
    try {
      const parsed = parseWorkbook(await file.arrayBuffer())
      if (parsed.length === 0) {
        toast.error('El archivo no tiene filas de productos (fila 1 = encabezados).')
        return
      }
      setFileName(file.name)
      setRows(parsed)
      setResults(null)
    } catch {
      toast.error('No se pudo leer el archivo. Usa la plantilla .xlsx.')
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.PRODUCTS_BULK_IMPORT, {
        products: valid.map((r) => r.product),
      })
      const payload = data?.data ?? data
      setResults(payload.results ?? [])
      if ((payload.created ?? 0) > 0) {
        toast.success(`${payload.created} producto(s) creados`)
        queryClient.invalidateQueries({ queryKey: ['products'] })
      }
      if ((payload.failed ?? 0) > 0) {
        toast.error(`${payload.failed} fila(s) con error — revisa el detalle`)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al importar los productos')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) reset()
        onOpenChange(open)
      }}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-border">
              <span className="font-heading text-xl font-bold text-text">
                Importar productos desde Excel
              </span>
              <span className="text-sm font-normal text-text-muted">
                Sube la plantilla llena — las fotos se agregan después desde cada producto.
              </span>
            </ModalHeader>

            <ModalBody className="gap-5 pb-6">
              {/* Paso 1 — plantilla */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-raised p-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={20} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-text">1 · Descarga la plantilla</p>
                    <p className="text-xs text-text-muted">
                      Incluye la hoja “IDs_y_Valores” con categorías y marcas.
                      Los IDs también se ven junto al nombre en la página de Categorías.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    as="a"
                    href="/plantilla-productos.xlsx"
                    download
                    size="sm"
                    variant="flat"
                    startContent={<Download size={15} />}
                  >
                    plantilla-productos.xlsx
                  </Button>
                  <Button
                    as="a"
                    href="/ejemplo-importacion-productos.xlsx"
                    download
                    size="sm"
                    variant="light"
                    startContent={<Download size={15} />}
                    title="2 filas de muestra ya llenas para probar la importación"
                  >
                    ejemplo lleno
                  </Button>
                </div>
              </div>

              {/* Paso 2 — subir archivo */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-raised p-4">
                <div className="flex items-center gap-3">
                  <Upload size={20} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-text">2 · Sube el archivo lleno</p>
                    <p className="text-xs text-text-muted">
                      {fileName ? `Archivo: ${fileName}` : 'Formatos: .xlsx · .xls · .csv'}
                    </p>
                  </div>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFile(f)
                      e.target.value = ''
                    }}
                  />
                  <span className="inline-flex h-8 items-center rounded-medium bg-default px-3 text-sm transition-opacity hover:opacity-80">
                    Elegir archivo
                  </span>
                </label>
              </div>

              {/* Vista previa */}
              {rows.length > 0 && results === null && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Chip size="sm" color="success" variant="flat">
                      {valid.length} listas
                    </Chip>
                    {invalid.length > 0 && (
                      <Chip size="sm" color="danger" variant="flat">
                        {invalid.length} incompletas (se omiten)
                      </Chip>
                    )}
                  </div>

                  {invalid.length > 0 && (
                    <div className="mb-3 max-h-28 overflow-y-auto rounded-lg border border-error-muted bg-error-muted/40 p-3">
                      {invalid.map((r) => (
                        <p key={r.rowNumber} className="text-xs text-error">
                          Fila {r.rowNumber}: falta {r.missing.join(', ')}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-surface-raised text-text-muted">
                        <tr>
                          <th className="px-3 py-2">Fila</th>
                          <th className="px-3 py-2">Nombre</th>
                          <th className="px-3 py-2">Precio</th>
                          <th className="px-3 py-2">Cat.</th>
                          <th className="px-3 py-2">Marca</th>
                          <th className="px-3 py-2">Stock</th>
                          <th className="px-3 py-2">Variantes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {valid.slice(0, 12).map((r) => (
                          <tr key={r.rowNumber}>
                            <td className="px-3 py-1.5 text-text-muted">{r.rowNumber}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.name)}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.price)}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.categoryId ?? r.product.category ?? '—')}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.marcaId ?? r.product.marca ?? '—')}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.stock ?? 0)}</td>
                            <td className="px-3 py-1.5 text-text">
                              {Array.isArray(r.product.variants) && r.product.variants.length > 0
                                ? (r.product.variants as Array<{ name: string }>)
                                    .map((v) => v.name)
                                    .join(' · ')
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {valid.length > 12 && (
                      <p className="px-3 py-2 text-xs text-text-muted">
                        … y {valid.length - 12} más
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Resultados */}
              {results !== null && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-surface-raised text-text-muted">
                      <tr>
                        <th className="px-3 py-2">Fila</th>
                        <th className="px-3 py-2">Producto</th>
                        <th className="px-3 py-2">Resultado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {results.map((r) => (
                        <tr key={r.row}>
                          <td className="px-3 py-1.5 text-text-muted">{r.row}</td>
                          <td className="px-3 py-1.5 text-text">{r.name ?? '—'}</td>
                          <td className="px-3 py-1.5">
                            {r.success ? (
                              <span className="text-success">Creado (ID {r.id})</span>
                            ) : (
                              <span className="text-error">{r.error}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} isDisabled={isImporting}>
                {results !== null ? 'Cerrar' : 'Cancelar'}
              </Button>
              {results === null && (
                <Button
                  color="primary"
                  onPress={handleImport}
                  isLoading={isImporting}
                  isDisabled={valid.length === 0}
                >
                  Importar {valid.length > 0 ? `${valid.length} producto(s)` : ''}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
