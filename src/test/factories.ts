import type { RaynetCompany } from '../services/raynet/types/company'
import type { RaynetCompanyDetail } from '../services/raynet/types/company-detail-response'

export function makeRaynetCompany(overrides: Partial<RaynetCompany> = {}): RaynetCompany {
  return {
    id: 1,
    name: 'Acme s.r.o.',
    titleBefore: null,
    firstName: null,
    lastName: null,
    titleAfter: null,
    person: false,
    role: 'A_SUBSCRIBER',
    state: 'B_ACTUAL',
    rating: 'A',
    owner: null,
    regNumber: null,
    taxNumber: null,
    taxNumber2: null,
    taxPayer: null,
    bankAccount: null,
    databox: null,
    court: null,
    primaryAddress: null,
    contactAddress: null,
    category: null,
    turnover: null,
    economyActivity: null,
    companyClassification1: null,
    companyClassification2: null,
    companyClassification3: null,
    legalForm: null,
    paymentTerm: null,
    contactSource: null,
    birthday: null,
    notice: null,
    tags: [],
    customFields: {},
    attachments: null,
    'rowInfo.createdAt': null,
    'rowInfo.createdBy': null,
    'rowInfo.updatedAt': null,
    'rowInfo.updatedBy': null,
    'rowInfo.rowAccess': null,
    'rowInfo.rowState': null,
    securityLevel: null,
    inlineGdpr: [],
    _version: 1,
    ...overrides,
  }
}

export function makeRaynetCompanyDetail(
  overrides: Partial<RaynetCompanyDetail> = {},
): RaynetCompanyDetail {
  return {
    ...makeRaynetCompany(),
    salutation: null,
    employeesNumber: null,
    logo: null,
    socialNetworkContact: null,
    addresses: [],
    originLead: null,
    extIds: null,
    attachments: null,
    ...overrides,
  }
}
