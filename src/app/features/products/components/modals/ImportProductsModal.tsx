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
import * as XLSX from 'xlsx'
import { axiosInstance } from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import { Download, FileSpreadsheet, Upload } from 'lucide-react'

/* ── Columnas de la plantilla → campos del DTO ─────────────────────────── */
const REQUIRED = ['nombre', 'precio', 'total_ml', 'categoria_id', 'marca_id'] as const

const CONCENTRATION_ALIASES: Record<string, string> = {
  EDP: 'EAU_DE_PARFUM',
  EDT: 'EAU_DE_TOILETTE',
  EDT_INTENSE: 'EAU_DE_TOILETTE_INTENSE',
  INTENSE: 'EAU_DE_TOILETTE_INTENSE',
  EDC: 'EAU_DE_COLOGNE',
  ELIXIR: 'ELIXIR',
  PARFUM: 'PARFUM',
  EXTRAIT: 'EXTRAIT_DE_PARFUM',
  EAU_DE_PARFUM: 'EAU_DE_PARFUM',
  EAU_DE_TOILETTE: 'EAU_DE_TOILETTE',
  EAU_DE_TOILETTE_INTENSE: 'EAU_DE_TOILETTE_INTENSE',
  EAU_DE_COLOGNE: 'EAU_DE_COLOGNE',
  BODY_MIST: 'BODY_MIST',
  EXTRAIT_DE_PARFUM: 'EXTRAIT_DE_PARFUM',
  // Compatibilidad con plantillas anteriores
  ELIXIR_DE_PARFUM: 'ELIXIR',
  PARFUM_EXTRAIT: 'EXTRAIT_DE_PARFUM',
}
const GENDERS = ['HOMBRE', 'MUJER', 'UNISEX']
const TIMES = ['DIA', 'NOCHE']
const PROJECTIONS = ['DISCRETA', 'MODERADA', 'ALTA']

/** "Categoría ID" / "categoria id" / "CATEGORIA_ID" → "categoria_id" */
const normalizeHeader = (h: unknown): string =>
  String(h ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

const toNumber = (v: unknown): number | undefined => {
  if (v == null || v === '') return undefined
  const n = Number(String(v).replace(',', '.'))
  return Number.isNaN(n) ? undefined : n
}

const toBool = (v: unknown): boolean | undefined => {
  if (v == null || v === '') return undefined
  const s = String(v).trim().toLowerCase()
  if (['si', 'sí', 'true', '1', 'yes', 'x'].includes(s)) return true
  if (['no', 'false', '0'].includes(s)) return false
  return undefined
}

const toList = (v: unknown): string[] | undefined => {
  if (v == null || String(v).trim() === '') return undefined
  return String(v)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

const toEnum = (v: unknown, allowed: string[]): string | undefined => {
  if (v == null) return undefined
  const s = String(v).trim().toUpperCase().replace(/\s+/g, '_')
  return allowed.includes(s) ? s : undefined
}

/** Primer valor no vacío entre varias cabeceras equivalentes */
const pick = (raw: Record<string, unknown>, ...keys: string[]): unknown => {
  for (const k of keys) {
    const v = raw[k]
    if (v != null && String(v).trim() !== '') return v
  }
  return undefined
}

// Colores asignados en ciclo a las notas importadas (mismo preset del formulario)
const NOTE_COLORS = ['#E8D8C0', '#C9A87A', '#8A6B4A', '#6F5238', '#4A3B2C']

/** "Bergamota • Pimienta, Lavanda; Vainilla" → [{name,color},…] */
const toNotes = (v: unknown): Array<{ name: string; color: string }> | undefined => {
  if (v == null || String(v).trim() === '') return undefined
  const names = String(v)
    .split(/[•,;|]/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (names.length === 0) return undefined
  return names.map((name, i) => ({ name, color: NOTE_COLORS[i % NOTE_COLORS.length] }))
}

interface ScentSectionDraft {
  title: string
  notes?: Array<{ name: string; color: string }>
  description?: string
}

/** Arma las 3 secciones del perfil olfativo si alguna trae notas o descripción */
const buildScentSections = (
  raw: Record<string, unknown>,
): ScentSectionDraft[] | undefined => {
  const defs = [
    {
      title: 'Notas de salida',
      notes: pick(raw, 'notas_salida', 'notas_de_salida'),
      desc: pick(raw, 'descripcion_notas_salida', 'descripcion_de_notas_de_salida'),
    },
    {
      title: 'Notas de corazón',
      notes: pick(raw, 'notas_corazon', 'notas_de_corazon'),
      desc: pick(raw, 'descripcion_notas_corazon', 'descripcion_de_notas_de_corazon'),
    },
    {
      title: 'Notas de fondo',
      notes: pick(raw, 'notas_fondo', 'notas_de_fondo'),
      desc: pick(raw, 'descripcion_notas_fondo', 'descripcion_de_notas_de_fondo'),
    },
  ]
  const sections = defs
    .map((d) => ({
      title: d.title,
      notes: toNotes(d.notes) ?? [],
      description: d.desc != null ? String(d.desc).trim() : '',
    }))
    .filter((s) => s.notes.length > 0 || s.description !== '')
  return sections.length > 0 ? sections : undefined
}

interface ParsedRow {
  rowNumber: number
  raw: Record<string, unknown>
  product: Record<string, unknown>
  missing: string[]
}

type ImportPresentationType = 'decant' | 'sellada'

/** "Sellada", "frasco", "original"… → 'sellada'; el resto → 'decant' */
const PRESENTATION_ALIASES: Record<string, ImportPresentationType> = {
  decant: 'decant',
  decants: 'decant',
  fraccionado: 'decant',
  fraccion: 'decant',
  sellada: 'sellada',
  sellado: 'sellada',
  original: 'sellada',
  frasco: 'sellada',
  botella: 'sellada',
}

/** Pares "variacion N" + "precio variacion N" → [{ mlSize, price, presentationType }] (pares incompletos se ignoran).
 *  El tipo se toma de "tipo variacion N" si viene; si no, se deduce de los ml. */
const toVariants = (
  raw: Record<string, unknown>,
): Array<{ mlSize: number; price: number; presentationType: ImportPresentationType }> | undefined => {
  const totalMl = toNumber(raw.total_ml)
  const out: Array<{
    mlSize: number
    price: number
    presentationType: ImportPresentationType
  }> = []
  for (let n = 1; n <= 10; n++) {
    const ml = toNumber(pick(raw, `variacion_${n}`, `variante_${n}`, `variacion${n}`))
    const price = toNumber(
      pick(raw, `precio_variacion_${n}`, `precio_variante_${n}`, `precio_variacion${n}`),
    )
    if (ml == null || price == null) continue

    const declared = pick(raw, `tipo_variacion_${n}`, `tipo_variante_${n}`, `tipo_variacion${n}`)
    const presentationType =
      (declared != null
        ? PRESENTATION_ALIASES[String(declared).trim().toLowerCase()]
        : undefined) ??
      // Un decant se sirve de la botella abierta, así que no puede medir la
      // botella entera o más: eso es una presentación sellada. Importarlas como
      // decant las dejaba "Sin stock" en la ficha aunque el producto tuviera
      // frascos, porque el decant se topa por los ml disponibles.
      (totalMl != null && ml >= totalMl ? 'sellada' : 'decant')

    out.push({ mlSize: ml, price, presentationType })
  }
  return out.length > 0 ? out : undefined
}

interface ImportResult {
  row: number
  name?: string
  success: boolean
  id?: number
  error?: string
}

function parseWorkbook(data: ArrayBuffer): ParsedRow[] {
  const wb = XLSX.read(data, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
  if (rows.length < 2) return []

  const headers = rows[0].map(normalizeHeader)

  return rows
    .slice(1)
    .map((cells, i) => ({ cells, excelRow: i + 2 }))
    .filter(({ cells }) => cells.some((c) => String(c).trim() !== ''))
    .map(({ cells, excelRow }) => {
      const raw: Record<string, unknown> = {}
      headers.forEach((h, idx) => {
        if (h) raw[h] = cells[idx]
      })

      const categoryIdNum = toNumber(raw.categoria_id)
      const marcaIdNum = toNumber(raw.marca_id)
      // Si la celda de ID trae texto (o se usan las columnas categoria/marca),
      // el backend resuelve por nombre — los IDs cambian entre entornos.
      const categoryName =
        raw.categoria != null && String(raw.categoria).trim() !== ''
          ? String(raw.categoria).trim()
          : raw.categoria_id != null && String(raw.categoria_id).trim() !== '' && categoryIdNum == null
            ? String(raw.categoria_id).trim()
            : undefined
      const marcaName =
        raw.marca != null && String(raw.marca).trim() !== ''
          ? String(raw.marca).trim()
          : raw.marca_id != null && String(raw.marca_id).trim() !== '' && marcaIdNum == null
            ? String(raw.marca_id).trim()
            : undefined

      const product: Record<string, unknown> = {
        name: String(raw.nombre ?? '').trim(),
        price: toNumber(raw.precio),
        totalMl: toNumber(raw.total_ml),
        categoryId: categoryIdNum,
        marcaId: marcaIdNum,
        category: categoryName,
        marca: marcaName,
        cost: toNumber(raw.costo),
        stock: toNumber(raw.stock),
        description: raw.descripcion ? String(raw.descripcion) : undefined,
        imageUrl: raw.imagen_url ? String(raw.imagen_url) : undefined,
        isActive: toBool(raw.activo),
        bajoPedido: toBool(raw.bajo_pedido),
        discount: toNumber(raw.descuento),
        gender: toEnum(raw.genero, GENDERS),
        timeOfDay: toEnum(raw.hora_del_dia, TIMES),
        concentration: raw.concentracion
          ? CONCENTRATION_ALIASES[
              String(raw.concentracion).trim().toUpperCase().replace(/\s+/g, '_')
            ]
          : undefined,
        projection: toEnum(raw.proyeccion, PROJECTIONS),
        detailDescription: raw.descripcion_detallada ? String(raw.descripcion_detallada) : undefined,
        benefits: (() => {
          const list = toList(raw.beneficios)
          return list ? JSON.stringify(list) : undefined
        })(),
        mood: toList(raw.caracter),
        occasion: toList(raw.ocasion),
        longevity: toNumber(raw.longevidad),
        projectionScore: toNumber(raw.score_proyeccion),
        scentProfileTitle: raw.titulo_perfil ? String(raw.titulo_perfil).trim() : undefined,
        scentSections: buildScentSections(raw),
        signatureTitle: pick(raw, 'firma', 'la_firma', 'titulo_firma')
          ? String(pick(raw, 'firma', 'la_firma', 'titulo_firma')).trim()
          : undefined,
        signatureDescription: pick(raw, 'descripcion_firma', 'descripcion_de_la_firma')
          ? String(pick(raw, 'descripcion_firma', 'descripcion_de_la_firma')).trim()
          : undefined,
        variants: toVariants(raw),
      }

      // Limpiar undefined para no pisar defaults del backend
      Object.keys(product).forEach((k) => product[k] === undefined && delete product[k])

      const missing = REQUIRED.filter((key) => {
        if (key === 'nombre') return !product.name
        if (key === 'categoria_id') return product.categoryId == null && !product.category
        if (key === 'marca_id') return product.marcaId == null && !product.marca
        const dtoKey =
          key === 'precio' ? 'price'
          : 'totalMl'
        return product[dtoKey] == null
      })

      return { rowNumber: excelRow, raw, product, missing }
    })
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
                      Incluye la hoja “IDs_y_Valores” con categorías, marcas y valores válidos.
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
                    title="3 filas de muestra ya llenas para probar la importación"
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
                          <th className="px-3 py-2">ml</th>
                          <th className="px-3 py-2">Cat.</th>
                          <th className="px-3 py-2">Marca</th>
                          <th className="px-3 py-2">Stock</th>
                          <th className="px-3 py-2">Decants</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {valid.slice(0, 12).map((r) => (
                          <tr key={r.rowNumber}>
                            <td className="px-3 py-1.5 text-text-muted">{r.rowNumber}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.name)}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.price)}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.totalMl)}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.categoryId ?? r.product.category ?? '—')}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.marcaId ?? r.product.marca ?? '—')}</td>
                            <td className="px-3 py-1.5 text-text">{String(r.product.stock ?? 0)}</td>
                            <td className="px-3 py-1.5 text-text">
                              {Array.isArray(r.product.variants) && r.product.variants.length > 0
                                ? (r.product.variants as Array<{ mlSize: number }>)
                                    .map((v) => `${v.mlSize}ml`)
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
