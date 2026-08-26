import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import { Inbox, XCircle } from 'lucide-react'
import { AlertPanel } from '../../../../../shared/components/AlertPanel'
import { useColumnOrder } from '../../hooks/useColumnOrder'
import type { ClientListItem } from '../../../domain/client.types'
import { clientTableColumns, initialClientTableColumnOrder } from './ClientTableColumns'
import { ClientTableSkeletonRow, SKELETON_ROW_COUNT } from './ClientTableSkeletonRow'
import styles from './ClientTable.module.css'

interface ClientTableProps {
  data: ClientListItem[]
  isLoading?: boolean
  errorMessage?: string | null
  onRetry?: () => void
  activeId?: number | null
  onRowClick?: (id: number) => void
}

export function ClientTable({
  data,
  isLoading,
  errorMessage,
  onRetry,
  activeId,
  onRowClick,
}: ClientTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { columnOrder, setColumnOrder, handleHeaderDragStart, handleHeaderDrop } = useColumnOrder(
    initialClientTableColumnOrder,
  )

  const table = useReactTable({
    data,
    columns: clientTableColumns,
    state: { sorting, rowSelection, columnOrder },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    getRowId: (row) => String(row.id),
  })

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} style={{ width: table.getTotalSize() }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={styles.headerCell}
                  style={{ width: header.getSize() }}
                  draggable={header.column.id !== 'select'}
                  onDragStart={handleHeaderDragStart(header.column.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleHeaderDrop(header.column.id)}
                >
                  {header.column.getCanSort() ? (
                    <button type="button" onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ''}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                  {header.column.getCanResize() && (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <div
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Změnit šířku sloupce ${String(header.column.columnDef.header)}`}
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                      tabIndex={0}
                      className={styles.resizer}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
              <ClientTableSkeletonRow key={index} columns={table.getVisibleLeafColumns()} />
            ))
          ) : errorMessage ? (
            <tr>
              <td colSpan={clientTableColumns.length} className={styles.stateCell}>
                <AlertPanel
                  icon={XCircle}
                  iconColor="#e5484d"
                  iconBackground="#fdeceb"
                  title="Nepodařilo se načíst data"
                  message={errorMessage}
                  actionLabel={onRetry ? 'Zkusit znovu' : undefined}
                  onAction={onRetry}
                />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={clientTableColumns.length} className={styles.stateCell}>
                <AlertPanel
                  icon={Inbox}
                  iconColor="#2d5c9a"
                  iconBackground="#cde1ff"
                  title="Žádní klienti"
                  message="Nenašli jsme žádné záznamy odpovídající zadaným kritériím."
                />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const isActive = row.original.id === activeId
              const rowClassName = [
                styles.row,
                row.getIsSelected() ? styles.selected : '',
                isActive ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <tr
                  key={row.id}
                  className={rowClassName}
                  onClick={onRowClick ? () => onRowClick(row.original.id) : undefined}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
