import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'

export const columns: Column[] = [
  { key: 'email', name: 'CORREO ELECTRÓNICO' },
  { key: 'name', name: 'NOMBRE' },
  { key: 'role', name: 'ROL', align: 'center' },
  { key: 'status', name: 'ESTADO', align: 'center' },
  { key: 'createdAt', name: 'CREADO' },
  { key: 'edit', name: 'EDITAR', align: 'center' },
  { key: 'delete', name: 'ELIMINAR', align: 'center' },
]
