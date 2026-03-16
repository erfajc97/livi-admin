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
  }
  onInputChange: (field: string, value: string | boolean) => void
}

const userRoles = [
  { key: 'client', label: 'Cliente' },
  { key: 'admin', label: 'Administrador' },
]

const inputClasses = { label: '!text-text' }
const selectClasses = { label: '!text-text', popoverContent: 'bg-surface text-text' }

export default function UserForm({ isThereId, formData, onInputChange }: UserFormProps) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="Nombre"
          placeholder="Ingresa el nombre"
          labelPlacement="outside"
          value={formData.firstName}
          onChange={(e) => onInputChange('firstName', e.target.value)}
          autoComplete="off"
          classNames={inputClasses}
          isRequired
        />
        <Input
          label="Apellido"
          placeholder="Ingresa el apellido"
          labelPlacement="outside"
          value={formData.lastName}
          onChange={(e) => onInputChange('lastName', e.target.value)}
          autoComplete="off"
          classNames={inputClasses}
          isRequired
        />
      </div>

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="usuario@ejemplo.com"
        labelPlacement="outside"
        value={formData.email}
        onChange={(e) => onInputChange('email', e.target.value)}
        isDisabled={!!isThereId}
        autoComplete="off"
        classNames={inputClasses}
        isRequired
      />

      {!isThereId && (
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          labelPlacement="outside"
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          autoComplete="new-password"
          classNames={inputClasses}
          isRequired
        />
      )}

      <Select
        label="Tipo de usuario"
        placeholder="Selecciona el tipo"
        labelPlacement="outside"
        selectedKeys={new Set([formData.role])}
        onChange={(e) => onInputChange('role', e.target.value)}
        classNames={selectClasses}
        isRequired
      >
        {userRoles.map((type) => (
          <SelectItem key={type.key}>{type.label}</SelectItem>
        ))}
      </Select>
    </div>
  )
}
