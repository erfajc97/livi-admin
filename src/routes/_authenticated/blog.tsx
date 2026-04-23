import { createFileRoute } from '@tanstack/react-router'
import { Blogs } from '@/app/features/blogs/Blogs'

export const Route = createFileRoute('/_authenticated/blog')({
  component: Blogs,
})
