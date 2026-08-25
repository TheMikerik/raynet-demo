import type { RaynetOwner, RaynetReference, RaynetSecurityLevel } from './common'

export interface RaynetAddressDetail {
  id: number
  city: string | null
  country: string | null
  countryCode: string | null
  name: string | null
  province: string | null
  street: string | null
  zipCode: string | null
  lat: number | null
  lng: number | null
}

export interface RaynetContactInfo {
  primary: boolean
  email: string | null
  email2: string | null
  tel1: string | null
  tel1Type: string | null
  tel2: string | null
  tel2Type: string | null
  fax: string | null
  www: string | null
  otherContact: string | null
  doNotSendMM: boolean
}

export interface RaynetCompanyAddress {
  id: number
  primary: boolean
  contactAddress: boolean
  extIds: unknown | null
  address: RaynetAddressDetail
  contactInfo: RaynetContactInfo
  territory: RaynetReference | null
}

export interface RaynetCompany {
  id: number
  name: string
  titleBefore: string | null
  firstName: string | null
  lastName: string | null
  titleAfter: string | null
  person: boolean
  role: string
  state: string
  rating: string
  owner: RaynetOwner | null
  regNumber: string | null
  taxNumber: string | null
  taxNumber2: string | null
  taxPayer: string | null
  bankAccount: string | null
  databox: string | null
  court: string | null
  primaryAddress: RaynetCompanyAddress | null
  contactAddress: RaynetCompanyAddress | null
  category: RaynetReference | null
  turnover: RaynetReference | null
  economyActivity: RaynetReference | null
  companyClassification1: RaynetReference | null
  companyClassification2: RaynetReference | null
  companyClassification3: RaynetReference | null
  legalForm: RaynetReference | null
  paymentTerm: RaynetReference | null
  contactSource: RaynetReference | null
  birthday: string | null
  notice: string | null
  tags: string[]
  customFields: Record<string, unknown>
  attachments: unknown[] | null
  'rowInfo.createdAt': string | null
  'rowInfo.createdBy': string | null
  'rowInfo.updatedAt': string | null
  'rowInfo.updatedBy': string | null
  'rowInfo.rowAccess': string | null
  'rowInfo.rowState': string | null
  securityLevel: RaynetSecurityLevel | null
  inlineGdpr: unknown[]
  _version: number
}
