import type { ReactNode } from 'react'
import { getRaynetErrorInfo } from '../../services/raynet/errors'

interface AsyncQueryResult<T> {
  isLoading: boolean
  error: unknown
  data: T | undefined
}

interface AsyncValueWidgetProps<T> {
  query: AsyncQueryResult<T>
  children: (data: T) => ReactNode
  formatError?: (error: unknown) => string
}

export function AsyncValueWidget<T>({
  query: { isLoading, error, data },
  children,
  formatError = (err) => getRaynetErrorInfo(err).message,
}: AsyncValueWidgetProps<T>) {
  if (isLoading) return <p>Načítám...</p>
  if (error) return <p>Chyba: {formatError(error)}</p>
  if (data === undefined) return null

  return <>{children(data)}</>
}
