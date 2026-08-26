import type { Column } from '@tanstack/react-table'
import type { ClientListItem } from '../../../domain/client.types'
import styles from './ClientTable.module.css'

export const SKELETON_ROW_COUNT = 10

interface ClientTableSkeletonRowProps {
  columns: Column<ClientListItem, unknown>[]
  rowIndex: number
}

const WIDTH_VARIANTS = [90, 70, 55, 80, 60]

function variedWidth(rowIndex: number, columnIndex: number, base: number) {
  const factor = WIDTH_VARIANTS[(rowIndex + columnIndex) % WIDTH_VARIANTS.length]
  return `${Math.round((base * factor) / 100)}px`
}

export function ClientTableSkeletonRow({ columns, rowIndex }: ClientTableSkeletonRowProps) {
  return (
    <tr className={styles.row}>
      {columns.map((column, columnIndex) => (
        <td key={column.id} style={{ width: column.getSize() }}>
          {renderSkeletonCell(column.id, rowIndex, columnIndex)}
        </td>
      ))}
    </tr>
  )
}

function renderSkeletonCell(columnId: string, rowIndex: number, columnIndex: number) {
  switch (columnId) {
    case 'select':
      return <span className={styles.skeletonBox} />
    case 'displayName':
      return (
        <span
          className={styles.skeletonBar}
          style={{ width: variedWidth(rowIndex, columnIndex, 200) }}
        />
      )
    case 'stateLabel':
      return (
        <span
          className={styles.skeletonBar}
          style={{ width: variedWidth(rowIndex, columnIndex, 70) }}
        />
      )
    case 'roleLabel':
      return (
        <span
          className={styles.skeletonBar}
          style={{ width: variedWidth(rowIndex, columnIndex, 80) }}
        />
      )
    case 'rating':
      return (
        <div className={styles.alignCenter}>
          <span className={styles.skeletonBar} style={{ width: '24px' }} />
        </div>
      )
    case 'ownerName':
      return (
        <span className={styles.owner}>
          <span className={styles.skeletonCircle} />
          <span
            className={styles.skeletonBar}
            style={{ width: variedWidth(rowIndex, columnIndex, 90) }}
          />
        </span>
      )
    case 'regNumber':
      return (
        <span
          className={styles.skeletonBar}
          style={{ width: variedWidth(rowIndex, columnIndex, 75) }}
        />
      )
    case 'city':
      return (
        <span
          className={styles.skeletonBar}
          style={{ width: variedWidth(rowIndex, columnIndex, 85) }}
        />
      )
    case 'categoryLabel':
      return (
        <div style={{ textAlign: 'center' }}>
          <span className={styles.skeletonPill} />
        </div>
      )
    case 'actions':
      return (
        <div className={styles.alignCenter}>
          <span className={styles.skeletonActionBox} />
        </div>
      )
    default:
      return <span className={styles.skeletonBar} style={{ width: '50%' }} />
  }
}
