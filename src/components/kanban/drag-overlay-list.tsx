import { Card, CardContent, CardHeader } from 'src/components/ui/card'

interface DragOverlayListProps {
  list: any
}

export function DragOverlayList({ list }: DragOverlayListProps) {
  return (
    <Card className="min-w-[300px] max-w-[300px] h-fit opacity-90 rotate-2 shadow-2xl border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">{list.title}</h3>
          </div>
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        </div>
        <div className="text-xs text-blue-700">
          {list.cards?.length || 0} cards
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-96 overflow-hidden min-h-[50px] p-2 rounded-md bg-blue-100">
          {list.cards?.slice(0, 3).map((card: any, index: number) => (
            <div key={card._id} className="bg-white p-2 rounded text-xs opacity-80 border border-blue-200">
              {card.title}
            </div>
          ))}
          {list.cards?.length > 3 && (
            <div className="text-xs text-blue-600 text-center font-medium">
              +{list.cards.length - 3} more cards
            </div>
          )}
          {(!list.cards || list.cards.length === 0) && (
            <div className="text-xs text-blue-500 text-center py-4">
              Empty list
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 