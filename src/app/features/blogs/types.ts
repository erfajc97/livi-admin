export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  imageKey?: string
  isPublished: boolean
  position: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBlogPostDto {
  title: string
  slug?: string
  excerpt?: string
  content: string
  imageUrl?: string
  imageKey?: string
  isPublished?: boolean
  position?: number
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {}
