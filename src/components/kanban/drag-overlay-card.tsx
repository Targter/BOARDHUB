import { Card, CardContent } from 'src/components/ui/card'

interface DragOverlayCardProps {
  card: any
}

export function DragOverlayCard({ card }: DragOverlayCardProps) {
  return (
    <Card className="mb-2 cursor-pointer hover:shadow-md transition-shadow opacity-50 rotate-5">
      <CardContent className="p-3">
        <p className="text-sm font-medium">{card.title}</p>
        {card.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.description}</p>
        )}
        {card.isCompleted && (
          <div className="mt-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Completed
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 