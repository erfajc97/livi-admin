import { useQuery } from '@tanstack/react-query'
import { blogsService } from '@/app/features/blogs/services/blogsService'

export function useBlogsQuery() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogsService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useBlogQuery(id: string) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsService.getById(id),
    enabled: !!id,
  })
}
