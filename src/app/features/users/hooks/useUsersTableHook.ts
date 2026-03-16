import { useState, useMemo } from 'react'
import { useUsersQuery } from '@/app/tanstack-queries/usersQuery'

const PAGE_SIZE = 10

export function useUsersTableHook() {
  const [page, setPage] = useState(1)
  const { data: allUsers = [], isLoading, isFetching } = useUsersQuery({})

  const totalPages = Math.max(1, Math.ceil(allUsers.length / PAGE_SIZE))
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return allUsers.slice(start, start + PAGE_SIZE)
  }, [allUsers, page])

  return {
    users: paginatedUsers,
    totalPages,
    currentPage: page,
    isLoading: isLoading || isFetching,
    setPage,
  }
}
