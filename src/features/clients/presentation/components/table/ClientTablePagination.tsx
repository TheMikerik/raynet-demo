import styles from './ClientTable.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200]

interface ClientTablePaginationProps {
  totalCount: number
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
}

export function ClientTablePagination({
  totalCount,
  pageSize,
  onPageSizeChange,
}: ClientTablePaginationProps) {
  return (
    <div className={styles.footer}>
      <span className={styles.footerItem}>
        <span className={styles.footerLabel}>Počet</span> <strong>{totalCount}</strong>
      </span>
      <label className={styles.footerItem}>
        <span className={styles.footerLabel}>Na stránce</span>
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
