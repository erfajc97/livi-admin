import { useState, useCallback } from 'react'
import { Button, Chip, useDisclosure } from '@heroui/react'
import { KeyRoundIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useUsersTableHook } from './useUsersTableHook'
import useUserFormHook from './useUserFormHook'
import type { User } from '../types'

export function useUsersPageHook() {
  const [id, setId] = useState<string | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onOpenChange: onResetOpenChange,
  } = useDisclosure()
  const [resetTarget, setResetTarget] = useState<User | null>(null)

  const tableHook = useUsersTableHook()
  const { handleToEditForm, resetForm, ...formHook } = useUserFormHook({
    onModalOpenChange: (open) => {
      if (!open) {
        onOpenChange()
        setId(null)
        resetForm()
      }
    },
  })

  const handleCreateClick = () => {
    resetForm()
    setId(null)
    onOpen()
  }

  const handleEditClick = (user: User) => {
    handleToEditForm(user)
    setId(user.id)
    onOpen()
  }

  const handleResetClick = (user: User) => {
    setResetTarget(user)
    onResetOpen()
  }

  const handleDeleteClick = (user: User) => {
    setDeleteTarget(user)
    onDeleteOpen()
  }

  const handleFormModalOpenChange = (open: boolean) => {
    if (!open) {
      setId(null)
      resetForm()
    }
    onOpenChange()
  }

  const DELIVERY_LABELS: Record<string, string> = {
    ENTREGA_PERSONAL: 'Plaza Tía',
    RETIRO_PIWU: 'Piwu Market',
    SERVIENTREGA_GYE: 'Servi GYE',
    SERVIENTREGA_NACIONAL: 'Servi Nac.',
  }

  const renderCell = useCallback((item: User, columnKey: string) => {
    const txt = (v?: string) => (
      <span className="text-xs text-text-muted">{v || '—'}</span>
    )
    const trunc = (v?: string) => (
      <span className="text-xs text-text-muted max-w-[120px] truncate block">
        {v || '—'}
      </span>
    )

    switch (columnKey) {
      case 'name':
        return (
          <span className="text-sm font-medium text-text whitespace-nowrap">
            {item.firstName} {item.lastName}
          </span>
        )
      case 'email':
        return <span className="text-xs text-text-muted">{item.email}</span>
      case 'cedula':
        return txt(item.cedula)
      case 'phone':
        return txt(item.phone)
      case 'province':
        return txt(item.province)
      case 'city':
        return txt(item.city)
      case 'address':
        return trunc(item.address)
      case 'reference':
        return trunc(item.reference)
      case 'deliveryPref':
        return txt(
          item.preferredDeliveryMethod
            ? DELIVERY_LABELS[item.preferredDeliveryMethod] ||
                item.preferredDeliveryMethod
            : undefined,
        )
      case 'role':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.role === 'admin' ? 'danger' : 'primary'}
          >
            {item.role === 'admin' ? 'Admin' : 'Cliente'}
          </Chip>
        )
      case 'authProvider':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.authProvider === 'google' ? 'warning' : 'default'}
          >
            {item.authProvider === 'google' ? 'Google' : 'Local'}
          </Chip>
        )
      case 'status':
        return (
          <Chip
            size="sm"
            variant="dot"
            color={item.isActive ? 'success' : 'default'}
          >
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Chip>
        )
      case 'emailVerified':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.isEmailVerified ? 'success' : 'warning'}
          >
            {item.isEmailVerified ? 'Sí' : 'No'}
          </Chip>
        )
      case 'createdAt':
        return (
          <span className="text-xs text-text-muted whitespace-nowrap">
            {new Date(item.createdAt).toLocaleDateString('es-EC', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )
      case 'edit':
        return (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            onPress={() => handleEditClick(item)}
          >
            <PencilIcon size={16} className="text-text-muted" />
          </Button>
        )
      case 'password':
        return (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            title="Restablecer contraseña"
            aria-label={`Restablecer contraseña de ${item.email}`}
            onPress={() => handleResetClick(item)}
          >
            <KeyRoundIcon size={16} className="text-text-muted" />
          </Button>
        )
      case 'delete':
        return (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            radius="full"
            onPress={() => handleDeleteClick(item)}
          >
            <TrashIcon size={16} />
          </Button>
        )
      default:
        return null
    }
  }, [])

  return {
    id,
    tableHook,
    formHook,
    renderCell,
    deleteTarget,
    resetTarget,
    isOpen,
    isDeleteOpen,
    onDeleteOpenChange,
    isResetOpen,
    onResetOpenChange,
    handleCreateClick,
    handleFormModalOpenChange,
  }
}
