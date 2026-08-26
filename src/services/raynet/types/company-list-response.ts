import type { RaynetCompany } from './company'

// GET /company/

export interface RaynetCompanyListResponse {
  success: boolean
  totalCount: number
  data: RaynetCompany[]
}
