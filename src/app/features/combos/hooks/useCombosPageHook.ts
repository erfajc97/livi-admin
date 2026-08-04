import { useState, useCallback } from 'react'
import { useCombosQuery } from '@/app/tanstack-queries/combosQuery'
import { useDeleteComboMutation } from '../mutations/useComboMutations'
import type { Combo } from '../types'

export function useCombosPageHook() {
  const [search, setSearch] = useState('')
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')

  const { data: combos = [], isLoading } = useCombosQuery()
  const deleteMutation = useDeleteComboMutation()

  const filteredCombos = combos.filter((combo) =>
    combo.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedCombo(null)
    setView('create')
  }, [])

  const handleEdit = useCallback((combo: Combo) => {
    setSelectedCombo(combo)
    setView('edit')
  }, [])

  const handleBackToList = useCallback(() => {
    setSelectedCombo(null)
    setView('list')
  }, [])

  const handleDeleteClick = useCallback((combo: Combo) => {
    setSelectedCombo(combo)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedCombo) return
    deleteMutation.mutate(selectedCombo.id, {
      onSuccess: () => {
        setShowDeleteModal(false)
        setSelectedCombo(null)
      },
    })
  }, [selectedCombo, deleteMutation])

  const handleDeleteClose = useCallback(() => {
    setShowDeleteModal(false)
    setSelectedCombo(null)
  }, [])

  return {
    view,
    search,
    combos: filteredCombos,
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
  }
}
