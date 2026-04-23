import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/app/features/blog/services/blogService'
import type { BlogPost } from '@/app/features/blog/types'

export function useBlogPostsQuery() {
  return useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: () => blogService.listPosts(),
  })
}
