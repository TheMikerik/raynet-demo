export interface ClientListItem {
  id: number
  displayName: string
  state: string
  stateLabel: string
  role: string
  roleLabel: string
  rating: string
  ownerName: string | null
  regNumber: string | null
  city: string | null
  categoryLabel: string | null
}

export interface ClientAddress {
  street: string | null
  city: string | null
  zipCode: string | null
  country: string | null
  lat: number | null
  lng: number | null
}

export interface ClientDetail extends ClientListItem {
  address: ClientAddress | null
  mapUrl: string | null
  notice: string | null
  tags: string[]
}
