import { useState, useCallback } from 'react'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '../mutations/useUserMutations'
import type { User, CreateUserPayload, UserRole } from '../types'

type FormData = {
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

const EMPTY_FORM: FormData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'client',
  phone: '',
  cedula: '',
  province: '',
  city: '',
  address: '',
  reference: '',
  preferredDeliveryMethod: '',
}

interface UseUserFormHookProps {
  onModalOpenChange?: (isOpen: boolean) => void
}

const useUserFormHook = ({ onModalOpenChange }: UseUserFormHookProps = {}) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)

  const { mutate: createUser, isPending: isCreating } = useCreateUserMutation()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation()

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleToEditForm = useCallback((user: User) => {
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      role: user.role,
      phone: user.phone ?? '',
      cedula: user.cedula ?? '',
      province: user.province ?? '',
      city: user.city ?? '',
      address: user.address ?? '',
      reference: user.reference ?? '',
      preferredDeliveryMethod: user.preferredDeliveryMethod ?? '',
    })
  }, [])

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM)
  }, [])

  const handleSubmit = ({ id }: { id?: string | null }) => {
    if (!formData.firstName || !formData.lastName || !formData.email) return

    const options = {
      onSuccess: () => onModalOpenChange?.(false),
    }

    if (id) {
      updateUser(
        {
          id,
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role,
            phone: formData.phone || undefined,
            cedula: formData.cedula || undefined,
            province: formData.province || undefined,
            city: formData.city || undefined,
            address: formData.address || undefined,
            reference: formData.reference || undefined,
            preferredDeliveryMethod: formData.preferredDeliveryMethod || undefined,
          },
        },
        options,
      )
    } else {
      if (!formData.password) return
      createUser(formData as CreateUserPayload, {
        onSuccess: () => {
          resetForm()
          onModalOpenChange?.(false)
        },
      })
    }
  }

  return {
    formData,
    handleInputChange,
    handleToEditForm,
    handleSubmit,
    resetForm,
    isLoading: isCreating || isUpdating,
  }
}

export default useUserFormHook
