import { AppSidebar } from '../../../../shared/components/AppSidebar'
import { ClientTable } from './ClientTable'

export function ClientsScreen() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <h1>Raynet — Master-Detail klientů</h1>
        <ClientTable />
      </main>
    </div>
  )
}
