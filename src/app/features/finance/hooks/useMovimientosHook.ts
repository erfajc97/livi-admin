import { useState, useMemo, useCallback } from 'react'
import type { Transaction } from '../types'

const ITEMS_PER_PAGE = 10

export function useMovimientosHook(transactions: Transaction[]) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions
    const q = search.toLowerCase()
    return transactions.filter(
      (t) =>
        t.category.toLowerCase().includes(q) ||
        t.paymentMethod?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q),
    )
  }, [transactions, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  return {
    search,
    page,
    totalPages,
    paginated,
    handleSearch,
    setPage,
  }
}
