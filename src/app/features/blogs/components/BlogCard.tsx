import { Button, Chip } from '@heroui/react'
import { PencilIcon, TrashIcon, Image, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BlogPost } from '../types'

interface BlogCardProps {
  blog: BlogPost
  onEdit: (blog: BlogPost) => void
  onDelete: (blog: BlogPost) => void
}

export default function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: blog.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30 sm:flex-row sm:gap-4"
    >
      <div className="flex gap-3 sm:contents">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex shrink-0 cursor-grab items-center active:cursor-grabbing"
        >
          <GripVertical size={20} className="text-text-muted" />
        </div>

        {/* Image thumbnail */}
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-raised sm:h-24 sm:w-32">
          {blog.imageUrl ? (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image size={32} className="text-text-muted" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="truncate text-base font-semibold text-text">{blog.title}</h3>
            <Chip
              size="sm"
              variant="flat"
              color={blog.isPublished ? 'success' : 'default'}
            >
              {blog.isPublished ? 'Publicado' : 'Borrador'}
            </Chip>
          </div>
          {blog.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-text-muted">{blog.excerpt}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap items-start gap-1 self-end sm:self-start">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => onEdit(blog)}
          aria-label="Editar blog"
        >
          <PencilIcon size={16} className="text-text-muted" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onDelete(blog)}
          aria-label="Eliminar blog"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
    </div>
  )
}
