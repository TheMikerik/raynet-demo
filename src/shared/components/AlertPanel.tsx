import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import styles from './AlertPanel.module.css'

interface AlertPanelProps {
  icon: ComponentType<LucideProps>
  iconColor: string
  iconBackground: string
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function AlertPanel({
  icon: Icon,
  iconColor,
  iconBackground,
  title,
  message,
  actionLabel,
  onAction,
}: AlertPanelProps) {
  return (
    <div className={styles.content}>
      <div className={styles.iconWrap} style={{ backgroundColor: iconBackground }}>
        <Icon size={34} color={iconColor} strokeWidth={2} />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button type="button" className={styles.actionButton} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
