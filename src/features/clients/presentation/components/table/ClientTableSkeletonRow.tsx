import type { Column } from '@tanstack/react-table'
import type { ClientListItem } from '../../../domain/client.types'
import styles from './ClientTable.module.css'

export const SKELETON_ROW_COUNT = 10

interface ClientTableSkeletonRowProps {
  columns: Column<ClientListItem, unknown>[]
}

export function ClientTableSkeletonRow({ columns }: ClientTableSkeletonRowProps) {
  return (
    <tr className={styles.row}>
      {columns.map((column) => (
        <td key={column.id} style={{ width: column.getSize() }}>
          {renderSkeletonCell(column.id)}
        </td>
      ))}
    </tr>
  )
}

function renderSkeletonCell(columnId: string) {
  switch (columnId) {
    case 'select':
      return <span className={styles.skeletonBox} />
    case 'ownerName':
      return (
        <span className={styles.owner}>
          <span className={styles.skeletonCircle} />
          <span className={styles.skeletonBar} style={{ width: '80px' }} />
        </span>
      )
    case 'categoryLabel':
      return (
        <div style={{ textAlign: 'center' }}>
          <span className={styles.skeletonPill} />
        </div>
      )
    case 'rating':
      return (
        <div className={styles.alignCenter}>
          <span className={styles.skeletonBar} style={{ width: '28px' }} />
        </div>
      )
    case 'actions':
      return null
    case 'displayName':
      return <span className={styles.skeletonBar} style={{ width: '65%' }} />
    default:
      return <span className={styles.skeletonBar} style={{ width: '50%' }} />
  }
}
