export type UserRole = 'admin' | 'client'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  isEmailVerified?: boolean
  phone?: string
  cedula?: string
  province?: string
  city?: string
  address?: string
  reference?: string
  preferredDeliveryMethod?: string
  authProvider?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  role?: UserRole
  isActive?: boolean
  phone?: string
  cedula?: string
  province?: string
  city?: string
  address?: string
  reference?: string
  preferredDeliveryMethod?: string
}

export interface ResetPasswordPayload {
  /** Si se omite, el backend genera una contraseña temporal. */
  password?: string
  /** Enviar la contraseña nueva al correo del usuario (por defecto sí). */
  notify?: boolean
}

export interface ResetPasswordResult {
  email: string
  /** Solo llega en esta respuesta: después queda hasheada. */
  password: string
  notified: boolean
}

export interface UserFormProps {
  user?: User
  isLoading?: boolean
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void
}
