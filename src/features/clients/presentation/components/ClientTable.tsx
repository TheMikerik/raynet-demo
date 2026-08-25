import { useClients } from '../hooks/useClients'
import { AsyncValueWidget } from '../../../../shared/components/AsyncValueWidget'

export function ClientTable() {
  const clientsQuery = useClients('')

  return (
    <AsyncValueWidget query={clientsQuery}>
      {(result) => (
        <table>
          <thead>
            <tr>
              <th>Název/Jméno</th>
              <th>Stav</th>
              <th>Vztah</th>
              <th>Rating</th>
              <th>Vlastník</th>
              <th>IČ</th>
              <th>Město</th>
              <th>Kategorie</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((client) => (
              <tr key={client.id}>
                <td>{client.displayName}</td>
                <td>{client.stateLabel}</td>
                <td>{client.roleLabel}</td>
                <td>{client.rating}</td>
                <td>{client.ownerName}</td>
                <td>{client.regNumber}</td>
                <td>{client.city}</td>
                <td>{client.categoryLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AsyncValueWidget>
  )
}
