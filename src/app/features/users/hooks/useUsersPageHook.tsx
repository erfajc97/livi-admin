import { useState, useCallback } from 'react'
import { Button, Chip } from '@heroui/react'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { useDisclosure } from '@heroui/react'
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

  const renderCell = useCallback((item: User, columnKey: string) => {
    switch (columnKey) {
      case 'email':
        return <span className="text-sm text-text">{item.email}</span>

      case 'name':
        return (
          <span className="text-sm text-text">
            {item.firstName} {item.lastName}
          </span>
        )

      case 'role':
        return (
          <Chip size="sm" variant="flat" color={item.role === 'admin' ? 'danger' : 'primary'}>
            {item.role === 'admin' ? 'Admin' : 'Cliente'}
          </Chip>
        )

      case 'status':
        return (
          <Chip size="sm" variant="dot" color={item.isActive ? 'success' : 'default'}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Chip>
        )

      case 'createdAt':
        return (
          <span className="text-sm text-text-muted">
            {new Date(item.createdAt).toLocaleDateString('es-ES')}
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
    isOpen,
    isDeleteOpen,
    onDeleteOpenChange,
    handleCreateClick,
    handleFormModalOpenChange,
  }
}
