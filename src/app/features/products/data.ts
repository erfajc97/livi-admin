import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import type { Gender, TimeOfDay, Concentration, Projection } from './types'

export const productColumns: Column[] = [
  { key: 'imageUrl', name: '' },
  { key: 'name', name: 'Producto' },
  { key: 'price', name: 'Precio' },
  { key: 'stock', name: 'Botellas' },
  { key: 'totalMl', name: 'ML' },
  { key: 'availableMl', name: 'ML Disponible' },
  { key: 'category', name: 'Categoría' },
  { key: 'isActive', name: 'Estado' },
  { key: 'bajoPedido', name: 'Bajo Pedido' },
  { key: 'actions', name: 'Acciones' },
]

export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'HOMBRE', label: 'Hombre' },
  { value: 'MUJER', label: 'Mujer' },
  { value: 'UNISEX', label: 'Unisex' },
]

export const TIME_OF_DAY_OPTIONS: { value: TimeOfDay; label: string }[] = [
  { value: 'DIA', label: 'Día' },
  { value: 'NOCHE', label: 'Noche' },
]

export const CONCENTRATIONS: { value: Concentration; label: string }[] = [
  { value: 'EAU_DE_PARFUM', label: 'Eau de Parfum' },
  { value: 'EAU_DE_TOILETTE', label: 'Eau de Toilette' },
  { value: 'ELIXIR_DE_PARFUM', label: 'Elixir de Parfum' },
  { value: 'EAU_DE_COLOGNE', label: 'Eau de Cologne' },
  { value: 'BODY_MIST', label: 'Body Mist' },
  { value: 'PARFUM_EXTRAIT', label: 'Parfum / Extrait' },
]

export const PROJECTIONS: { value: Projection; label: string }[] = [
  { value: 'DISCRETA', label: 'Discreta' },
  { value: 'MODERADA', label: 'Moderada' },
  { value: 'ALTA', label: 'Alta' },
]

export const INITIAL_FORM_DATA = {
  name: '',
  price: '',
  description: '',
  stock: '0',
  totalMl: '',
  categoryId: '',
  marcaId: '',
  isActive: true,
  bajoPedido: false,
  gender: '',
  timeOfDay: '',
  concentration: '',
  projection: '',
  discount: '',
  detailDescription: '',
  benefits: '',
}
