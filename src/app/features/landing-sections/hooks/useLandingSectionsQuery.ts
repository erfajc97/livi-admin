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

/**
 * Productos que se pueden agregar a una sección.
 *
 * Antes traía 100 y filtraba en el navegador: con el catálogo actual los
 * productos del final simplemente no aparecían al buscarlos. Ahora la búsqueda
 * viaja al backend —el límite por página es 100— así que se llega a cualquier
 * producto escribiendo su nombre.
 */
export function useAvailableProductsQuery(
  enabled: boolean = true,
  search: string = '',
) {
  const term = search.trim()
  return useQuery({
    queryKey: ['products', 'available', term],
    queryFn: () =>
      landingSectionsService.getAvailableProducts({
        limit: 100,
        isActive: true,
        ...(term ? { search: term } : {}),
      }),
    enabled,
    placeholderData: (prev) => prev,
  })
}
