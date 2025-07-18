import React from 'react'
import { getBoardById } from 'src/actions/board-action'
import { getAllListsByBoard } from 'src/actions/list-action'
import { redirect } from 'next/navigation'
import { KanbanBoard } from 'src/components/kanban/kanban-board'

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params

  const boardResult = await getBoardById(boardId)
  if (boardResult.error || !boardResult.data) {
    redirect('/dashboard')
  }

  const boardData = boardResult.data

  const listsResult = await getAllListsByBoard(boardId)
  
  const lists = listsResult.data || []

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-6 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {boardData.title}
        </h1>
      </div>

      <div className="flex-1 min-h-0 px-6 pb-6">
        <KanbanBoard boardId={boardId} lists={lists} />
      </div>
    </div>
  )
}