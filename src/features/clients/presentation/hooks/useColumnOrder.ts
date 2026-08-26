import { useState } from 'react'
import type { DragEvent } from 'react'

export function useColumnOrder(initialOrder: string[]) {
  const [columnOrder, setColumnOrder] = useState<string[]>(initialOrder)

  function moveColumn(draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    setColumnOrder((prev) => {
      const next = prev.filter((id) => id !== draggedId)
      next.splice(next.indexOf(targetId), 0, draggedId)
      return next
    })
  }

  function handleHeaderDragStart(columnId: string) {
    return (event: DragEvent<HTMLTableCellElement>) => {
      event.dataTransfer.setData('text/plain', columnId)
    }
  }

  function handleHeaderDrop(columnId: string) {
    return (event: DragEvent<HTMLTableCellElement>) => {
      event.preventDefault()
      moveColumn(event.dataTransfer.getData('text/plain'), columnId)
    }
  }

  return { columnOrder, setColumnOrder, handleHeaderDragStart, handleHeaderDrop }
}
