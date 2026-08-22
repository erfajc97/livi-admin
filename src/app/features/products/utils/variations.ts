import type { Product, ProductVariation } from '../types'

interface ProductWithVariations {
  price: number
  totalMl: number
  variations?: ProductVariation[]
}

/**
 * Devuelve el id de la variante espejo del frasco: la que el backend crea solo
 * y mantiene sincronizada con `product.price` / `product.totalMl`. Es la única
 * que el formulario no debe mostrar ni tocar, porque el servidor la reescribe
 * en cada guardado.
 *
 * No alcanza con mirar `isFullBottle`: las presentaciones "sellada" que carga
 * el admin también llegan con ese flag en true, y filtrarlas a todas las
 * dejaba invisibles en el panel (imposibles de editar o borrar) aunque la
 * ficha pública las siguiera mostrando.
 *
 * Si hubiera más de una candidata, gana la más antigua: la automática se crea
 * antes que cualquier presentación cargada a mano.
 */
export function findAutoFullBottleVariationId(
  product: ProductWithVariations | Product | null | undefined,
): string | undefined {
  const variations = product?.variations ?? []
  if (!product || variations.length === 0) return undefined

  const productPrice = Number(product.price)
  const productMl = Number(product.totalMl)

  const mirrors = variations.filter(
    (v) =>
      v.isFullBottle &&
      Number(v.mlSize) === productMl &&
      Number(v.price ?? productPrice) === productPrice,
  )
  if (mirrors.length === 0) return undefined

  const oldest = mirrors.reduce((acc, v) =>
    Number(v.id) < Number(acc.id) ? v : acc,
  )
  return String(oldest.id)
}
