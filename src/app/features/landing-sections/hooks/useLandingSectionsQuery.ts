import { useQuery } from '@tanstack/react-query'
import { landingSectionsService } from '../services/landingSectionsService'

export const LANDING_SECTIONS_QUERY_KEY = 'landing-sections'

export function useLandingSectionsQuery() {
  return useQuery({
    queryKey: [LANDING_SECTIONS_QUERY_KEY],
    queryFn: () => landingSectionsService.getAll(),
  })
}

export function useLandingSectionQuery(id: number | null) {
  return useQuery({
    queryKey: [LANDING_SECTIONS_QUERY_KEY, id],
    queryFn: () => landingSectionsService.getById(id!),
    enabled: id !== null,
  })
}

export function useAvailableProductsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ['products', 'available'],
    queryFn: () =>
      landingSectionsService.getAvailableProducts({
        limit: 100,
        isActive: true,
      }),
    enabled,
  })
}
