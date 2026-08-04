import { useState } from 'react'
import { useAvailableProductsQuery } from './useLandingSectionsQuery'
import {
  useAddProductMutation,
  useRemoveProductMutation,
} from '../mutations/landingSectionsMutations'
import type { LandingSection } from '../types'

export function useSectionProductsHook(
  section: LandingSection | null,
  isModalOpen: boolean = true,
) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: availableProducts = [], isLoading: isLoadingProducts } =
    useAvailableProductsQuery(isModalOpen)
  const addProductMutation = useAddProductMutation()
  const removeProductMutation = useRemoveProductMutation()

  const sectionProductIds = section?.products?.map((p) => p.id) || []

  // Productos disponibles para agregar (que no están en la sección)
  const productsToAdd = Array.isArray(availableProducts)
    ? availableProducts.filter((p) => !sectionProductIds.includes(p.id))
    : []

  // Filtrar por búsqueda
  const filteredProductsToAdd = Array.isArray(productsToAdd)
    ? productsToAdd.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const handleAddProduct = async (productId: number) => {
    if (!section) return
    await addProductMutation.mutateAsync({ sectionId: section.id, productId })
  }

  const handleRemoveProduct = async (productId: number) => {
    if (!section) return
    await removeProductMutation.mutateAsync({
      sectionId: section.id,
      productId,
    })
  }

  return {
    searchTerm,
    setSearchTerm,
    sectionProducts: section?.products || [],
    filteredProductsToAdd,
    isLoadingProducts,
    handleAddProduct,
    handleRemoveProduct,
    isAddingProduct: addProductMutation.isPending,
    isRemovingProduct: removeProductMutation.isPending,
  }
}
