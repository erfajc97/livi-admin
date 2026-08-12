import { useEffect, useState } from 'react'
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
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // La búsqueda va al backend: sin esto, los productos fuera de la primera
  // página del catálogo no aparecían nunca en el buscador de la sección.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: availableProducts = [], isLoading: isLoadingProducts } =
    useAvailableProductsQuery(isModalOpen, debouncedSearch)
  const addProductMutation = useAddProductMutation()
  const removeProductMutation = useRemoveProductMutation()

  const sectionProductIds = section?.products?.map((p) => p.id) || []

  // Productos disponibles para agregar (los que aún no están en la sección)
  const filteredProductsToAdd = Array.isArray(availableProducts)
    ? availableProducts.filter((p) => !sectionProductIds.includes(p.id))
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
