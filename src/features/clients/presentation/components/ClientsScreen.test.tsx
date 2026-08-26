import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ClientDetail, ClientListItem } from '../../domain/client.types'

const getClients = vi.fn()
const getClientDetail = vi.fn()
vi.mock('../../data/client.repository', () => ({
  getClients: (...args: unknown[]) => getClients(...args),
  getClientDetail: (...args: unknown[]) => getClientDetail(...args),
}))

const { ClientsScreen } = await import('./ClientsScreen')

function makeListItem(overrides: Partial<ClientListItem> = {}): ClientListItem {
  return {
    id: 1,
    displayName: 'Acme s.r.o.',
    state: 'B_ACTUAL',
    stateLabel: 'Aktuální',
    role: 'A_SUBSCRIBER',
    roleLabel: 'Odběratel',
    rating: 'A',
    ownerName: null,
    regNumber: null,
    city: null,
    categoryLabel: null,
    ...overrides,
  }
}

function makeDetail(overrides: Partial<ClientDetail> = {}): ClientDetail {
  return {
    ...makeListItem(),
    address: null,
    mapUrl: null,
    notice: null,
    tags: [],
    ...overrides,
  }
}

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ClientsScreen />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('ClientsScreen', () => {
  it('renders the list of clients returned by the API', async () => {
    getClients.mockResolvedValue({
      items: [
        makeListItem({ id: 1, displayName: 'Acme s.r.o.' }),
        makeListItem({ id: 2, displayName: 'Beta a.s.' }),
      ],
      totalCount: 2,
    })

    renderScreen()

    expect(await screen.findByText('Acme s.r.o.')).toBeInTheDocument()
    expect(screen.getByText('Beta a.s.')).toBeInTheDocument()
  })

  it('filters clients by search query after debounce', async () => {
    const user = userEvent.setup()
    getClients.mockResolvedValue({
      items: [makeListItem({ id: 1, displayName: 'Acme s.r.o.' })],
      totalCount: 1,
    })

    renderScreen()
    await screen.findByText('Acme s.r.o.')
    getClients.mockClear()

    await user.type(screen.getByLabelText('Hledat klienty'), 'acme')

    await waitFor(
      () => {
        expect(getClients).toHaveBeenCalledWith(
          expect.objectContaining({ fulltext: 'acme' }),
          expect.any(AbortSignal),
        )
      },
      { timeout: 2000 },
    )
  })

  it('shows the client detail when a row is clicked', async () => {
    const user = userEvent.setup()
    getClients.mockResolvedValue({
      items: [makeListItem({ id: 1, displayName: 'Acme s.r.o.' })],
      totalCount: 1,
    })
    getClientDetail.mockResolvedValue(
      makeDetail({ id: 1, displayName: 'Acme s.r.o.', notice: 'VIP klient' }),
    )

    renderScreen()
    const row = (await screen.findByText('Acme s.r.o.')).closest('tr')
    expect(row).not.toBeNull()

    await user.click(row as HTMLElement)

    await waitFor(() => expect(getClientDetail).toHaveBeenCalledWith(1, expect.any(AbortSignal)))
    expect(await screen.findByText('VIP klient')).toBeInTheDocument()
  })

  it('shows an error state instead of a blank page when the API fails', async () => {
    getClients.mockRejectedValue(new Error('boom'))

    renderScreen()

    expect(await screen.findByText('Nepodařilo se načíst data')).toBeInTheDocument()
    expect(screen.getByText('Nastala neočekávaná chyba.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zkusit znovu' })).toBeInTheDocument()
  })
})
