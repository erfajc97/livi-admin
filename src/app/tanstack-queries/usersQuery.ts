import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/app/features/users/services/usersService'
import type { User } from '@/app/features/users/types'

export interface UseUsersQueryParams {
  page?: number
  limit?: number
  enabled?: boolean
}

export function useUsersQuery({ page = 1, limit = 10, enabled = true }: UseUsersQueryParams = {}) {
  return useQuery<User[]>({
    queryKey: ['users', { page, limit }],
    queryFn: () => usersService.listUsers(page, limit),
    enabled,
  })
}
