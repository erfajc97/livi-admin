import * as XLSX from 'xlsx'
import { productsService } from '../services/productsService'
import { categoriesService } from '@/app/features/categories/services/categoriesService'
import type { Product } from '../types'

/* ── Exportar TODOS los productos a Excel (backup) ─────────────────────────
   - Trae todas las páginas, no solo la visible.
   - Incluye activos e inactivos (el endpoint filtra isActive=true por defecto,
     por eso se hacen dos pasadas).
   - Las columnas principales usan los mismos nombres de la plantilla de
     importación, así el backup también sirve para re-importar.               */

interface AdminProductRow extends Product {
  cost?: number
  salesCount?: number
}

const HEADERS = [
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
  'imagenes_urls',
  'activo',
  'descuento',
  'descripcion_detallada',
  'beneficios',
  'variantes',
  'ventas',
  'creado',
  'actualizado',
] as const

/** benefits se guarda como JSON string '["a","b"]' → "a, b" */
const parseBenefits = (b?: string) => {
  if (!b) return ''
  try {
    const arr: unknown = JSON.parse(b)
    return Array.isArray(arr) ? arr.join(', ') : b
  } catch {
    return b
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
    const imageUrls = (p.images ?? [])
      .filter((img) => img?.url)
      .sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0))
      .map((img) => img.url)
      .join(' | ')
    const variantes = (p.variations ?? [])
      .map((v) => `${v.name ?? ''}=$${Number(v.price ?? 0)}`)
      .join(' · ')

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
      imageUrls,
      siNo(p.isActive),
      p.discount ?? '',
      p.detailDescription ?? '',
      parseBenefits(p.benefits),
      variantes,
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
