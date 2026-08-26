import { AppProviders } from './providers'
import { ClientsScreen } from '../features/clients/presentation/components/ClientsScreen'

export function App() {
  return (
    <AppProviders>
      <ClientsScreen />
    </AppProviders>
  )
}
