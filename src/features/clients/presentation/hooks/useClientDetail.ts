import { useQuery } from '@tanstack/react-query'
import { getClientDetail } from '../../data/client.repository'

export function useClientDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientDetail(id as number),
    enabled: id !== undefined,
  })
}
