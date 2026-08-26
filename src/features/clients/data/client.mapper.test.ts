import { describe, expect, it } from 'vitest'
import { makeRaynetCompany, makeRaynetCompanyDetail } from '../../../test/factories'
import { mapCompanyToDetail, mapCompanyToListItem } from './client.mapper'

describe('mapCompanyToListItem', () => {
  it('uses the company name for a non-person company', () => {
    const item = mapCompanyToListItem(makeRaynetCompany({ name: 'Acme s.r.o.', person: false }))
    expect(item.displayName).toBe('Acme s.r.o.')
  })

  it('uses first + last name for a person', () => {
    const item = mapCompanyToListItem(
      makeRaynetCompany({ person: true, firstName: 'Jan', lastName: 'Novák', name: 'fallback' }),
    )
    expect(item.displayName).toBe('Jan Novák')
  })

  it('falls back to the company name when a person has no first/last name', () => {
    const item = mapCompanyToListItem(
      makeRaynetCompany({ person: true, firstName: null, lastName: null, name: 'fallback' }),
    )
    expect(item.displayName).toBe('fallback')
  })

  it('translates role and state to Czech labels', () => {
    const item = mapCompanyToListItem(
      makeRaynetCompany({ role: 'B_PARTNER', state: 'A_POTENTIAL' }),
    )
    expect(item.roleLabel).toBe('Partner')
    expect(item.stateLabel).toBe('Potenciální')
  })

  it('falls back to the raw code for an unknown role/state', () => {
    const item = mapCompanyToListItem(makeRaynetCompany({ role: 'X_UNKNOWN', state: 'Y_UNKNOWN' }))
    expect(item.roleLabel).toBe('X_UNKNOWN')
    expect(item.stateLabel).toBe('Y_UNKNOWN')
  })

  it('maps owner name, city and category from nested optional fields', () => {
    const item = mapCompanyToListItem(
      makeRaynetCompany({
        owner: { id: 1, fullName: 'Petr Vlastník' },
        primaryAddress: {
          id: 1,
          primary: true,
          contactAddress: false,
          extIds: null,
          address: {
            id: 1,
            city: 'Praha',
            country: 'CZ',
            countryCode: 'CZ',
            name: null,
            province: null,
            street: 'Hlavní 1',
            zipCode: '11000',
            lat: null,
            lng: null,
          },
          contactInfo: {
            primary: true,
            email: null,
            email2: null,
            tel1: null,
            tel1Type: null,
            tel2: null,
            tel2Type: null,
            fax: null,
            www: null,
            otherContact: null,
            doNotSendMM: false,
          },
          territory: null,
        },
        category: { id: 1, value: 'MVP' },
      }),
    )
    expect(item.ownerName).toBe('Petr Vlastník')
    expect(item.city).toBe('Praha')
    expect(item.categoryLabel).toBe('MVP')
  })

  it('maps missing optional fields to null', () => {
    const item = mapCompanyToListItem(makeRaynetCompany())
    expect(item.ownerName).toBeNull()
    expect(item.city).toBeNull()
    expect(item.categoryLabel).toBeNull()
  })
})

describe('mapCompanyToDetail', () => {
  it('includes list fields plus address, mapUrl, notice and tags', () => {
    const detail = mapCompanyToDetail(
      makeRaynetCompanyDetail({
        notice: 'Poznámka',
        tags: ['vip', 'test'],
        primaryAddress: {
          id: 1,
          primary: true,
          contactAddress: false,
          extIds: null,
          address: {
            id: 1,
            city: 'Praha',
            country: 'CZ',
            countryCode: 'CZ',
            name: null,
            province: null,
            street: 'Hlavní 1',
            zipCode: '11000',
            lat: 50.0755,
            lng: 14.4378,
          },
          contactInfo: {
            primary: true,
            email: null,
            email2: null,
            tel1: null,
            tel1Type: null,
            tel2: null,
            tel2Type: null,
            fax: null,
            www: null,
            otherContact: null,
            doNotSendMM: false,
          },
          territory: null,
        },
      }),
    )

    expect(detail.address).toEqual({
      street: 'Hlavní 1',
      city: 'Praha',
      zipCode: '11000',
      country: 'CZ',
      lat: 50.0755,
      lng: 14.4378,
    })
    expect(detail.mapUrl).toBe('https://www.google.com/maps/search/?api=1&query=50.0755,14.4378')
    expect(detail.notice).toBe('Poznámka')
    expect(detail.tags).toEqual(['vip', 'test'])
  })

  it('maps a null address to a null address and mapUrl', () => {
    const detail = mapCompanyToDetail(makeRaynetCompanyDetail({ primaryAddress: null }))
    expect(detail.address).toBeNull()
    expect(detail.mapUrl).toBeNull()
  })
})
