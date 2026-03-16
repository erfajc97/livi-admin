import { useAuthStore } from '@/app/store/auth/authStore'
import WelcomeBanner from '@/app/features/dashboard/components/WelcomeBanner'
import { useCombosPageHook } from './hooks/useCombosPageHook'
import ComboListView from './components/ComboListView'
import ComboFormView from './components/ComboFormView'

export function Combos() {
  const { userName } = useAuthStore()
  const {
    view,
    search,
    combos,
    isLoading,
    selectedCombo,
    showDeleteModal,
    deleteMutation,
    handleSearch,
    handleCreate,
    handleEdit,
    handleBackToList,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteClose,
  } = useCombosPageHook()

  if (view === 'create' || view === 'edit') {
    return (
      <div className="flex flex-col gap-6 p-6">
        <ComboFormView combo={selectedCombo} onBack={handleBackToList} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <WelcomeBanner userName={userName} subtitle="Gestión de combos NönDecants" />

      <ComboListView
        combos={combos}
        isLoading={isLoading}
        search={search}
        selectedCombo={selectedCombo}
        showDeleteModal={showDeleteModal}
        isDeleting={deleteMutation.isPending}
        onSearchChange={handleSearch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteClose={handleDeleteClose}
      />
    </div>
  )
}
