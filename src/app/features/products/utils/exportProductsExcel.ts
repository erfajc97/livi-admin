import * as XLSX from 'xlsx'
import { productsService } from '../services/productsService'
import { categoriesService } from '@/app/features/categories/services/categoriesService'
import type { Product } from '../types'

/* ── Exportar TODOS los productos a Excel (backup) ─────────────────────────
   - Trae todas las páginas, no solo la visible.
   - Incluye activos e inactivos (el endpoint filtra isActive=true por defecto,
     por eso se hacen dos pasadas).
   - Usa EXACTAMENTE las columnas de la plantilla de importación (incluidas
     las de variantes color×talla y los campos editoriales), así el backup
     se puede re-importar directo desde "Importar productos".              */

interface AdminProductRow extends Product {
  cost?: number
  salesCount?: number
}

const MAX_VARIANTS = 6

const BASE_HEADERS = [
  'id',
  'nombre',
  'precio',
  'categoria',
  'marca',
  'categoria_id',
  'marca_id',
  'costo',
  'stock',
  'descripcion',
  'imagen_url',
  'activo',
  'descuento',
  'descripcion_detallada',
  'beneficios',
  'usos_comunes',
  'tallas',
  'combina_con',
  'instagram',
]

const VARIANT_HEADERS = Array.from({ length: MAX_VARIANTS }, (_, i) => [
  `variacion_${i + 1}`,
  `color_hex_${i + 1}`,
  `talla_${i + 1}`,
  `precio_variacion_${i + 1}`,
]).flat()

const AUDIT_HEADERS = ['ventas', 'creado', 'actualizado']

const HEADERS = [...BASE_HEADERS, ...VARIANT_HEADERS, ...AUDIT_HEADERS] as const

/** Campo JSON '["a","b"]' → "a, b" (si no es JSON válido, se devuelve tal cual) */
const jsonListToCsv = (raw?: string | null) => {
  if (!raw) return ''
  try {
    const arr: unknown = JSON.parse(raw)
    return Array.isArray(arr) ? arr.join(', ') : raw
  } catch {
    return raw
  }
}

/** pairsWith '[3,5]' → "3, 5" */
const jsonIdsToCsv = (raw?: string | null) => {
  if (!raw) return ''
  try {
    const arr: unknown = JSON.parse(raw)
    return Array.isArray(arr) ? arr.map(Number).filter((n) => !Number.isNaN(n)).join(', ') : raw
  } catch {
    return raw
  }
}

/** instagramPosts '[{url,image}]' → "url|image ; url2" */
const jsonInstagramToCell = (raw?: string | null) => {
  if (!raw) return ''
  try {
    const arr: unknown = JSON.parse(raw)
    if (!Array.isArray(arr)) return raw
    return arr
      .map((p: any) => (p?.image ? `${p.url}|${p.image}` : p?.url))
      .filter(Boolean)
      .join(' ; ')
  } catch {
    return raw
  }
}

const siNo = (v: boolean | undefined) => (v ? 'si' : 'no')

/** Todas las páginas × {activos, inactivos} */
async function fetchAllProducts(): Promise<AdminProductRow[]> {
  const all: AdminProductRow[] = []
  for (const isActive of [true, false]) {
    let page = 1
    let fetched = 0
    for (;;) {
      const res = await productsService.listProducts({
        page,
        limit: 100,
        isActive,
        sortBy: 'createdAt',
        sortOrder: 'ASC',
      })
      const rows = (res.data ?? []) as AdminProductRow[]
      all.push(...rows)
      fetched += rows.length
      if (rows.length === 0 || fetched >= res.total) break
      page++
    }
  }
  return all
}

/** Descarga productos-backup-YYYY-MM-DD.xlsx. Devuelve cuántos exportó. */
export async function exportAllProductsToExcel(): Promise<number> {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    categoriesService.listCategories(),
  ])

  const catName = new Map(categories.map((c) => [Number(c.id), c.name]))
  const marcaName = new Map(
    categories.flatMap((c) =>
      (c.marcas ?? []).map((m) => [Number(m.id), m.name] as const),
    ),
  )

  const rows = products.map((p) => {
    const variantCells = Array.from({ length: MAX_VARIANTS }, (_, i) => {
      const v = (p.variations ?? [])[i]
      return v ? [v.name ?? '', v.colorHex ?? '', v.size ?? '', Number(v.price ?? 0)] : ['', '', '', '']
    }).flat()

    return [
      Number(p.id),
      p.name ?? '',
      Number(p.price ?? 0),
      catName.get(Number(p.categoryId)) ?? '',
      marcaName.get(Number(p.marcaId)) ?? '',
      Number(p.categoryId),
      Number(p.marcaId),
      Number(p.cost ?? 0),
      Number(p.stock ?? 0),
      p.description ?? '',
      p.imageUrl ?? '',
      siNo(p.isActive),
      p.discount ?? '',
      p.detailDescription ?? '',
      jsonListToCsv(p.benefits),
      jsonListToCsv(p.commonUses),
      jsonListToCsv(p.sizes),
      jsonIdsToCsv(p.pairsWith),
      jsonInstagramToCell(p.instagramPosts),
      ...variantCells,
      Number(p.salesCount ?? 0),
      p.createdAt ?? '',
      p.updatedAt ?? '',
    ]
  })

  const ws = XLSX.utils.aoa_to_sheet([[...HEADERS], ...rows])
  ws['!cols'] = HEADERS.map(() => ({ wch: 20 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Productos')
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `productos-backup-${date}.xlsx`)
  return products.length
}
