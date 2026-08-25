import { AppProviders } from './providers'
import { ClientTable } from '../features/clients/presentation/components/ClientTable'

export function App() {
  return (
    <AppProviders>
      <main>
        <h1>Raynet — Master-Detail klientů</h1>
        <ClientTable />
      </main>
    </AppProviders>
  )
}
