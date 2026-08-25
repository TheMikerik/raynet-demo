import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, User } from 'lucide-react'
import type { ClientListItem } from '../../../domain/client.types'
import { categoryColor, stateColor } from '../../../domain/client.rules'
import styles from './ClientTable.module.css'

const columnHelper = createColumnHelper<ClientListItem>()

export const clientTableColumns: ColumnDef<ClientListItem, string>[] = [
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

export const initialClientTableColumnOrder = clientTableColumns.map((column) => column.id as string)
