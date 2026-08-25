import type { RaynetReference } from './common'
import type { RaynetCompany, RaynetCompanyAddress } from './company'

// GET /company/{companyId}/

export interface RaynetFile {
  id: number
  contentType: string
  fileName: string
  size: number
}

export interface RaynetAttachment {
  id: number
  link: string | null
  linkName: string | null
  file: RaynetFile | null
  folder: string | null
  folderId: number | null
}

export interface RaynetSocialNetworkContact {
  facebook: string | null
  googleplus: string | null
  twitter: string | null
  linkedin: string | null
  pinterest: string | null
  instagram: string | null
  skype: string | null
  youtube: string | null
}

export interface RaynetOriginLead {
  id: number
  code: string
  topic: string
}

export interface RaynetCompanyDetail extends RaynetCompany {
  salutation: string | null
  employeesNumber: RaynetReference | null
  logo: RaynetFile | null
  socialNetworkContact: RaynetSocialNetworkContact | null
  addresses: RaynetCompanyAddress[]
  originLead: RaynetOriginLead | null
  extIds: unknown | null
  attachments: RaynetAttachment[] | null
}

export interface RaynetCompanyDetailResponse {
  success: boolean
  data: RaynetCompanyDetail
}
