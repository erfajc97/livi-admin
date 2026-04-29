import { useQuery } from '@tanstack/react-query'
import { newsletterService } from '@/app/features/newsletter/services/newsletterService'

export function useSubscribersQuery() {
  return useQuery({
    queryKey: ['newsletter', 'subscribers'],
    queryFn: () => newsletterService.getSubscribers(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useSubscriberStatsQuery() {
  return useQuery({
    queryKey: ['newsletter', 'subscribers', 'stats'],
    queryFn: () => newsletterService.getSubscriberStats(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCampaignsQuery() {
  return useQuery({
    queryKey: ['newsletter', 'campaigns'],
    queryFn: () => newsletterService.getCampaigns(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCampaignQuery(id: number) {
  return useQuery({
    queryKey: ['newsletter', 'campaign', id],
    queryFn: () => newsletterService.getCampaignById(id),
    enabled: !!id,
  })
}
