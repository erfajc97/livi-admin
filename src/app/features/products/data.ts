import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import type { MeasureUnit, ProductType } from './types'

export const productColumns: Column[] = [
  { key: 'imageUrl', name: '' },
  { key: 'name', name: 'Producto' },
  { key: 'brand', name: 'Marca' },
  { key: 'price', name: 'Precio' },
  { key: 'stock', name: 'Stock' },
  { key: 'category', name: 'Categoría' },
  { key: 'isActive', name: 'Estado' },
  { key: 'actions', name: 'Acciones' },
]

export const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: 'PERFUME', label: 'Perfume' },
]

export const MEASURE_UNITS: { value: MeasureUnit; label: string }[] = [
  { value: 'ML', label: 'Mililitros (ML)' },
  { value: 'OZ', label: 'Onzas (OZ)' },
  { value: 'G', label: 'Gramos (G)' },
  { value: 'KG', label: 'Kilogramos (KG)' },
]

export const INITIAL_FORM_DATA = {
  name: '',
  brand: '',
  price: '',
  type: 'PERFUME' as ProductType,
  description: '',
  stock: '0',
  measureValue: '',
  measureUnit: 'ML' as MeasureUnit,
  categoryId: '',
  subcategoryId: '',
  parentProductId: '',
  isActive: true,
  imageUrl: '',
}
