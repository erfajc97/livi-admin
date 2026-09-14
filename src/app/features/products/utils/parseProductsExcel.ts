import * as XLSX from 'xlsx'

/* ── Parser de la plantilla Excel de productos LIVI ──────────────────────
   Lógica pura extraída de ImportProductsModal para poder testearla.
   Columnas soportadas (normalizadas: sin tildes, minúsculas, _):
     nombre, precio, categoria, marca, categoria_id, marca_id, costo, stock,
     descripcion, imagen_url, activo, descuento, descripcion_detallada,
     beneficios, usos_comunes, tallas, combina_con, instagram,
     variacion_N, color_hex_N, talla_N, precio_variacion_N  (N = 1..10)   */

export const REQUIRED = ['nombre', 'precio', 'categoria_id', 'marca_id'] as const

export interface ParsedRow {
  rowNumber: number
  raw: Record<string, unknown>
  product: Record<string, unknown>
  missing: string[]
}

/** "Categoría ID" / "categoria id" / "CATEGORIA_ID" → "categoria_id" */
export const normalizeHeader = (h: unknown): string =>
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

/** IDs numéricos separados por coma/punto y coma/pipe → [3, 5] */
const toIdList = (v: unknown): number[] | undefined => {
  if (v == null || String(v).trim() === '') return undefined
  const ids = String(v)
    .split(/[,;|]/)
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n))
  return ids.length > 0 ? ids : undefined
}

/** Instagram: entradas separadas por ";" — cada una "url" o "url|imagen" */
const toInstagramPosts = (v: unknown): Array<{ url: string; image: string }> | undefined => {
  if (v == null || String(v).trim() === '') return undefined
  const posts = String(v)
    .split(/;/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [url, image] = entry.split('|').map((s) => s.trim())
      return { url, image: image ?? '' }
    })
    .filter((p) => p.url)
  return posts.length > 0 ? posts : undefined
}

const toJson = (v: unknown): string | undefined => (v == null ? undefined : JSON.stringify(v))

export interface ParsedVariant {
  name: string
  price: number
  colorHex?: string
  size?: string
}

/** Pares "variacion N" + "precio variacion N" (+ color_hex_N / talla_N opcionales)
 *  → [{ name, price, colorHex?, size? }] (pares incompletos se ignoran). */
const toVariants = (raw: Record<string, unknown>): ParsedVariant[] | undefined => {
  const out: ParsedVariant[] = []
  for (let n = 1; n <= 10; n++) {
    const nameRaw = pick(raw, `variacion_${n}`, `variante_${n}`, `variacion${n}`)
    const price = toNumber(
      pick(raw, `precio_variacion_${n}`, `precio_variante_${n}`, `precio_variacion${n}`),
    )
    const name = nameRaw != null ? String(nameRaw).trim() : ''
    if (!name || price == null) continue

    const variant: ParsedVariant = { name, price }
    const colorHex = pick(raw, `color_hex_${n}`, `hex_${n}`, `colorhex_${n}`)
    if (colorHex != null && String(colorHex).trim() !== '') variant.colorHex = String(colorHex).trim()
    const size = pick(raw, `talla_${n}`, `size_${n}`)
    if (size != null && String(size).trim() !== '') variant.size = String(size).trim()
    out.push(variant)
  }
  return out.length > 0 ? out : undefined
}

/** Primer valor no vacío entre varias cabeceras equivalentes */
const pick = (raw: Record<string, unknown>, ...keys: string[]): unknown => {
  for (const k of keys) {
    const v = raw[k]
    if (v != null && String(v).trim() !== '') return v
  }
  return undefined
}

/** Parsea filas AOA (array de arrays). La fila 0 son los encabezados. */
export function parseSheetRows(rows: unknown[][]): ParsedRow[] {
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
        categoryId: categoryIdNum,
        marcaId: marcaIdNum,
        category: categoryName,
        marca: marcaName,
        cost: toNumber(raw.costo),
        stock: toNumber(raw.stock),
        description: raw.descripcion ? String(raw.descripcion) : undefined,
        imageUrl: raw.imagen_url ? String(raw.imagen_url) : undefined,
        isActive: toBool(raw.activo),
        discount: toNumber(raw.descuento),
        detailDescription: raw.descripcion_detallada ? String(raw.descripcion_detallada) : undefined,
        benefits: toJson(toList(raw.beneficios)),
        // ── Campos editoriales de la ficha LIVI ──
        commonUses: toJson(toList(raw.usos_comunes)),
        sizes: toJson(toList(raw.tallas)),
        pairsWith: toJson(toIdList(raw.combina_con)),
        instagramPosts: toJson(toInstagramPosts(raw.instagram)),
        variants: toVariants(raw),
      }

      // Limpiar undefined para no pisar defaults del backend
      Object.keys(product).forEach((k) => product[k] === undefined && delete product[k])

      const missing = REQUIRED.filter((key) => {
        if (key === 'nombre') return !product.name
        if (key === 'categoria_id') return product.categoryId == null && !product.category
        if (key === 'marca_id') return product.marcaId == null && !product.marca
        return product.price == null
      })

      return { rowNumber: excelRow, raw, product, missing }
    })
}

/** Parsea un archivo .xlsx/.xls/.csv ya leído como ArrayBuffer. */
export function parseWorkbook(data: ArrayBuffer): ParsedRow[] {
  const wb = XLSX.read(data, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
  return parseSheetRows(rows)
}
