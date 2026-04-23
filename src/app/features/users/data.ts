import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'

export const columns: Column[] = [
  { key: 'name', name: 'NOMBRE' },
  { key: 'email', name: 'EMAIL' },
  { key: 'cedula', name: 'CÉDULA' },
  { key: 'phone', name: 'TELÉFONO' },
  { key: 'province', name: 'PROVINCIA' },
  { key: 'city', name: 'CIUDAD' },
  { key: 'address', name: 'DIRECCIÓN' },
  { key: 'reference', name: 'REFERENCIA' },
  { key: 'deliveryPref', name: 'ENVÍO PREF.' },
  { key: 'role', name: 'ROL', align: 'center' },
  { key: 'authProvider', name: 'AUTH', align: 'center' },
  { key: 'status', name: 'ESTADO', align: 'center' },
  { key: 'emailVerified', name: 'EMAIL OK', align: 'center' },
  { key: 'createdAt', name: 'REGISTRADO' },
  { key: 'edit', name: '', align: 'center' },
  { key: 'delete', name: '', align: 'center' },
]
