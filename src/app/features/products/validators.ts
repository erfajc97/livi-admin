import type { ProductFormData, VariationRow } from './types'

/**
 * Validación del formulario de producto. Los obligatorios son los que el
 * backend exige (name, price, totalMl, categoryId, marcaId); el resto son
 * rangos para no mandar datos imposibles (descuentos > 100, ml negativos…).
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

  const totalMl = num(formData.totalMl)
  if (Number.isNaN(totalMl)) errors.push('Faltan los ML por botella.')
  else if (totalMl <= 0)
    errors.push('Los ML por botella deben ser mayores a 0.')

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

  for (const [label, value] of [
    ['La longevidad', formData.longevity],
    ['La proyección', formData.projectionScore],
  ] as const) {
    if (value.trim() === '') continue
    const score = num(value)
    if (Number.isNaN(score) || score < 0 || score > 10) {
      errors.push(`${label} debe estar entre 0 y 10.`)
    }
  }

  // ── Variantes (decants) ──
  variations.forEach((v, i) => {
    const pos = i + 1
    if (!v.name.trim()) errors.push(`Variante ${pos}: falta el nombre.`)

    const ml = num(v.mlSize)
    if (Number.isNaN(ml)) errors.push(`Variante ${pos}: faltan los ML.`)
    else if (ml <= 0)
      errors.push(`Variante ${pos}: los ML deben ser mayores a 0.`)

    const vPrice = num(v.price)
    if (Number.isNaN(vPrice)) errors.push(`Variante ${pos}: falta el precio.`)
    else if (vPrice <= 0)
      errors.push(`Variante ${pos}: el precio debe ser mayor a 0.`)
  })

  // Solo los decants consumen ml de la botella abierta; las presentaciones
  // sellada/original se manejan por unidades (stock), no por ml de botella.
  const variationMl = variations.reduce(
    (sum, v) =>
      v.presentationType === 'decant' ? sum + (Number(v.mlSize) || 0) : sum,
    0,
  )
  if (totalMl > 0 && variationMl > totalMl) {
    errors.push(
      `Los decants suman ${variationMl} ml y la botella es de ${totalMl} ml: reduce los ML.`,
    )
  }

  // ── Editorial (PDP) ──
  formData.scentSections.forEach((section, i) => {
    if (!section.title.trim()) {
      errors.push(`Perfil olfativo · sección ${i + 1}: falta el título.`)
    }
    if (section.notes.some((n) => !n.name.trim())) {
      errors.push(`Perfil olfativo · sección ${i + 1}: hay notas sin nombre.`)
    }
  })

  return errors
}
