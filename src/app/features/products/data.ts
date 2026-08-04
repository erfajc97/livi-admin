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

// ── PDP editorial: opciones predefinidas ──
// Vocabulario de perfumería: familias olfativas, texturas, temperamento y
// contexto. Se muestran como chips seleccionables (multi-selección).
export const CARACTER_OPTIONS = [
  // Base / temperamento
  'Elegante',
  'Sensual',
  'Fresco',
  'Amaderado',
  'Dulce',
  'Intenso',
  'Sofisticado',
  'Versátil',
  'Atrevido',
  'Clásico',
  'Aromático',
  'Oriental',
  // Familias olfativas
  'Cítrico',
  'Floral',
  'Frutal',
  'Especiado',
  'Ahumado',
  'Avainillado',
  'Almizclado',
  'Ambarino',
  'Acuático',
  'Marino',
  'Herbal',
  'Verde',
  'Terroso',
  'Balsámico',
  'Resinoso',
  'Cuero',
  'Gourmand',
  'Chipre',
  'Fougère',
  'Achocolatado',
  'Atalcado',
  'Empolvado',
  // Textura / percepción
  'Cremoso',
  'Jabonoso',
  'Limpio',
  'Envolvente',
  'Adictivo',
  'Luminoso',
  'Cálido',
  'Frío',
  'Discreto',
  'Potente',
  'Minimalista',
  'Opulento',
  // Carácter emocional
  'Misterioso',
  'Seductor',
  'Romántico',
  'Energético',
  'Relajante',
  'Nostálgico',
  'Exótico',
  'Artesanal',
  'Juvenil',
  'Maduro',
  // Estacional / momento
  'Nocturno',
  'Veraniego',
  'Invernal',
  'Otoñal',
  'Primaveral',
]

export const OCASION_OPTIONS = [
  'Día',
  'Noche',
  'Formal',
  'Casual',
  'Oficina',
  'Cita',
  'Fiesta',
  'Verano',
  'Invierno',
  'Especial',
  'Diario',
]

// Presets de color para las notas (el admin puede igual elegir cualquier color)
export const SCENT_COLOR_PRESETS = [
  '#E8D8C0',
  '#C9A87A',
  '#8A6B4A',
  '#6F5238',
  '#D9C9A0',
  '#B89A6A',
  '#A8C0B0',
  '#7A8A6B',
  '#3A3636',
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
  // ── PDP editorial ──
  scentProfileTitle: '',
  scentSections: [] as {
    title: string
    notes: { name: string; color: string }[]
    description: string
  }[],
  mood: [] as string[],
  occasion: [] as string[],
  longevity: '',
  projectionScore: '',
  signatureTitle: '',
  signatureDescription: '',
  signatureImageUrl: '',
  signatureImageFile: null as File | null,
}
