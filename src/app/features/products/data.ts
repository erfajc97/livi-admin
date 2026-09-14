import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'

export const productColumns: Column[] = [
  { key: 'imageUrl', name: '' },
  { key: 'name', name: 'Producto' },
  { key: 'price', name: 'Precio' },
  { key: 'stock', name: 'Stock' },
  { key: 'category', name: 'Categoría' },
  { key: 'isActive', name: 'Estado' },
  { key: 'actions', name: 'Acciones' },
]

export const INITIAL_FORM_DATA = {
  name: '',
  price: '',
  description: '',
  stock: '0',
  categoryId: '',
  marcaId: '',
  isActive: true,
  discount: '',
  detailDescription: '',
  benefits: '',
  commonUses: '',
  pairsWith: [] as number[],
  sizes: '',
  instagramPosts: [] as { url: string; image: string }[],
}
