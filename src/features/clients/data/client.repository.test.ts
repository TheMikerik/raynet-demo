import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeRaynetCompany, makeRaynetCompanyDetail } from '../../../test/factories'

const raynetGet = vi.fn()
vi.mock('../../../services/raynet/client', () => ({
  raynetGet: (...args: unknown[]) => raynetGet(...args),
}))

const { getClientDetail, getClients } = await import('./client.repository')

afterEach(() => {
  vi.clearAllMocks()
})

describe('getClients', () => {
  it('maps the response items and total count', async () => {
    raynetGet.mockResolvedValueOnce({
      data: [
        makeRaynetCompany({ id: 1, name: 'Acme' }),
        makeRaynetCompany({ id: 2, name: 'Beta' }),
      ],
      totalCount: 2,
    })

    const result = await getClients({ fulltext: 'ac' })

    expect(result.totalCount).toBe(2)
    expect(result.items.map((item) => item.displayName)).toEqual(['Acme', 'Beta'])
  })

  it('forwards query params to raynetGet', async () => {
    raynetGet.mockResolvedValueOnce({ data: [], totalCount: 0 })

    await getClients({ fulltext: 'acme', limit: 10, offset: 20 })

    expect(raynetGet).toHaveBeenCalledWith(
      'company',
      {
        fulltext: 'acme',
        limit: 10,
        offset: 20,
        sortColumn: undefined,
        sortDirection: undefined,
      },
      undefined,
    )
  })
})

describe('getClientDetail', () => {
  it('fetches a company by id and maps it to a detail model', async () => {
    raynetGet.mockResolvedValueOnce({ data: makeRaynetCompanyDetail({ id: 42, name: 'Acme' }) })

    const result = await getClientDetail(42)

    expect(raynetGet).toHaveBeenCalledWith('company/42', undefined, undefined)
    expect(result.id).toBe(42)
    expect(result.displayName).toBe('Acme')
  })
})
