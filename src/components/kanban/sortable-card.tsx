import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from 'src/components/ui/card'

interface SortableCardProps {
  card: any
  onEdit: (card: any) => void
  isUpdating: boolean
}

export function SortableCard({ card, onEdit, isUpdating }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: card._id,
    data: { type: 'card', card },
    disabled: false
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SELECT' ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('button') ||
      target.closest('[contenteditable]') ||
      target.closest('[role="button"]') ||
      target.closest('.no-drag')
    ) {
      e.stopPropagation()
      return
    }
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onMouseDown={handleMouseDown}
    >
      <Card 
        className={`mb-2 cursor-pointer hover:shadow-md transition-all`}
        onClick={(e) => {
          e.stopPropagation()
          onEdit(card)
        }}
      >
        <CardContent className="p-3">
          <p className="text-sm font-medium">{card.title}</p>
          {card.isCompleted && (
            <div className="mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Completed
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 