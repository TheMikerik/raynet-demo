import { useMemo, useState } from 'react'
import { AppSidebar } from '../../../../shared/components/AppSidebar'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { getRaynetErrorInfo } from '../../../../services/raynet/errors'
import { useClients } from '../hooks/useClients'
import type { GetClientsResult } from '../../data/client.repository'
import { SearchInput } from './SearchInput'
import { ClientTable } from './table/ClientTable'
import { ClientTablePagination } from './table/ClientTablePagination'
import { ClientDetailPanel } from './detail/ClientDetailPanel'
import { DevApiStateToggle } from './DevApiStateToggle'
import type { DevApiState } from './DevApiStateToggle'
import styles from './ClientsScreen.module.css'

const MIN_SEARCH_LENGTH = 3
const SEARCH_DEBOUNCE_MS = 600

interface AsyncQueryResult<T> {
  isLoading: boolean
  error: unknown
  data: T | undefined
}

export function ClientsScreen() {
  const [pageSize, setPageSize] = useState(10)
  const [devApiState, setDevApiState] = useState<DevApiState>('real')
  const [searchInput, setSearchInput] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const debouncedSearchInput = useDebounce(searchInput, SEARCH_DEBOUNCE_MS)
  const searchQuery =
    debouncedSearchInput.trim().length >= MIN_SEARCH_LENGTH ? debouncedSearchInput.trim() : ''
  const clientsQuery = useClients(searchQuery, pageSize)

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
        <div className={styles.header}>
          <h1 className={styles.title}>Master-Detail klientů</h1>
          <SearchInput value={searchInput} onChange={setSearchInput} />
        </div>
        <div className={styles.body}>
          <div className={styles.master}>
            <ClientTable
              data={displayedQuery.data?.items ?? []}
              isLoading={displayedQuery.isLoading}
              errorMessage={errorMessage}
              onRetry={errorMessage ? handleRetry : undefined}
              activeId={selectedClientId}
              onRowClick={setSelectedClientId}
            />
          </div>
          <ClientDetailPanel clientId={selectedClientId} />
        </div>
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
