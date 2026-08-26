import styles from './ClientDetailPanel.module.css'

export function ClientDetailSkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.skeletonLogo} />
        <div className={styles.headerText}>
          <div className={`${styles.skeletonBar} ${styles.skeletonTitle}`} />
          <div className={styles.badges}>
            <span className={styles.skeletonBadge} style={{ width: '56px' }} />
            <span className={styles.skeletonBadge} style={{ width: '92px' }} />
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.infoGrid}>
        <div className={styles.infoCol}>
          <div className={styles.infoRow}>
            <div className={styles.skeletonIcon} />
            <div className={styles.infoRowBody}>
              <div className={`${styles.skeletonBar} ${styles.skeletonLabel}`} />
              <div
                className={`${styles.skeletonBar} ${styles.skeletonValue}`}
                style={{ width: '55%' }}
              />
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.skeletonIcon} />
            <div className={styles.infoRowBody}>
              <div className={`${styles.skeletonBar} ${styles.skeletonLabel}`} />
              <div
                className={`${styles.skeletonBar} ${styles.skeletonValue}`}
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>

        <div className={styles.infoCol}>
          <div className={styles.infoRow}>
            <div className={styles.skeletonIcon} />
            <div
              className={styles.infoRowBody}
              style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              <div className={`${styles.skeletonBar} ${styles.skeletonLabel}`} />
              <div className={styles.skeletonBar} style={{ width: '80%' }} />
              <div className={styles.skeletonBar} style={{ width: '60%' }} />
              <div className={styles.skeletonBar} style={{ width: '45%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.noticeSection}>
        <div
          className={`${styles.skeletonBar} ${styles.skeletonLabel}`}
          style={{ width: '80px' }}
        />
        <div className={styles.skeletonNotice}>
          <div className={styles.skeletonBar} style={{ width: '95%' }} />
          <div className={styles.skeletonBar} style={{ width: '80%' }} />
          <div className={styles.skeletonBar} style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}
