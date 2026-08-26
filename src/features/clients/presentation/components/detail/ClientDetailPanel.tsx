import DOMPurify from 'dompurify'
import { Building2, Hash, MapPin, User, XCircle } from 'lucide-react'
import { AlertPanel } from '../../../../../shared/components/AlertPanel'
import { getRaynetErrorInfo } from '../../../../../services/raynet/errors'
import { useClientDetail } from '../../hooks/useClientDetail'
import { categoryColor, stateColor } from '../../../domain/client.rules'
import styles from './ClientDetailPanel.module.css'

interface ClientDetailPanelProps {
  clientId: number | null
}

export function ClientDetailPanel({ clientId }: ClientDetailPanelProps) {
  const { data, isLoading, error, refetch } = useClientDetail(clientId ?? undefined)

  if (clientId === null) {
    return (
      <aside className={styles.panel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <User size={24} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p>Vyberte klienta v tabulce pro zobrazení detailu.</p>
        </div>
      </aside>
    )
  }

  if (isLoading) {
    return (
      <aside className={styles.panel}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.skeletonLogo} />
            <div className={styles.headerText}>
              <div className={`${styles.skeletonBar} ${styles.skeletonTitle}`} />
              <div className={`${styles.skeletonBar} ${styles.skeletonPill}`} />
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.infoCol}>
            {[0, 1, 2].map((row) => (
              <div key={row} className={styles.infoRow}>
                <div className={styles.skeletonIcon} />
                <div className={styles.infoRowBody}>
                  <div className={`${styles.skeletonBar} ${styles.skeletonLabel}`} />
                  <div className={`${styles.skeletonBar} ${styles.skeletonValue}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  if (error) {
    return (
      <aside className={styles.panel}>
        <AlertPanel
          icon={XCircle}
          iconColor="#e5484d"
          iconBackground="#fdeceb"
          title="Nepodařilo se načíst detail"
          message={getRaynetErrorInfo(error).message}
          actionLabel="Zkusit znovu"
          onAction={() => void refetch()}
        />
      </aside>
    )
  }

  if (!data) return <aside className={styles.panel} />

  return (
    <aside className={styles.panel}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Building2 size={28} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className={styles.headerText}>
            <h2 className={styles.title}>{data.displayName}</h2>
            <div className={styles.badges}>
              {data.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
              <span
                className={`${styles.statusPill} ${styles[`status-${stateColor(data.state)}`]}`}
              >
                <span className={styles.statusDot} />
                {data.stateLabel} · {data.roleLabel}
              </span>
              {data.categoryLabel && (
                <span
                  className={`${styles.categoryBadge} ${styles[`badge-${categoryColor(data.categoryLabel)}`]}`}
                >
                  {data.categoryLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.infoGrid}>
          <div className={styles.infoCol}>
            {data.regNumber && (
              <div className={styles.infoRow}>
                <Hash size={16} className={styles.infoIcon} aria-hidden="true" />
                <div className={styles.infoRowBody}>
                  <div className={styles.infoLabel}>IČ</div>
                  <div className={styles.infoValue}>{data.regNumber}</div>
                </div>
              </div>
            )}

            {data.ownerName && (
              <div className={styles.infoRow}>
                <User size={16} className={styles.infoIcon} aria-hidden="true" />
                <div className={styles.infoRowBody}>
                  <div className={styles.infoLabel}>Vlastník</div>
                  <div className={styles.infoValue}>{data.ownerName}</div>
                </div>
              </div>
            )}
          </div>

          {data.address && (
            <div className={styles.infoCol}>
              <div className={styles.infoRow}>
                <MapPin size={16} className={styles.infoIcon} aria-hidden="true" />
                <div className={styles.infoRowBody}>
                  <div className={styles.infoLabel}>Adresa</div>
                  <div className={styles.infoValue}>
                    {data.address.street && (
                      <span className={styles.addressLine}>{data.address.street}</span>
                    )}
                    {(data.address.zipCode || data.address.city) && (
                      <span className={styles.addressLine}>
                        {[data.address.zipCode, data.address.city].filter(Boolean).join(' ')}
                      </span>
                    )}
                    {data.address.country && (
                      <span className={styles.addressLine}>{data.address.country}</span>
                    )}
                    {data.mapUrl && (
                      <a
                        className={styles.mapLink}
                        href={data.mapUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Zobrazit na mapě
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {data.notice && (
          <div className={styles.noticeSection}>
            <h3 className={styles.sectionLabel}>Poznámka</h3>
            <div
              className={styles.notice}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.notice) }}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
