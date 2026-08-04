import { useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { useBlogsQuery } from '@/app/tanstack-queries/blogsQuery'
import { useBlogFormHook } from './useBlogFormHook'
import {
  useDeleteBlogMutation,
  useReorderBlogsMutation,
} from '../mutations/useBlogMutations'
import type { BlogPost } from '../types'

export function useBlogsPageHook() {
  const [id, setId] = useState<string | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [localBlogs, setLocalBlogs] = useState<BlogPost[] | null>(null)

  const { data: blogs = [], isLoading } = useBlogsQuery()
  const deleteMutation = useDeleteBlogMutation()
  const reorderMutation = useReorderBlogsMutation()

  const displayBlogs = localBlogs ?? blogs

  const { handleToEditForm, resetForm, ...formHook } = useBlogFormHook({
    id,
    onSuccess: () => onOpenChange(),
  })

  const handleCreateClick = () => {
    setId(null)
    resetForm()
    onOpen()
  }

  const handleEditClick = (blog: BlogPost) => {
    setId(String(blog.id))
    handleToEditForm(blog)
    onOpen()
  }

  const handleDeleteClick = (blog: BlogPost) => {
    setDeleteTarget(blog)
    onDeleteOpen()
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(String(deleteTarget.id), {
        onSuccess: () => {
          setLocalBlogs(null)
          onDeleteOpenChange()
        },
      })
    }
  }

  const handleFormModalOpenChange = (open: boolean) => {
    if (!open) {
      setId(null)
      resetForm()
    }
    onOpenChange()
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const currentList = displayBlogs
    const oldIndex = currentList.findIndex((b) => b.id === active.id)
    const newIndex = currentList.findIndex((b) => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(currentList, oldIndex, newIndex)
    setLocalBlogs(reordered)
    reorderMutation.mutate(
      reordered.map((b) => Number(b.id)),
      { onSettled: () => setLocalBlogs(null) },
    )
  }

  return {
    id,
    blogs: displayBlogs,
    isLoading,
    formHook,
    deleteTarget,
    isOpen,
    isDeleteOpen,
    isDeleting: deleteMutation.isPending,
    onDeleteOpenChange,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleFormModalOpenChange,
    handleDragEnd,
  }
}
