import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { useAvailableProductsQuery } from './useLandingSectionsQuery'
import {
  useAddProductMutation,
  useRemoveProductMutation,
  useReorderSectionProductsMutation,
} from '../mutations/landingSectionsMutations'
import type { LandingSection, Product } from '../types'

export function useSectionProductsHook(
  section: LandingSection | null,
  isModalOpen: boolean = true,
) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setOrderedProducts(section?.products ?? [])
  }, [section])

  const { data: availableProducts = [], isLoading: isLoadingProducts } =
    useAvailableProductsQuery(isModalOpen, debouncedSearch)
  const addProductMutation = useAddProductMutation()
  const removeProductMutation = useRemoveProductMutation()
  const reorderMutation = useReorderSectionProductsMutation()

  const sectionProductIds = orderedProducts.map((p) => p.id)

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

  const handleDragEnd = (event: DragEndEvent) => {
    if (!section) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = orderedProducts.findIndex(
      (p) => String(p.id) === String(active.id),
    )
    const newIndex = orderedProducts.findIndex(
      (p) => String(p.id) === String(over.id),
    )
    if (oldIndex < 0 || newIndex < 0) return

    const next = arrayMove(orderedProducts, oldIndex, newIndex)
    setOrderedProducts(next)
    reorderMutation.mutate({
      sectionId: section.id,
      productIds: next.map((p) => Number(p.id)),
    })
  }

  return {
    searchTerm,
    setSearchTerm,
    sectionProducts: orderedProducts,
    filteredProductsToAdd,
    isLoadingProducts,
    handleAddProduct,
    handleRemoveProduct,
    handleDragEnd,
    isAddingProduct: addProductMutation.isPending,
    isRemovingProduct: removeProductMutation.isPending,
  }
}
