export type RaynetCompanySortColumn =
  'id' | 'rowInfo.createdAt' | 'rowInfo.updatedAt' | 'rowInfo.lastModifiedAt' | 'name' | 'regNumber'

export type RaynetSortDirection = 'ASC' | 'DESC'

export interface RaynetCompanyListParams {
  fulltext?: string
  limit?: number
  offset?: number
  sortColumn?: RaynetCompanySortColumn
  sortDirection?: RaynetSortDirection
}
