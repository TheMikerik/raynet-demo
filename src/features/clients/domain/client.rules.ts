import type { ClientAddress } from './client.types'

const ROLE_LABELS: Record<string, string> = {
  A_SUBSCRIBER: 'Odběratel',
  B_PARTNER: 'Partner',
  C_SUPPLIER: 'Dodavatel',
  D_RIVAL: 'Konkurent',
  E_OWN: 'Vlastní firma',
}

const STATE_LABELS: Record<string, string> = {
  A_POTENTIAL: 'Potenciální',
  B_ACTUAL: 'Aktuální',
  C_DEFERRED: 'Odložený',
  D_UNATTRACTIVE: 'Nezajímavý',
}

export function translateRole(role: string): string {
  return ROLE_LABELS[role] ?? role
}

export function translateState(state: string): string {
  return STATE_LABELS[state] ?? state
}

export type StateColor = 'gray' | 'gold' | 'green' | 'red'

const STATE_COLORS: Record<string, StateColor> = {
  A_POTENTIAL: 'gold',
  B_ACTUAL: 'green',
  C_DEFERRED: 'gray',
  D_UNATTRACTIVE: 'red',
}

export function stateColor(state: string): StateColor {
  return STATE_COLORS[state] ?? 'gray'
}

export type CategoryColor = 'yellow' | 'green' | 'blue' | 'red'

export function categoryColor(categoryLabel: string): CategoryColor {
  const normalized = categoryLabel.toLowerCase()
  if (normalized.includes('rcp')) return 'yellow'
  if (normalized.includes('mvp')) return 'green'
  if (normalized.includes('mvvm')) return 'blue'
  return 'red'
}

export function buildMapUrl(address: ClientAddress | null): string | null {
  if (!address) return null

  if (address.lat !== null && address.lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`
  }

  const parts = [address.street, address.city, address.zipCode, address.country].filter(
    (part): part is string => Boolean(part),
  )
  if (parts.length === 0) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(', '))}`
}
