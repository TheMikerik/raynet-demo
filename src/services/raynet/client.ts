const RAYNET_PROXY_BASE_PATH = '/api/raynet'

export type RaynetQueryParams = Record<string, string | number | undefined>

export class RaynetApiError extends Error {
  readonly status: number
  readonly body: string

  constructor(status: number, statusText: string, body: string) {
    super(`Raynet API request failed: ${status} ${statusText}`)
    this.name = 'RaynetApiError'
    this.status = status
    this.body = body
  }
}

function buildUrl(path: string, params?: RaynetQueryParams): string {
  const search = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) search.append(key, String(value))
    }
  }
  const query = search.toString()
  return `${RAYNET_PROXY_BASE_PATH}/${path}${query ? `?${query}` : ''}`
}

export async function raynetGet<T>(path: string, params?: RaynetQueryParams): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new RaynetApiError(response.status, response.statusText, await response.text())
  }

  return (await response.json()) as T
}
