import { useQuery } from '@tanstack/react-query'
import { combosService } from '@/app/features/combos/services/combosService'
import type { Combo } from '@/app/features/combos/types'

export function useCombosQuery() {
  return useQuery<Combo[]>({
    queryKey: ['combos'],
    queryFn: () => combosService.listCombos(),
  })
}

export function useComboByIdQuery(id: number, enabled = true) {
  return useQuery<Combo>({
    queryKey: ['combos', id],
    queryFn: () => combosService.getComboById(id),
    enabled,
  })
}
