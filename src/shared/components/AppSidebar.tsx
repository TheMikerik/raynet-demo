import {
  Search,
  Cloud,
  AtSign,
  Calendar,
  Users,
  DollarSign,
  Clock,
  FileText,
  BarChart2,
} from 'lucide-react'
import styles from './AppSidebar.module.css'

const ICONS = [Search, Cloud, AtSign, Calendar, Users, DollarSign, Clock, FileText, BarChart2]

export function AppSidebar() {
  return (
    <nav className={styles.sidebar} aria-label="Hlavní navigace">
      {ICONS.map((Icon, index) => (
        <button key={index} type="button" className={styles.iconButton}>
          <Icon size={20} />
        </button>
      ))}
    </nav>
  )
}
