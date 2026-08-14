import { PlusIcon } from 'lucide-react'
import { Button } from '@heroui/react'
import { CustomTableNextUi } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import { CustomPagination } from '@/app/components/UI/table-nextui/CustomPagination'
import FormModal from './components/modals/FormModal'
import DeleteModal from './components/modals/DeleteModal'
import ResetPasswordModal from './components/modals/ResetPasswordModal'
import { useUsersPageHook } from './hooks/useUsersPageHook'
import { columns } from './data'
import type { User } from './types'

export function Users() {
  const {
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
  } = useUsersPageHook()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent sm:text-3xl">
            Usuarios
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button
          color="primary"
          radius="full"
          startContent={<PlusIcon size={16} />}
          onPress={handleCreateClick}
          className="h-10 self-start sm:self-auto"
        >
          Nuevo Usuario
        </Button>
      </div>

      <CustomTableNextUi<User>
        items={tableHook.users}
        columns={columns}
        renderCell={renderCell}
        isLoading={tableHook.isLoading}
        bottomContent={
          <CustomPagination
            page={tableHook.currentPage}
            pages={tableHook.totalPages}
            setPage={tableHook.setPage}
            isLoading={tableHook.isLoading}
          />
        }
      />

      <FormModal
        isThereId={id}
        isOpen={isOpen}
        onOpenChange={handleFormModalOpenChange}
        formData={formHook.formData}
        isLoading={formHook.isLoading}
        onInputChange={formHook.handleInputChange}
        onSubmit={() => formHook.handleSubmit({ id })}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onOpenChange={onResetOpenChange}
        user={resetTarget}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        user={deleteTarget}
      />
    </div>
  )
}
