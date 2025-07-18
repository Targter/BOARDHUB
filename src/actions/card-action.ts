"use server";

import { auth } from "src/auth";
import { connectDB } from "@libs/db/mongoose";
import { cardType } from "src/types/card";
import Card from "@libs/db/models/card-model";
import List from "@libs/db/models/list-model";
import Board from "@libs/db/models/board-model";
import { revalidatePath } from "next/cache";
import { serializeCard } from "@libs/serializers";

const recalculateListPositions = async (listId: string) => {
  try {
    const cards = await Card.find({ list: listId }).sort({ _id: 1 });
    
    for (let i = 0; i < cards.length; i++) {
      await Card.findByIdAndUpdate(cards[i]._id, { position: i });
    }
    
    return true;
  } catch (error) {
    console.error('Error recalculating positions:', error);
    return false;
  }
};

export const repairBoardPositions = async (boardId: string) => {
  const session = await auth();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await connectDB();
    
    const board = await Board.findOne({
      _id: boardId,
      userId: session?.user?.id,
    });

    if (!board) {
      return { success: false, error: "Board not found or unauthorized" };
    }

    const lists = await List.find({ boardId }).sort({ _id: 1 });
    for (let i = 0; i < lists.length; i++) {
      await List.findByIdAndUpdate(lists[i]._id, { position: i });
    }

    for (const list of lists) {
      await recalculateListPositions(list._id);
    }

    revalidatePath(`/dashboard/board/${boardId}`);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error repairing board positions:', error);
    return { success: false, error: "Failed to repair positions" };
  }
};

export const createCard = async (card: cardType) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const list = await List.findById(card.list);
    if (!list) {
      return {
        data: null,
        error: "List not found",
      };
    }

    const board = await Board.findOne({
      _id: list.boardId,
      userId: session?.user?.id,
    });

    if (!board) {
      return {
        data: null,
        error: "Unauthorized to add card to this list",
      };
    }

    const currentPosition = list.cards ? list.cards.length : 0;
    
    const data = await Card.create({ 
      ...card, 
      position: currentPosition 
    });

    if (!data) {
      return {
        data: null,
        error: "Failed to create card",
      };
    }

    await List.findByIdAndUpdate(
      card.list,
      { $push: { cards: data._id } }
    );

    revalidatePath(`/dashboard/board/${board._id}`);

    return {
      data: serializeCard(data),
      error: null,
    };
  } catch (error) {
    console.error('Error creating card:', error);
    return {
      data: null,
      error: "Failed to create card",
    };
  }
};

export const updateCard = async (cardId: string, updates: Partial<cardType>) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const card = await Card.findById(cardId).populate('list');
    if (!card) {
      return {
        data: null,
        error: "Card not found",
      };
    }

    const board = await Board.findOne({
      _id: card.list.boardId,
      userId: session?.user?.id,
    });

    if (!board) {
      return {
        data: null,
        error: "Unauthorized to update this card",
      };
    }

    const data = await Card.findByIdAndUpdate(
      cardId,
      updates,
      { new: true }
    );

    revalidatePath(`/dashboard/board/${board._id}`);

    return {
      data: serializeCard(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to update card",
    };
  }
};

export const getCardById = async (cardId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const card = await Card.findById(cardId).populate('list');
    if (!card) {
      return {
        data: null,
        error: "Card not found",
      };
    }

    const board = await Board.findOne({
      _id: card.list.boardId,
      $or: [
        { userId: session?.user?.id },
        { visibility: 'public' }
      ]
    });

    if (!board) {
      return {
        data: null,
        error: "Card not found",
      };
    }

    return {
      data: serializeCard(card),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get card",
    };
  }
};

export const getAllCardsByList = async (listId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const list = await List.findById(listId);
    if (!list) {
      return {
        data: null,
        error: "List not found",
      };
    }

    const board = await Board.findOne({
      _id: list.boardId,
      $or: [
        { userId: session?.user?.id },
        { visibility: 'public' }
      ]
    });

    if (!board) {
      return {
        data: null,
        error: "Unauthorized to view cards in this list",
      };
    }

    const data = await Card.find({
      list: listId,
    }).sort({ createdAt: 1 });

    return {
      data: data.map(serializeCard),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get cards",
    };
  }
};

export const getAllCardsByBoard = async (boardId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const board = await Board.findOne({
      _id: boardId,
      $or: [
        { userId: session?.user?.id },
        { visibility: 'public' }
      ]
    });

    if (!board) {
      return {
        data: null,
        error: "Board not found",
      };
    }

    const lists = await List.find({ boardId });
    const listIds = lists.map(list => list._id);

    const data = await Card.find({
      list: { $in: listIds }
    }).populate('list').sort({ createdAt: 1 });

    return {
      data: data.map(serializeCard),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get cards",
    };
  }
};

export const deleteCard = async (cardId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
        
    const card = await Card.findById(cardId).populate('list');
    if (!card) {
      return {
        data: null,
        error: "Card not found",
      };
    }

    const board = await Board.findOne({
      _id: card.list.boardId,
      userId: session?.user?.id,
    });

    if (!board) {
      return {
        data: null,
        error: "Unauthorized to delete this card",
      };
    }

    await List.findByIdAndUpdate(
      card.list._id,
      { $pull: { cards: cardId } }
    );

    const data = await Card.findByIdAndDelete(cardId);

    return {
      data: serializeCard(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to delete card",
    };
  }
};

export const moveCardToList = async (cardId: string, newListId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const card = await Card.findById(cardId).populate('list');
    if (!card) {
      return {
        data: null,
        error: "Card not found",
      };
    }

    const oldList = card.list;
    const newList = await List.findById(newListId);
    
    if (!newList) {
      return {
        data: null,
        error: "Target list not found",
      };
    }

    const [oldBoard, newBoard] = await Promise.all([
      Board.findOne({ _id: oldList.boardId, userId: session?.user?.id }),
      Board.findOne({ _id: newList.boardId, userId: session?.user?.id })
    ]);

    if (!oldBoard || !newBoard) {
      return {
        data: null,
        error: "Unauthorized to move this card",
      };
    }

    await List.findByIdAndUpdate(
      oldList._id,
      { $pull: { cards: cardId } }
    );

    await List.findByIdAndUpdate(
      newListId,
      { $push: { cards: cardId } }
    );

    const data = await Card.findByIdAndUpdate(
      cardId,
      { list: newListId },
      { new: true }
    );

    return {
      data: serializeCard(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to move card",
    };
  }
};

export const moveCard = async (
  cardId: string, 
  newListId: string, 
  newPosition: number
) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const card = await Card.findById(cardId).populate('list');
    if (!card) {
      return {
        data: null,
        error: "Card not found",
      };
    }

    const oldListId = card.list._id.toString();
    const oldList = card.list;
    const newList = await List.findById(newListId);
    
    if (!newList) {
      return {
        data: null,
        error: "Target list not found",
      };
    }

    const [oldBoard, newBoard] = await Promise.all([
      Board.findOne({ _id: oldList.boardId, userId: session?.user?.id }),
      Board.findOne({ _id: newList.boardId, userId: session?.user?.id })
    ]);

    if (!oldBoard || !newBoard) {
      return {
        data: null,
        error: "Unauthorized to move this card",
      };
    }

    if (oldListId !== newListId) {
      await Card.findByIdAndUpdate(cardId, { list: newListId });
      
      await List.findByIdAndUpdate(oldListId, { 
        $pull: { cards: cardId } 
      });
      
      const updatedNewList = await List.findById(newListId);
      let newCardsArray = [...(updatedNewList.cards || [])];
      
      const safePosition = Math.min(Math.max(0, newPosition), newCardsArray.length);
      newCardsArray.splice(safePosition, 0, cardId);
      
      await List.findByIdAndUpdate(newListId, {
        cards: newCardsArray
      });
      
      for (let i = 0; i < newCardsArray.length; i++) {
        await Card.findByIdAndUpdate(newCardsArray[i], { position: i });
      }
      
      const updatedOldList = await List.findById(oldListId);
      if (updatedOldList && updatedOldList.cards) {
        for (let i = 0; i < updatedOldList.cards.length; i++) {
          await Card.findByIdAndUpdate(updatedOldList.cards[i], { position: i });
        }
      }
      
    } else {
      
      const currentList = await List.findById(newListId);
      let cardsArray = [...(currentList.cards || [])];
      
      const currentIndex = cardsArray.findIndex(id => id.toString() === cardId);
      if (currentIndex === -1) {
        return { data: null, error: "Card not found in list" };
      }
      
      const safePosition = Math.min(Math.max(0, newPosition), cardsArray.length - 1);
      
      if (currentIndex === safePosition) {
        return { data: serializeCard(card), error: null };
      }
      
      const [movedCardId] = cardsArray.splice(currentIndex, 1);
      cardsArray.splice(safePosition, 0, movedCardId);
      
      await List.findByIdAndUpdate(newListId, {
        cards: cardsArray
      });
      
      for (let i = 0; i < cardsArray.length; i++) {
        await Card.findByIdAndUpdate(cardsArray[i], { position: i });
      }
    }

    const updatedCard = await Card.findById(cardId).populate('list');

    revalidatePath(`/dashboard/board/${oldBoard._id}`);
    if (oldBoard._id.toString() !== newBoard._id.toString()) {
      revalidatePath(`/dashboard/board/${newBoard._id}`);
    }

    return {
      data: serializeCard(updatedCard),
      error: null,
    };
  } catch (error) {
    console.error('Error moving card:', error);
    return {
      data: null,
      error: "Failed to move card",
    };
  }
};

export const syncCardPositions = async (listId: string) => {
  const session = await auth();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await connectDB();
    
    const list = await List.findById(listId);
    if (!list) {
      return { success: false, error: "List not found" };
    }

    const board = await Board.findOne({
      _id: list.boardId,
      userId: session?.user?.id,
    });

    if (!board) {
      return { success: false, error: "Unauthorized" };
    }

    if (list.cards && list.cards.length > 0) {
      for (let i = 0; i < list.cards.length; i++) {
        await Card.findByIdAndUpdate(list.cards[i], { position: i });
      }
    }

    revalidatePath(`/dashboard/board/${board._id}`);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error syncing card positions:', error);
    return { success: false, error: "Failed to sync positions" };
  }
};
