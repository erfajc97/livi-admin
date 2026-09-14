import type { ProductFormData, VariationRow } from './types'

/**
 * Validación del formulario de producto. Los obligatorios son los que el
 * backend exige (name, price, categoryId, marcaId); el resto son rangos para
 * no mandar datos imposibles (descuentos > 100, stock negativo…).
 *
 * Devuelve la lista de errores: vacía = se puede guardar.
 */
export function validateProductForm(
  formData: ProductFormData,
  variations: VariationRow[],
): string[] {
  const errors: string[] = []

  const num = (v: string) => (v.trim() === '' ? NaN : Number(v))

  // ── Obligatorios ──
  if (!formData.name.trim()) errors.push('Falta el nombre del producto.')

  const price = num(formData.price)
  if (Number.isNaN(price)) errors.push('Falta el precio base.')
  else if (price <= 0) errors.push('El precio base debe ser mayor a 0.')

  if (!formData.categoryId) errors.push('Selecciona una categoría.')
  if (!formData.marcaId) errors.push('Selecciona una marca.')

  // ── Rangos de los opcionales ──
  if (formData.stock.trim() !== '') {
    const stock = num(formData.stock)
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      errors.push('El stock debe ser un número entero de 0 o más.')
    }
  }

  if (formData.discount.trim() !== '') {
    const discount = num(formData.discount)
    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      errors.push('El descuento debe estar entre 0 y 100.')
    }
  }

  // ── Variantes (color, tamaño…) ──
  variations.forEach((v, i) => {
    const pos = i + 1
    if (!v.name.trim()) errors.push(`Variante ${pos}: falta el nombre.`)

    const vPrice = num(v.price)
    if (Number.isNaN(vPrice)) errors.push(`Variante ${pos}: falta el precio.`)
    else if (vPrice <= 0)
      errors.push(`Variante ${pos}: el precio debe ser mayor a 0.`)
  })

  return errors
}
