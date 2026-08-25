import { useMemo, useState } from 'react'
import { AppSidebar } from '../../../../shared/components/AppSidebar'
import { getRaynetErrorInfo } from '../../../../services/raynet/errors'
import { useClients } from '../hooks/useClients'
import type { GetClientsResult } from '../../data/client.repository'
import { ClientTable } from './table/ClientTable'
import { ClientTablePagination } from './table/ClientTablePagination'
import { DevApiStateToggle } from './DevApiStateToggle'
import type { DevApiState } from './DevApiStateToggle'
import styles from './ClientsScreen.module.css'

interface AsyncQueryResult<T> {
  isLoading: boolean
  error: unknown
  data: T | undefined
}

export function ClientsScreen() {
  const [pageSize, setPageSize] = useState(10)
  const [devApiState, setDevApiState] = useState<DevApiState>('real')
  const clientsQuery = useClients('', pageSize)

  const displayedQuery = useMemo<AsyncQueryResult<GetClientsResult>>(() => {
    switch (devApiState) {
      case 'loading':
        return { isLoading: true, error: null, data: undefined }
      case 'error':
        return { isLoading: false, error: new Error('Simulovaná chyba API'), data: undefined }
      case 'empty':
        return { isLoading: false, error: null, data: { items: [], totalCount: 0 } }
      case 'real':
        return clientsQuery
    }
  }, [devApiState, clientsQuery])

  const errorMessage = displayedQuery.error
    ? getRaynetErrorInfo(displayedQuery.error).message
    : null

  function handleRetry() {
    if (devApiState !== 'real') {
      setDevApiState('real')
      return
    }
    void clientsQuery.refetch()
  }

  return (
    <div className={styles.screen}>
      <AppSidebar />
      <main className={styles.content}>
        <h1>Raynet — Master-Detail klientů</h1>
        <ClientTable
          data={displayedQuery.data?.items ?? []}
          isLoading={displayedQuery.isLoading}
          errorMessage={errorMessage}
          onRetry={errorMessage ? handleRetry : undefined}
        />
        <ClientTablePagination
          totalCount={displayedQuery.data?.totalCount ?? 0}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <DevApiStateToggle value={devApiState} onChange={setDevApiState} />
      </main>
    </div>
  )
}
