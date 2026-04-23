import { Input, Select, SelectItem } from '@heroui/react'
import type { UserRole } from '../types'

interface UserFormProps {
  isThereId: string | null
  formData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
    phone: string
    cedula: string
    province: string
    city: string
    address: string
    reference: string
    preferredDeliveryMethod: string
  }
  onInputChange: (field: string, value: string | boolean) => void
}

const userRoles = [
  { key: 'client', label: 'Cliente' },
  { key: 'admin', label: 'Administrador' },
]

const deliveryMethods = [
  { key: '', label: 'Sin preferencia' },
  { key: 'ENTREGA_PERSONAL', label: 'Entrega personal Plaza Tía (Gratis)' },
  { key: 'RETIRO_PIWU', label: 'Retiro en Piwu Market — $2' },
  { key: 'SERVIENTREGA_GYE', label: 'Servientrega GYE — $3' },
  { key: 'SERVIENTREGA_NACIONAL', label: 'Servientrega Nacional — $7' },
]

const ic = { label: '!text-text' }
const sc = { label: '!text-text', popoverContent: 'bg-surface text-text' }

export default function UserForm({ isThereId, formData, onInputChange }: UserFormProps) {
  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Name */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input label="Nombre" placeholder="Nombre" labelPlacement="outside" value={formData.firstName} onChange={(e) => onInputChange('firstName', e.target.value)} classNames={ic} isRequired />
        <Input label="Apellido" placeholder="Apellido" labelPlacement="outside" value={formData.lastName} onChange={(e) => onInputChange('lastName', e.target.value)} classNames={ic} isRequired />
      </div>

      {/* Email + Password */}
      <Input label="Correo electrónico" type="email" placeholder="usuario@ejemplo.com" labelPlacement="outside" value={formData.email} onChange={(e) => onInputChange('email', e.target.value)} isDisabled={!!isThereId} classNames={ic} isRequired />
      {!isThereId && (
        <Input label="Contraseña" type="password" placeholder="••••••••" labelPlacement="outside" value={formData.password} onChange={(e) => onInputChange('password', e.target.value)} autoComplete="new-password" classNames={ic} isRequired />
      )}

      {/* Role */}
      <Select label="Rol" placeholder="Seleccionar" labelPlacement="outside" selectedKeys={new Set([formData.role])} onChange={(e) => onInputChange('role', e.target.value)} classNames={sc} isRequired>
        {userRoles.map((r) => <SelectItem key={r.key}>{r.label}</SelectItem>)}
      </Select>

      {/* Divider */}
      <div className="border-t border-border my-1" />
      <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Datos de contacto</p>

      {/* Contact */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input label="Teléfono" placeholder="09XXXXXXXX" labelPlacement="outside" value={formData.phone} onChange={(e) => onInputChange('phone', e.target.value)} classNames={ic} />
        <Input label="Cédula" placeholder="0912345678" labelPlacement="outside" value={formData.cedula} onChange={(e) => onInputChange('cedula', e.target.value)} classNames={ic} />
      </div>

      {/* Address */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input label="Provincia" placeholder="Guayas" labelPlacement="outside" value={formData.province} onChange={(e) => onInputChange('province', e.target.value)} classNames={ic} />
        <Input label="Ciudad" placeholder="Guayaquil" labelPlacement="outside" value={formData.city} onChange={(e) => onInputChange('city', e.target.value)} classNames={ic} />
      </div>

      <Input label="Dirección" placeholder="Av. Principal 123" labelPlacement="outside" value={formData.address} onChange={(e) => onInputChange('address', e.target.value)} classNames={ic} />
      <Input label="Referencia" placeholder="Cerca de..." labelPlacement="outside" value={formData.reference} onChange={(e) => onInputChange('reference', e.target.value)} classNames={ic} />

      {/* Delivery preference */}
      <Select label="Método de envío preferido" placeholder="Sin preferencia" labelPlacement="outside" selectedKeys={formData.preferredDeliveryMethod ? new Set([formData.preferredDeliveryMethod]) : new Set()} onChange={(e) => onInputChange('preferredDeliveryMethod', e.target.value)} classNames={sc}>
        {deliveryMethods.map((m) => <SelectItem key={m.key}>{m.label}</SelectItem>)}
      </Select>
    </div>
  )
}
