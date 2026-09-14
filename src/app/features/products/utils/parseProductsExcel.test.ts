import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as XLSX from 'xlsx'
import { parseSheetRows, parseWorkbook } from './parseProductsExcel'

/* ── TDD: formato de la plantilla Excel LIVI ─────────────────────────────
   Columnas base + variantes color×talla (variacion_N, color_hex_N, talla_N,
   precio_variacion_N) + campos editoriales (usos_comunes, tallas,
   combina_con, instagram).                                              */

const BASE_HEADERS = [
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
  'variacion_1',
  'color_hex_1',
  'talla_1',
  'precio_variacion_1',
  'variacion_2',
  'color_hex_2',
  'talla_2',
  'precio_variacion_2',
]

const BASE_ROW = [
  'Noé Leather Backpack', // nombre
  129, // precio
  'Mochilas', // categoria
  'LIVI', // marca
  2, // categoria_id
  2, // marca_id
  70, // costo
  10, // stock
  'Mochila pañalera premium', // descripcion
  '', // imagen_url
  'si', // activo
  '', // descuento
  'Cuero vacuno genuino', // descripcion_detallada
  'Cuero genuino, Hecho a mano', // beneficios
  'Pañalera, Bolso de trabajo', // usos_comunes
  'Mini, Midi, Full', // tallas
  '3, 5', // combina_con
  'https://instagram.com/p/AAA|https://img/1.jpg ; https://instagram.com/p/BBB', // instagram
  'Negro', // variacion_1
  '#12100E', // color_hex_1
  'Midi', // talla_1
  129, // precio_variacion_1
  'Espresso', // variacion_2
  '#5C3A21', // color_hex_2
  'Full', // talla_2
  139, // precio_variacion_2
]

const buildSheet = (rows: unknown[][]): unknown[][] => [BASE_HEADERS, ...rows]

describe('parseSheetRows — columnas base', () => {
  it('parsea una fila completa a CreateProductDto', () => {
    const [r] = parseSheetRows(buildSheet([BASE_ROW]))
    expect(r.missing).toEqual([])
    expect(r.product.name).toBe('Noé Leather Backpack')
    expect(r.product.price).toBe(129)
    expect(r.product.categoryId).toBe(2)
    expect(r.product.marcaId).toBe(2)
    expect(r.product.cost).toBe(70)
    expect(r.product.stock).toBe(10)
    expect(r.product.isActive).toBe(true)
    expect(r.product.detailDescription).toBe('Cuero vacuno genuino')
  })

  it('marca como incompleta una fila sin nombre/precio/categoría/marca', () => {
    const row = Array(BASE_HEADERS.length).fill('')
    row[6] = 5 // solo costo — para que la fila no se ignore por vacía
    const [r] = parseSheetRows(buildSheet([row]))
    expect(r.missing).toContain('nombre')
    expect(r.missing).toContain('precio')
    expect(r.missing).toContain('categoria_id')
    expect(r.missing).toContain('marca_id')
  })

  it('acepta categoría/marca por nombre cuando no hay ID numérico', () => {
    const row = [...BASE_ROW]
    row[4] = '' // categoria_id
    row[5] = '' // marca_id
    const [r] = parseSheetRows(buildSheet([row]))
    expect(r.missing).toEqual([])
    expect(r.product.category).toBe('Mochilas')
    expect(r.product.marca).toBe('LIVI')
  })
})

describe('parseSheetRows — variantes color × talla', () => {
  it('parsea variantes con colorHex y talla', () => {
    const [r] = parseSheetRows(buildSheet([BASE_ROW]))
    expect(r.product.variants).toEqual([
      { name: 'Negro', colorHex: '#12100E', size: 'Midi', price: 129 },
      { name: 'Espresso', colorHex: '#5C3A21', size: 'Full', price: 139 },
    ])
  })

  it('omite variantes sin nombre o sin precio', () => {
    const row = [...BASE_ROW]
    row[22] = '' // variacion_2 sin nombre → se omite
    const [r] = parseSheetRows(buildSheet([row]))
    expect(r.product.variants).toEqual([
      { name: 'Negro', colorHex: '#12100E', size: 'Midi', price: 129 },
    ])
  })

  it('permite variante sin colorHex ni talla (son opcionales)', () => {
    const row = [...BASE_ROW]
    row[19] = '' // color_hex_1
    row[20] = '' // talla_1
    const [r] = parseSheetRows(buildSheet([row]))
    expect(r.product.variants).toEqual([
      { name: 'Negro', price: 129 },
      { name: 'Espresso', colorHex: '#5C3A21', size: 'Full', price: 139 },
    ])
  })
})

describe('parseSheetRows — campos editoriales', () => {
  it('serializa usos_comunes como JSON array (commonUses)', () => {
    const [r] = parseSheetRows(buildSheet([BASE_ROW]))
    expect(JSON.parse(String(r.product.commonUses))).toEqual(['Pañalera', 'Bolso de trabajo'])
  })

  it('serializa tallas como JSON array (sizes)', () => {
    const [r] = parseSheetRows(buildSheet([BASE_ROW]))
    expect(JSON.parse(String(r.product.sizes))).toEqual(['Mini', 'Midi', 'Full'])
  })

  it('serializa combina_con como JSON array de números (pairsWith)', () => {
    const [r] = parseSheetRows(buildSheet([BASE_ROW]))
    expect(JSON.parse(String(r.product.pairsWith))).toEqual([3, 5])
  })

  it('serializa instagram como JSON array de { url, image }', () => {
    const [r] = parseSheetRows(buildSheet([BASE_ROW]))
    expect(JSON.parse(String(r.product.instagramPosts))).toEqual([
      { url: 'https://instagram.com/p/AAA', image: 'https://img/1.jpg' },
      { url: 'https://instagram.com/p/BBB', image: '' },
    ])
  })

  it('omite los campos editoriales vacíos para no pisar defaults', () => {
    const row: unknown[] = BASE_ROW.map(() => '')
    row[0] = 'X'
    row[1] = 10
    const [r] = parseSheetRows(buildSheet([row]))
    expect(r.product.commonUses).toBeUndefined()
    expect(r.product.sizes).toBeUndefined()
    expect(r.product.pairsWith).toBeUndefined()
    expect(r.product.instagramPosts).toBeUndefined()
  })
})

describe('parseSheetRows — compatibilidad plantilla vieja', () => {
  it('sigue leyendo variacion_N + precio_variacion_N sin columnas de color/talla', () => {
    const headers = ['nombre', 'precio', 'categoria_id', 'marca_id', 'variacion_1', 'precio_variacion_1']
    const rows = [headers, ['Bolso', 50, 1, 1, 'Beige', 55]]
    const [r] = parseSheetRows(rows)
    expect(r.product.variants).toEqual([{ name: 'Beige', price: 55 }])
  })

  it('ignora filas completamente vacías', () => {
    const rows = buildSheet([BASE_ROW, Array(BASE_HEADERS.length).fill('')])
    expect(parseSheetRows(rows)).toHaveLength(1)
  })
})

/* ── Round-trip con el archivo real que descarga el usuario ──────────────
   Si alguien regenera la plantilla con columnas incompatibles, este test
   falla antes de que el admin la suba.                                    */
describe('plantilla real (public/) — round-trip', () => {
  const ejemploPath = join(process.cwd(), 'public', 'ejemplo-importacion-productos.xlsx')
  const plantillaPath = join(process.cwd(), 'public', 'plantilla-productos.xlsx')

  it('el ejemplo lleno parsea 2 productos completos con variantes color×talla', () => {
    const buf = readFileSync(ejemploPath)
    const rows = parseWorkbook(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
    expect(rows).toHaveLength(2)
    for (const r of rows) expect(r.missing).toEqual([])

    const [noe, olivia] = rows
    expect(noe.product.name).toBe('Noé Leather Backpack')
    expect(noe.product.variants).toEqual([
      { name: 'Negro', colorHex: '#12100E', size: 'Midi', price: 129 },
      { name: 'Espresso', colorHex: '#5C3A21', size: 'Midi', price: 129 },
      { name: 'Negro', colorHex: '#12100E', size: 'Full', price: 139 },
    ])
    expect(JSON.parse(String(noe.product.sizes))).toEqual(['Mini', 'Midi', 'Full'])
    expect(JSON.parse(String(noe.product.commonUses))).toContain('Pañalera')
    expect(JSON.parse(String(noe.product.instagramPosts))).toHaveLength(2)

    expect(olivia.product.variants).toHaveLength(3)
    expect(JSON.parse(String(olivia.product.instagramPosts))).toEqual([
      { url: 'https://instagram.com/p/EJEMPLO3', image: '' },
    ])
  })

  it('la plantilla vacía tiene los encabezados del nuevo formato', () => {
    const buf = readFileSync(plantillaPath)
    // Sin filas de datos → el parser devuelve []
    const wb = parseWorkbook(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
    expect(wb).toHaveLength(0)

    // Los encabezados se verifican parseando la hoja, no el binario
    const book = XLSX.read(buf, { type: 'buffer' })
    const sheet = book.Sheets[book.SheetNames[0]]
    const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
    const headers = (aoa[0] ?? []).map((h) => String(h))
    for (const h of ['color_hex_1', 'talla_1', 'precio_variacion_1', 'usos_comunes', 'tallas', 'combina_con', 'instagram']) {
      expect(headers).toContain(h)
    }
  })
})
