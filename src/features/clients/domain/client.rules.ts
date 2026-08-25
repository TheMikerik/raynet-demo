import type { ClientAddress } from './client.types'

const ROLE_LABELS: Record<string, string> = {
  A_SUBSCRIBER: 'Odběratel',
  B_PARTNER: 'Partner',
  C_SUPPLIER: 'Dodavatel',
  D_RIVAL: 'Konkurent',
}

const STATE_LABELS: Record<string, string> = {
  A_POTENTIAL: 'Potenciální',
  B_ACTUAL: 'Aktuální',
  C_DEFERRED: 'Odložný',
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

function stripDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function categoryColor(categoryLabel: string): CategoryColor {
  const normalized = stripDiacritics(categoryLabel).toLowerCase()
  if (normalized.includes('zlut')) return 'yellow'
  if (normalized.includes('zelen')) return 'green'
  if (normalized.includes('modr')) return 'blue'
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
