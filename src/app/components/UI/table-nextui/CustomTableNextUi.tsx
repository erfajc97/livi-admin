import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import type { Selection, SortDescriptor } from '@heroui/react'

export type Column = {
  key: string
  name: string
  sortable?: boolean
  align?: 'center' | 'start' | 'end'
  width?: string | number
}

interface CustomTableProps<T extends { id: string | number }> {
  items: T[]
  columns: Column[]
  renderCell: (item: T, columnKey: string) => React.ReactNode
  isLoading?: boolean
  emptyContent?: string
  selectionMode?: 'single' | 'multiple' | 'none'
  selectedKeys?: Selection
  onSelectionChange?: (keys: Selection) => void
  sortDescriptor?: SortDescriptor
  onSortChange?: (sort: SortDescriptor) => void
  topContent?: React.ReactNode
  bottomContent?: React.ReactNode
  onRowClick?: (item: T) => void
  classNames?: Partial<Record<'base' | 'tableWrapper' | 'topContent', string>>
}

export function CustomTableNextUi<T extends { id: string | number }>({
  items,
  columns,
  renderCell,
  isLoading = false,
  emptyContent = 'No hay datos disponibles',
  selectionMode = 'none',
  selectedKeys,
  onSelectionChange,
  sortDescriptor,
  onSortChange,
  topContent,
  bottomContent,
  onRowClick,
  classNames: externalClassNames,
}: CustomTableProps<T>) {
  return (
    <div className={`flex h-full flex-col gap-4 rounded-xl bg-surface p-3 sm:rounded-2xl sm:p-6 ${externalClassNames?.base ?? ''}`}>
      {topContent && <div className={externalClassNames?.topContent ?? ''}>{topContent}</div>}
      <div className="-mx-1 overflow-x-auto sm:mx-0">
      <Table
        isStriped
        color="primary"
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        classNames={{
          wrapper: `table-report h-full min-w-[640px] rounded-none p-0 shadow-none bg-surface ${externalClassNames?.tableWrapper ?? ''}`,
          th: 'h-9 bg-surface-raised text-text-muted text-xs uppercase tracking-wider',
          tbody: 'text-text',
          tr: '!rounded-full data-[odd=true]:bg-surface-raised',
          td: 'py-[.18rem] text-text',
        }}
      >
        <TableHeader columns={columns}>
          {(col) => (
            <TableColumn
              key={col.key}
              align={col.align ?? 'start'}
              allowsSorting={col.sortable}
            >
              {col.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner color="primary" />}
          emptyContent={emptyContent}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell
                  onClick={() => {
                    if (String(columnKey) !== 'actions' && onRowClick) {
                      onRowClick(item)
                    }
                  }}
                  className={onRowClick && String(columnKey) !== 'actions' ? 'cursor-pointer' : ''}
                >
                  {renderCell(item, String(columnKey))}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      {bottomContent && <div>{bottomContent}</div>}
    </div>
  )
}
