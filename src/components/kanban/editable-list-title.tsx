'use client'

import { useState, useTransition } from 'react'
import { Input } from 'src/components/ui/input'
import { updateList } from 'src/actions/list-action'

interface EditableListTitleProps {
  listId: string
  currentTitle: string
}

export function EditableListTitle({ 
  listId, 
  currentTitle
}: EditableListTitleProps) {
  const [title, setTitle] = useState(currentTitle)
  const [isPending, startTransition] = useTransition()

  const handleBlur = () => {
    if (title.trim() !== currentTitle && title.trim()) {
      startTransition(async () => {
        try {
          const result = await updateList(listId, { title: title.trim() })
          
          if (result.error) {
            console.error('Error updating list title:', result.error)
            setTitle(currentTitle)
          } else {
          }
        } catch (error) {
          console.error('Error updating list title:', error)
          setTitle(currentTitle)
        }
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      setTitle(currentTitle)
      e.currentTarget.blur()
    }
  }

  return (
    <Input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => e.stopPropagation()}
      onFocus={(e) => e.stopPropagation()}
      className="border-0 p-0 h-auto bg-transparent text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
      disabled={isPending}
    />
  )
} 