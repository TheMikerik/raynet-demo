import { useQuery } from '@tanstack/react-query'
import { getClientDetail } from '../../data/client.repository'

export function useClientDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: ({ signal }) => getClientDetail(id as number, signal),
    enabled: id !== undefined,
  })
}
