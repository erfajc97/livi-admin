import { Pagination } from '@heroui/react'

interface CustomPaginationProps {
  page: number
  pages: number
  setPage: (page: number) => void
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CustomPagination({
  page,
  pages,
  setPage,
  isLoading = false,
  size = 'sm',
}: CustomPaginationProps) {
  if (!pages || pages <= 1) return null

  return (
    <div className="mt-auto flex items-center justify-center pt-1">
      <Pagination
        showControls
        showShadow
        color="primary"
        radius="full"
        page={page}
        total={pages}
        onChange={setPage}
        size={size}
        isDisabled={isLoading}
      />
    </div>
  )
}
