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

export class RaynetNetworkError extends Error {
  constructor(cause: unknown) {
    super('Could not reach the Raynet proxy.', { cause })
    this.name = 'RaynetNetworkError'
  }
}

export interface RaynetErrorInfo {
  message: string
  status?: number
}

export function getRaynetErrorInfo(error: unknown): RaynetErrorInfo {
  if (error instanceof RaynetApiError) {
    return { message: describeApiError(error), status: error.status }
  }
  if (error instanceof RaynetNetworkError) {
    return { message: 'Nepodařilo se připojit k serveru. Zkontroluj internetové připojení.' }
  }
  return { message: 'Nastala neočekávaná chyba.' }
}

function describeApiError(error: RaynetApiError): string {
  const parsedMessage = tryParseErrorMessage(error.body)
  if (parsedMessage) return parsedMessage

  if (error.status === 429) {
    return 'Raynet API je dočasně nedostupné (vyčerpaný limit požadavků). Zkus to prosím za chvíli.'
  }

  return `Server vrátil chybu (${error.status}).`
}

function tryParseErrorMessage(body: string): string | null {
  try {
    const parsed: unknown = JSON.parse(body)
    if (typeof parsed !== 'object' || parsed === null) return null

    const record = parsed as Record<string, unknown>
    if (typeof record.message === 'string') return record.message
    if (typeof record.error === 'string') return record.error
    return null
  } catch {
    return null
  }
}
