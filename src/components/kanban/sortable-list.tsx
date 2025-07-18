import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader } from 'src/components/ui/card'
import { EditableListTitle } from './editable-list-title'
import { ListActions } from './list-actions'
import { CreateCardForm } from './create-card-form'
import { SortableCard } from './sortable-card'

interface SortableListProps {
  list: any
  boardId: string
  onEditCard: (card: any) => void
  updatingCards: Set<string>
  isUpdating: boolean
}

export function SortableList({ 
  list, 
  boardId, 
  onEditCard, 
  updatingCards,
  isUpdating 
}: SortableListProps) {
  const cardIds = list.cards?.map((card: any) => card._id) || []
  
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging: isListDragging,
  } = useSortable({ 
    id: list._id,
    data: { type: 'list', list },
    disabled: false
  })

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: `droppable-${list._id}`,
    data: { type: 'list', list }
  })

  const listStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isListDragging ? 0.5 : 1,
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
      ref={setSortableNodeRef} 
      style={listStyle} 
      {...attributes} 
      {...listeners}
      onMouseDown={handleMouseDown}
    >
      <Card className={`min-w-[300px] max-w-[300px] h-fit transition-all ${
        isListDragging ? 'shadow-2xl scale-105' : 'hover:shadow-lg'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-col gap-1 cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded transition-colors">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 no-drag">
                <EditableListTitle 
                  listId={list._id} 
                  currentTitle={list.title}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 no-drag">
              <div onClick={(e) => e.stopPropagation()}>
                <ListActions 
                  listId={list._id} 
                />
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground ml-6">
            {list.cards?.length || 0} cards
          </div>
        </CardHeader>
        <CardContent className="pt-0 no-drag" onClick={(e) => e.stopPropagation()}>
          <div 
            ref={setDroppableNodeRef}
            className={`space-y-2 max-h-96 overflow-y-auto min-h-[50px] p-2 rounded-md transition-colors ${
              isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : ''
            }`}
          >
            <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
              {list.cards?.map((card: any) => (
                <SortableCard 
                  key={card._id} 
                  card={card} 
                  onEdit={onEditCard}
                  isUpdating={false}
                />
              ))}
            </SortableContext>
            
            <CreateCardForm listId={list._id} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 