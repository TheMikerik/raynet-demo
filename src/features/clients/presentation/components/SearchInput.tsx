import { Search, X } from 'lucide-react'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <Search className={styles.icon} size={18} strokeWidth={2} aria-hidden="true" />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? 'Hledat klienty…'}
        aria-label="Hledat klienty"
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange('')}
          aria-label="Vymazat hledání"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
