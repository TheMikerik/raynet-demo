import { RaynetApiError, RaynetNetworkError } from './errors'

const RAYNET_PROXY_BASE_PATH = '/api/raynet'

export type RaynetQueryParams = Record<string, string | number | undefined>

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
  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
  } catch (cause) {
    throw new RaynetNetworkError(cause)
  }

  if (!response.ok) {
    throw new RaynetApiError(response.status, response.statusText, await response.text())
  }

  return (await response.json()) as T
}
