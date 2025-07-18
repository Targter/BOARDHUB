// Helper functions to serialize MongoDB objects to plain objects

export const serializeCard = (card: any) => {
  if (!card) return null;
  
  return {
    _id: card._id?.toString() || '',
    title: card.title || '',
    description: card.description || '',
    isCompleted: card.isCompleted || false,
    position: card.position || 0,
    list: card.list?.toString() || '',
    createdAt: card.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: card.updatedAt?.toISOString() || new Date().toISOString(),
    __v: card.__v || 0
  };
};

export const serializeList = (list: any) => {
  if (!list) return null;
  
  return {
    _id: list._id?.toString() || '',
    title: list.title || '',
    boardId: list.boardId?.toString() || '',
    position: list.position || 0,
    cards: list.cards?.map((card: any) => serializeCard(card)) || [],
    createdAt: list.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: list.updatedAt?.toISOString() || new Date().toISOString(),
    __v: list.__v || 0
  };
};

export const serializeBoard = (board: any) => {
  if (!board) return null;
  
  return {
    _id: board._id?.toString() || '',
    title: board.title || '',
    backgroundColor: board.backgroundColor || '#3b82f6',
    visibility: board.visibility || 'private',
    userId: board.userId?.toString() || '',
    lists: board.lists?.map((id: any) => id.toString()) || [],
    createdAt: board.createdAt ? new Date(board.createdAt) : new Date(),
    updatedAt: board.updatedAt ? new Date(board.updatedAt) : new Date(),
  };
}; 