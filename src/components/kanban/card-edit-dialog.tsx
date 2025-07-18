'use client'

import { useState, useTransition, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Switch } from 'src/components/ui/switch'
import { Label } from 'src/components/ui/label'
import { RichTextEditor } from 'src/components/ui/rich-text-editor'
import { updateCard } from 'src/actions/card-action'

interface CardEditDialogProps {
  card: any
  isOpen: boolean
  onClose: () => void
}

export function CardEditDialog({ card, isOpen, onClose }: CardEditDialogProps) {
  const [title, setTitle] = useState(card?.title || '')
  const [description, setDescription] = useState(card?.description || '')
  const [isCompleted, setIsCompleted] = useState(card?.isCompleted || false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (card) {
      setTitle(card.title || '')
      setDescription(card.description || '')
      setIsCompleted(card.isCompleted || false)
    }
  }, [card])

  const handleSave = () => {
    if (!title.trim()) return

    startTransition(async () => {
      try {
        const result = await updateCard(card._id, {
          title: title.trim(),
          description: description.trim(),
          isCompleted
        })

        if (result.error) {
          console.error('Error updating card:', result.error)
        } else {
          onClose()
        }
      } catch (error) {
        console.error('Error updating card:', error)
      }
    })
  }

  const handleClose = () => {
    setTitle(card?.title || '')
    setDescription(card?.description || '')
    setIsCompleted(card?.isCompleted || false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Enter card description..."
              disabled={false}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="completed"
              checked={isCompleted}
              onCheckedChange={setIsCompleted}
            />
            <Label htmlFor="completed">Mark as completed</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 