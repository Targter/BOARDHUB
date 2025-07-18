'use client'

import { useState, useTransition } from 'react'
import { Card, CardHeader } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Plus } from 'lucide-react'
import { createList } from 'src/actions/list-action'

interface CreateListFormProps {
  boardId: string
}

export function CreateListForm({ boardId }: CreateListFormProps) {
  const [title, setTitle] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    startTransition(async () => {
      try {
        const result = await createList({
          title: title.trim(),
          boardId,
          position: Date.now(),
          cards: []
        })

        if (result.error) {
          console.error('Error creating list:', result.error)
        } else {
          setTitle('')
        }
      } catch (error) {
        console.error('Error creating list:', error)
      }
    })
  }

  return (
    <Card className="min-w-[300px] h-fit">
      <CardHeader className="pb-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="text-sm"
            required
          />
          <Button 
            type="submit" 
            size="sm" 
            className="w-full"
            disabled={!title.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add List
          </Button>
        </form>
      </CardHeader>
    </Card>
  )
} 