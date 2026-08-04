import * as XLSX from 'xlsx'
import { productsService } from '../services/productsService'
import { categoriesService } from '@/app/features/categories/services/categoriesService'
import type { Product, ScentSection } from '../types'

/* ── Exportar TODOS los productos a Excel (backup) ─────────────────────────
   - Trae todas las páginas, no solo la visible.
   - Incluye activos e inactivos (el endpoint filtra isActive=true por defecto,
     por eso se hacen dos pasadas).
   - Las columnas principales usan los mismos nombres de la plantilla de
     importación, así el backup también sirve para re-importar.               */

interface AdminProductRow extends Product {
  cost?: number
  salesCount?: number
  formats?: {
    id: number
    ml: number
    price: number
    isFullBottle: boolean
    imageUrl?: string
  }[]
}

const HEADERS = [
  'id',
  'nombre',
  'precio',
  'total_ml',
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
  'bajo_pedido',
  'descuento',
  'genero',
  'hora_del_dia',
  'concentracion',
  'proyeccion',
  'descripcion_detallada',
  'beneficios',
  'caracter',
  'ocasion',
  'longevidad',
  'score_proyeccion',
  'titulo_perfil',
  'notas_salida',
  'descripcion_notas_salida',
  'notas_corazon',
  'descripcion_notas_corazon',
  'notas_fondo',
  'descripcion_notas_fondo',
  'firma',
  'descripcion_firma',
  'imagen_firma_url',
  'formatos',
  'ventas',
  'ml_botella_abierta',
  'creado',
  'actualizado',
] as const

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const findSection = (sections: ScentSection[] | undefined, key: string) =>
  sections?.find((s) => norm(s.title ?? '').includes(key))

const joinNotes = (s?: ScentSection) =>
  s?.notes
    ?.map((n) => n.name)
    .filter(Boolean)
    .join(' • ') ?? ''

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
    const salida = findSection(p.scentSections, 'salida')
    const corazon = findSection(p.scentSections, 'coraz')
    const fondo = findSection(p.scentSections, 'fondo')
    const imageUrls = (p.images ?? [])
      .filter((img) => img?.url)
      .sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0))
      .map((img) => img.url)
      .join(' | ')
    const formatos = (p.formats ?? [])
      .map(
        (f) => `${f.ml}ml=$${f.price}${f.isFullBottle ? ' (botella)' : ''}`,
      )
      .join(' · ')

    return [
      Number(p.id),
      p.name ?? '',
      Number(p.price ?? 0),
      Number(p.totalMl ?? 0),
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
      siNo(p.bajoPedido),
      p.discount ?? '',
      p.gender ?? '',
      p.timeOfDay ?? '',
      p.concentration ?? '',
      p.projection ?? '',
      p.detailDescription ?? '',
      parseBenefits(p.benefits),
      (p.mood ?? []).join(', '),
      (p.occasion ?? []).join(', '),
      p.longevity ?? '',
      p.projectionScore ?? '',
      p.scentProfileTitle ?? '',
      joinNotes(salida),
      salida?.description ?? '',
      joinNotes(corazon),
      corazon?.description ?? '',
      joinNotes(fondo),
      fondo?.description ?? '',
      p.signatureTitle ?? '',
      p.signatureDescription ?? '',
      p.signatureImageUrl ?? '',
      formatos,
      Number(p.salesCount ?? 0),
      Number(p.openBottleMlRemaining ?? 0),
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
