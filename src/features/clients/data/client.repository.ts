import { raynetGet } from '../../../services/raynet/client'
import type { RaynetCompanyDetailResponse } from '../../../services/raynet/types/company-detail-response'
import type { RaynetCompanyListParams } from '../../../services/raynet/types/company-list-params'
import type { RaynetCompanyListResponse } from '../../../services/raynet/types/company-list-response'
import type { ClientDetail, ClientListItem } from '../domain/client.types'
import { mapCompanyToDetail, mapCompanyToListItem } from './client.mapper'

export interface GetClientsResult {
  items: ClientListItem[]
  totalCount: number
}

export async function getClients(params: RaynetCompanyListParams = {}): Promise<GetClientsResult> {
  const response = await raynetGet<RaynetCompanyListResponse>('company', {
    fulltext: params.fulltext,
    limit: params.limit,
    offset: params.offset,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
  })

  return {
    items: response.data.map(mapCompanyToListItem),
    totalCount: response.totalCount,
  }
}

export async function getClientDetail(id: number): Promise<ClientDetail> {
  const response = await raynetGet<RaynetCompanyDetailResponse>(`company/${id}`)
  return mapCompanyToDetail(response.data)
}
