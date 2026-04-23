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

export interface UserFormProps {
  user?: User
  isLoading?: boolean
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void
}
