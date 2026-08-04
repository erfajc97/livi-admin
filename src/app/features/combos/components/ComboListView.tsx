import { Spinner } from '@heroui/react'
import ComboListHeader from './ComboListHeader'
import ComboCard from './ComboCard'
import DeleteComboModal from './modals/DeleteComboModal'
import type { Combo } from '../types'

interface ComboListViewProps {
  combos: Combo[]
  isLoading: boolean
  search: string
  selectedCombo: Combo | null
  showDeleteModal: boolean
  isDeleting: boolean
  onSearchChange: (value: string) => void
  onCreate: () => void
  onEdit: (combo: Combo) => void
  onDeleteClick: (combo: Combo) => void
  onDeleteConfirm: () => void
  onDeleteClose: () => void
}

export default function ComboListView({
  combos,
  isLoading,
  search,
  selectedCombo,
  showDeleteModal,
  isDeleting,
  onSearchChange,
  onCreate,
  onEdit,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteClose,
}: ComboListViewProps) {
  return (
    <div className="flex flex-col gap-5">
      <ComboListHeader
        search={search}
        onSearchChange={onSearchChange}
        onCreate={onCreate}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : combos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-text-muted">No se encontraron combos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {combos.map((combo) => (
            <ComboCard
              key={combo.id}
              combo={combo}
              onEdit={onEdit}
              onDelete={onDeleteClick}
            />
          ))}
        </div>
      )}

      <DeleteComboModal
        isOpen={showDeleteModal}
        onClose={onDeleteClose}
        combo={selectedCombo}
        onConfirm={onDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
