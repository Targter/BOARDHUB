'use client'

import { useState, useTransition } from 'react'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Plus } from 'lucide-react'
import { createCard } from 'src/actions/card-action'

interface CreateCardFormProps {
  listId: string
}

export function CreateCardForm({ listId }: CreateCardFormProps) {
  const [title, setTitle] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    startTransition(async () => {
      try {
        const result = await createCard({
          title: title.trim(),
          description: '',
          isCompleted: false,
          list: listId
        })

        if (result.error) {
          console.error('Error creating card:', result.error)
        } else {
          setTitle('')
        }
      } catch (error) {
        console.error('Error creating card:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" onMouseDown={(e) => e.stopPropagation()}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter card title..."
        className="text-xs"
        onMouseDown={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        required
      />
      <Button 
        type="submit" 
        size="sm" 
        variant="ghost" 
        className="w-full text-xs"
        disabled={!title.trim()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Plus className="w-3 h-3 mr-1" />
        Add Card
      </Button>
    </form>
  )
} 