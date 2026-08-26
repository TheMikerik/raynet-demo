import { buildMapUrl, translateRole, translateState } from '../domain/client.rules'
import type { ClientAddress, ClientDetail, ClientListItem } from '../domain/client.types'
import type { RaynetCompany, RaynetCompanyAddress } from '../../../services/raynet/types/company'
import type { RaynetCompanyDetail } from '../../../services/raynet/types/company-detail-response'

function resolveDisplayName(company: RaynetCompany): string {
  if (!company.person) return company.name
  const fullName = [company.firstName, company.lastName].filter(Boolean).join(' ').trim()
  return fullName || company.name
}

function mapAddress(companyAddress: RaynetCompanyAddress | null): ClientAddress | null {
  if (!companyAddress) return null
  const { address } = companyAddress
  return {
    street: address.street,
    city: address.city,
    zipCode: address.zipCode,
    country: address.country,
    lat: address.lat,
    lng: address.lng,
  }
}

export function mapCompanyToListItem(company: RaynetCompany): ClientListItem {
  return {
    id: company.id,
    displayName: resolveDisplayName(company),
    state: company.state,
    stateLabel: translateState(company.state),
    role: company.role,
    roleLabel: translateRole(company.role),
    rating: company.rating,
    ownerName: company.owner?.fullName ?? null,
    regNumber: company.regNumber,
    city: company.primaryAddress?.address.city ?? null,
    categoryLabel: company.category?.value ?? null,
  }
}

export function mapCompanyToDetail(company: RaynetCompanyDetail): ClientDetail {
  const address = mapAddress(company.primaryAddress)

  return {
    ...mapCompanyToListItem(company),
    address,
    mapUrl: buildMapUrl(address),
    notice: company.notice,
    tags: company.tags,
  }
}
