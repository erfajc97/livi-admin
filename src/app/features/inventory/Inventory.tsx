import { useInventoryPageHook } from './hooks/useInventoryPageHook'
import InventoryListView from './components/InventoryListView'
import InventoryDetailView from './components/InventoryDetailView'

export default function Inventory() {
  const {
    products,
    isLoadingProducts,
    search,
    setSearch,
    selectedProductId,
    selectProduct,
    goBackToList,
    detail,
    isLoadingDetail,
  } = useInventoryPageHook()

  if (selectedProductId && detail) {
    return (
      <InventoryDetailView
        detail={detail}
        isLoading={isLoadingDetail}
        onBack={goBackToList}
      />
    )
  }

  return (
    <InventoryListView
      products={products}
      isLoading={isLoadingProducts}
      search={search}
      onSearchChange={setSearch}
      onViewDetail={selectProduct}
    />
  )
}
