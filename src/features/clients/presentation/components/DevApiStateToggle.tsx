import styles from './DevApiStateToggle.module.css'

export type DevApiState = 'real' | 'loading' | 'error' | 'empty'

interface DevApiStateToggleProps {
  value: DevApiState
  onChange: (state: DevApiState) => void
}

const OPTIONS: { state: DevApiState; label: string }[] = [
  { state: 'error', label: 'API Error' },
  { state: 'loading', label: 'API Loading' },
  { state: 'empty', label: 'API Empty' },
  { state: 'real', label: 'Real API' },
]

export function DevApiStateToggle({ value, onChange }: DevApiStateToggleProps) {
  return (
    <div className={styles.stack}>
      {OPTIONS.map((option) => (
        <button
          key={option.state}
          type="button"
          className={value === option.state ? `${styles.button} ${styles.active}` : styles.button}
          onClick={() => onChange(option.state)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
