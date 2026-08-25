import { useState } from 'react'
import type { DragEvent } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, User } from 'lucide-react'
import { useClients } from '../hooks/useClients'
import { AsyncValueWidget } from '../../../../shared/components/AsyncValueWidget'
import type { ClientListItem } from '../../domain/client.types'
import { categoryColor, stateColor } from '../../domain/client.rules'
import styles from './ClientTable.module.css'

const columnHelper = createColumnHelper<ClientListItem>()

const columns: ColumnDef<ClientListItem, string>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className={styles.checkbox}
        aria-label="Označit vše"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className={styles.checkbox}
        aria-label={`Označit ${row.original.displayName}`}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    enableResizing: false,
    size: 50,
  },
  columnHelper.accessor('displayName', {
    id: 'displayName',
    header: 'Název/Jméno',
    cell: (info) => <strong>{info.getValue()}</strong>,
    size: 275,
  }),
  columnHelper.accessor('stateLabel', {
    id: 'stateLabel',
    header: 'Stav',
    cell: (info) => (
      <span className={styles[`state-${stateColor(info.row.original.state)}`]}>
        {info.getValue()}
      </span>
    ),
    size: 130,
  }),
  columnHelper.accessor('roleLabel', { id: 'roleLabel', header: 'Vztah', size: 120 }),
  columnHelper.accessor('rating', {
    id: 'rating',
    header: 'Rating',
    size: 80,
    cell: (info) => <div className={styles.alignCenter}>{info.getValue()}</div>,
  }),
  columnHelper.accessor((row) => row.ownerName ?? '', {
    id: 'ownerName',
    header: 'Vlastník',
    cell: (info) => {
      const ownerName = info.row.original.ownerName
      if (!ownerName) return null
      return (
        <span className={styles.owner}>
          <span className={styles.avatar}>
            <User size={14} aria-hidden="true" />
          </span>
          <strong>{ownerName}</strong>
        </span>
      )
    },
    size: 170,
  }),
  columnHelper.accessor((row) => row.regNumber ?? '', { id: 'regNumber', header: 'IČ', size: 120 }),
  columnHelper.accessor((row) => row.city ?? '', { id: 'city', header: 'Město', size: 120 }),
  columnHelper.accessor((row) => row.categoryLabel ?? '', {
    id: 'categoryLabel',
    header: 'Kategorie',
    cell: (info) => {
      const categoryLabel = info.row.original.categoryLabel
      if (!categoryLabel) return null
      return (
        <div style={{ textAlign: 'center' }}>
          <span className={`${styles.badge} ${styles[`badge-${categoryColor(categoryLabel)}`]}`}>
            {categoryLabel}
          </span>
        </div>
      )
    },
    size: 120,
  }),
  {
    id: 'actions',
    header: () => (
      <button type="button" className={styles.rowAction} aria-label="Upravit sloupce">
        <Pencil size={14} />
      </button>
    ),
    cell: () => (
      <button type="button" className={styles.rowAction} aria-label="Další akce">
        <MoreHorizontal size={14} />
      </button>
    ),
    enableSorting: false,
    enableResizing: false,
    size: 60,
  },
]

const initialColumnOrder = columns.map((column) => column.id as string)

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200]

export function ClientTable() {
  const [pageSize, setPageSize] = useState(50)
  const clientsQuery = useClients('', pageSize)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder)

  const table = useReactTable({
    data: clientsQuery.data?.items ?? [],
    columns,
    state: { sorting, rowSelection, columnOrder },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    getRowId: (row) => String(row.id),
  })

  function moveColumn(draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    setColumnOrder((prev) => {
      const next = prev.filter((id) => id !== draggedId)
      next.splice(next.indexOf(targetId), 0, draggedId)
      return next
    })
  }

  function handleHeaderDragStart(columnId: string) {
    return (event: DragEvent<HTMLTableCellElement>) => {
      event.dataTransfer.setData('text/plain', columnId)
    }
  }

  function handleHeaderDrop(columnId: string) {
    return (event: DragEvent<HTMLTableCellElement>) => {
      event.preventDefault()
      moveColumn(event.dataTransfer.getData('text/plain'), columnId)
    }
  }

  return (
    <AsyncValueWidget query={clientsQuery}>
      {(data) => (
        <>
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
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.getIsSelected() ? `${styles.row} ${styles.selected}` : styles.row
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.footer}>
            <span className={styles.footerItem}>
              <span className={styles.footerLabel}>Počet</span> <strong>{data.totalCount}</strong>
            </span>
            <label className={styles.footerItem}>
              <span className={styles.footerLabel}>Na stránce</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
    </AsyncValueWidget>
  )
}
