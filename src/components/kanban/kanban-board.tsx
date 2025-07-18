'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card, CardContent, CardHeader } from 'src/components/ui/card'
import { CreateListForm } from './create-list-form'
import { CardEditDialog } from './card-edit-dialog'
import { DragOverlayCard } from './drag-overlay-card'
import { DragOverlayList } from './drag-overlay-list'
import { SortableList } from './sortable-list'
import { moveCard } from 'src/actions/card-action'
import { moveList } from 'src/actions/list-action'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  useDroppable,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface KanbanBoardProps {
  boardId: string
  lists: any[]
}

export function KanbanBoard({ boardId, lists: initialLists }: KanbanBoardProps) {
  const [editingCard, setEditingCard] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<any>(null)
  const [lists, setLists] = useState(initialLists)
  const [updatingCards, setUpdatingCards] = useState<Set<string>>(new Set())
  const [updatingLists, setUpdatingLists] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    setLists(initialLists)
  }, [initialLists])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement
      
      if (
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.contentEditable === 'true' ||
        activeElement?.closest('input') ||
        activeElement?.closest('textarea') ||
        activeElement?.closest('[contenteditable]')
      ) {
         if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'Backspace'].includes(e.key)) {
           e.stopPropagation()
         }
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    })
  )

  const listIds = lists.map(list => list._id)

  const handleEditCard = (card: any) => {
    setEditingCard(card)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCard(null)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeData = active.data.current
    
    if (activeData?.type === 'card') {
      setActiveItem({ type: 'card', item: activeData.card })
    } else if (activeData?.type === 'list') {
      setActiveItem({ type: 'list', item: activeData.list })
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === 'list' && overData?.type === 'list') {
      const activeIndex = lists.findIndex(list => list._id === active.id)
      const overIndex = lists.findIndex(list => list._id === over.id)

      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        const newLists = arrayMove(lists, activeIndex, overIndex)
        setLists(newLists)

        setUpdatingLists(prev => new Set(prev.add(active.id as string)))

        startTransition(async () => {
          try {
            await moveList(active.id as string, overIndex)
            router.refresh()
          } catch (error) {
            console.error('Failed to move list:', error)
            setLists(lists)
          } finally {
            setUpdatingLists(prev => {
              const newSet = new Set(prev)
              newSet.delete(active.id as string)
              return newSet
            })
          }
        })
      }
      return
    }

    if (activeData?.type === 'list' && over.id.toString().startsWith('droppable-')) {
      const targetListId = over.id.toString().replace('droppable-', '')
      const activeIndex = lists.findIndex(list => list._id === active.id)
      const overIndex = lists.findIndex(list => list._id === targetListId)

      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        const newLists = arrayMove(lists, activeIndex, overIndex)
        setLists(newLists)

        setUpdatingLists(prev => new Set(prev.add(active.id as string)))

        startTransition(async () => {
          try {
            await moveList(active.id as string, overIndex)
            router.refresh()
          } catch (error) {
            console.error('Failed to move list:', error)
            setLists(lists)
          } finally {
            setUpdatingLists(prev => {
              const newSet = new Set(prev)
              newSet.delete(active.id as string)
              return newSet
            })
          }
        })
      }
      return
    }

    if (activeData?.type === 'card') {
      const activeCard = activeData.card
      const activeList = findListByCardId(active.id as string)
      
      let overList = null
      let overIndex = 0

      if (overData?.type === 'list') {
        overList = overData.list
        overIndex = overList.cards?.length || 0
      } else if (overData?.type === 'card') {
        overList = findListByCardId(over.id as string)
        overIndex = overList?.cards?.findIndex((card: any) => card._id === over.id) || 0
      } else {
        overList = lists.find(list => over.id === `droppable-${list._id}`)
        overIndex = overList?.cards?.length || 0
      }

      if (!activeList || !overList) return

      const activeIndex = activeList.cards.findIndex((card: any) => card._id === active.id)

      const newLists = [...lists]
      const activeListIndex = newLists.findIndex(list => list._id === activeList._id)
      const overListIndex = newLists.findIndex(list => list._id === overList._id)

      if (activeList._id === overList._id) {
        if (activeIndex !== overIndex) {
          const reorderedCards = arrayMove(newLists[activeListIndex].cards, activeIndex, overIndex)
          newLists[activeListIndex] = { ...newLists[activeListIndex], cards: reorderedCards }
          setLists(newLists)
          
          setUpdatingCards(prev => new Set(prev.add(active.id as string)))

          startTransition(async () => {
            try {
              await moveCard(active.id as string, overList._id, overIndex)
              router.refresh()
            } catch (error) {
              console.error('Failed to move card:', error)
              setLists(lists)
            } finally {
              setUpdatingCards(prev => {
                const newSet = new Set(prev)
                newSet.delete(active.id as string)
                return newSet
              })
            }
          })
        }
      } else {
        const movedCard = activeList.cards[activeIndex]
        
        newLists[activeListIndex] = {
          ...newLists[activeListIndex],
          cards: newLists[activeListIndex].cards.filter((card: any) => card._id !== active.id)
        }
        
        const targetCards = [...newLists[overListIndex].cards]
        targetCards.splice(overIndex, 0, movedCard)
        newLists[overListIndex] = {
          ...newLists[overListIndex],
          cards: targetCards
        }
        
        setLists(newLists)
        
        setUpdatingCards(prev => new Set(prev.add(active.id as string)))

        startTransition(async () => {
          try {
            await moveCard(active.id as string, overList._id, overIndex)
            router.refresh()
          } catch (error) {
            console.error('Failed to move card:', error)
            setLists(lists)
          } finally {
            setUpdatingCards(prev => {
              const newSet = new Set(prev)
              newSet.delete(active.id as string)
              return newSet
            })
          }
        })
      }
    }
  }

  const findCardById = (id: string) => {
    for (const list of lists) {
      const card = list.cards?.find((card: any) => card._id === id)
      if (card) return card
    }
    return null
  }

  const findListByCardId = (cardId: string) => {
    return lists.find(list => list.cards?.some((card: any) => card._id === cardId))
  }

  const findListById = (listId: string) => {
    return lists.find(list => list._id === listId)
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-6 pb-6 w-max min-h-full pr-6">
            <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
            {lists.map((list: any, index: number) => (
              <div key={list._id} className="flex items-start gap-3">
                {index === 0 && (
                  <div 
                    className={`w-2 h-full min-h-[200px] rounded-lg transition-all ${
                      activeItem?.type === 'list' ? 'bg-blue-100 border-2 border-dashed border-blue-300' : 'bg-transparent'
                    }`}
                  />
                )}
                
                <SortableList 
                  list={list} 
                  boardId={boardId} 
                  onEditCard={handleEditCard}
                  updatingCards={updatingCards}
                  isUpdating={false}
                />
                
                <div 
                  className={`w-2 h-full min-h-[200px] rounded-lg transition-all ${
                    activeItem?.type === 'list' ? 'bg-blue-100 border-2 border-dashed border-blue-300' : 'bg-transparent'
                  }`}
                />
              </div>
            ))}
          </SortableContext>
          
          <CreateListForm 
            boardId={boardId} 
          />
            </div>
          </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeItem?.type === 'card' ? (
            <DragOverlayCard card={activeItem.item} />
          ) : activeItem?.type === 'list' ? (
            <DragOverlayList list={activeItem.item} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardEditDialog
        card={editingCard}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  )
} 