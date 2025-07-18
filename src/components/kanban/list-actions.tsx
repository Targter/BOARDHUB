'use client'

import { useTransition } from 'react'
import { Button } from 'src/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteList } from 'src/actions/list-action'

interface ListActionsProps {
  listId: string
}

export function ListActions({ listId }: ListActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      startTransition(async () => {
        try {
          const result = await deleteList(listId)
          
          if (result.error) {
            console.error('Error deleting list:', result.error)
          } else {
          }
        } catch (error) {
          console.error('Error deleting list:', error)
        }
      })
    }
  }

  return (
    <Button 
      onClick={handleDelete}
      size="sm" 
      variant="ghost" 
      className="h-6 w-6 p-0"
      disabled={isPending}
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  )
} 