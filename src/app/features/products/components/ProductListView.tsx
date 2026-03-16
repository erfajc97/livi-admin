import { Spinner } from '@heroui/react'
import { CustomPagination } from '@/app/components/UI/table-nextui/CustomPagination'
import ProductListHeader from './ProductListHeader'
import ProductTable from './ProductTable'
import DeleteProductModal from './modals/DeleteProductModal'
import type { Product } from '../types'

interface ProductListViewProps {
  products: Product[]
  isLoading: boolean
  search: string
  totalPages: number
  currentPage: number
  selectedProduct: Product | null
  showDeleteModal: boolean
  isDeleting: boolean
  onSearchChange: (value: string) => void
  onCreate: () => void
  onEdit: (product: Product) => void
  onDeleteClick: (product: Product) => void
  onDeleteConfirm: () => void
  onDeleteClose: () => void
  onPageChange: (page: number) => void
}

export default function ProductListView({
  products,
  isLoading,
  search,
  totalPages,
  currentPage,
  selectedProduct,
  showDeleteModal,
  isDeleting,
  onSearchChange,
  onCreate,
  onEdit,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteClose,
  onPageChange,
}: ProductListViewProps) {
  return (
    <div className="flex flex-col gap-5">
      <ProductListHeader search={search} onSearchChange={onSearchChange} onCreate={onCreate} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : (
        <>
          <ProductTable products={products} onEdit={onEdit} onDelete={onDeleteClick} />
          {totalPages > 1 && (
            <CustomPagination pages={totalPages} page={currentPage} setPage={onPageChange} />
          )}
        </>
      )}

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={onDeleteClose}
        product={selectedProduct}
        onConfirm={onDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
