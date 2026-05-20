import { useAuthStore } from '@/app/store/auth/authStore'
import WelcomeBanner from '@/app/features/dashboard/components/WelcomeBanner'
import { useProductsPageHook } from './hooks/useProductsPageHook'
import ProductListView from './components/ProductListView'
import ProductFormView from './components/ProductFormView'

export function Products() {
  const { userName } = useAuthStore()
  const {
    view,
    search,
    products,
    totalPages,
    filters,
    isLoading,
    selectedProduct,
    showDeleteModal,
    deleteMutation,
    handleSearch,
    handlePageChange,
    handleCreate,
    handleEdit,
    handleBackToList,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteClose,
  } = useProductsPageHook()

  if (view === 'create' || view === 'edit') {
    return (
      <div className="flex flex-col gap-6">
        <ProductFormView product={selectedProduct} onBack={handleBackToList} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner userName={userName} subtitle="Gestión de productos NönDecants" />

      <ProductListView
        products={products}
        isLoading={isLoading}
        search={search}
        totalPages={totalPages}
        currentPage={filters.page ?? 1}
        selectedProduct={selectedProduct}
        showDeleteModal={showDeleteModal}
        isDeleting={deleteMutation.isPending}
        onSearchChange={handleSearch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteClose={handleDeleteClose}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
