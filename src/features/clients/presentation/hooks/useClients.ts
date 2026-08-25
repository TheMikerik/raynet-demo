import { useQuery } from '@tanstack/react-query'
import { getClients } from '../../data/client.repository'

export function useClients(searchQuery: string) {
  const fulltext = searchQuery.trim() || undefined

  return useQuery({
    queryKey: ['clients', { fulltext }],
    queryFn: () => getClients({ fulltext }),
  })
}
