import { useQuery } from '@tanstack/react-query'
import { getClients } from '../../data/client.repository'

export function useClients(searchQuery: string, limit?: number) {
  const fulltext = searchQuery.trim() || undefined

  return useQuery({
    queryKey: ['clients', { fulltext, limit }],
    queryFn: ({ signal }) => getClients({ fulltext, limit }, signal),
  })
}
