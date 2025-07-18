"use server";

import { auth } from "src/auth";
import { connectDB } from "@libs/db/mongoose";
import { listType } from "src/types/list";
import List from "@libs/db/models/list-model";
import Board from "@libs/db/models/board-model";
import Card from "@libs/db/models/card-model";
import { revalidatePath } from "next/cache";
import { serializeList } from "@libs/serializers";


export const createList = async (list: listType) => {
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
      _id: list.boardId,
      userId: session?.user?.id,
    });

    if (!board) {
      return {
        data: null,
        error: "Board not found or unauthorized",
      };
    }

    const listsCount = await List.countDocuments({ boardId: list.boardId });
    
    const data = await List.create({ 
      ...list, 
      position: listsCount 
    });

    if (!data) {
      return {
        data: null,
        error: "Failed to create list",
      };
    }

    await Board.findByIdAndUpdate(
      list.boardId,
      { $push: { lists: data._id } }
    );

    revalidatePath(`/dashboard/board/${list.boardId}`);

    return {
      data: serializeList(data),
      error: null,
    };
  } catch (error) {
    console.error('Error creating list:', error);
    return {
      data: null,
      error: "Failed to create list",
    };
  }
};

export const updateList = async (listId: string, updates: Partial<listType>) => {
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
      userId: session?.user?.id,
    });

    if (!board) {
      return {
        data: null,
        error: "Unauthorized to update this list",
      };
    }

    const data = await List.findByIdAndUpdate(
      listId,
      updates,
      { new: true }
    );

    revalidatePath(`/dashboard/board/${list.boardId}`);

    return {
      data: serializeList(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to update list",
    };
  }
};

export const getListById = async (listId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const list = await List.findById(listId).populate('cards');
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
        error: "List not found",
      };
    }

    return {
      data: serializeList(list),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get list",
    };
  }
};

export const getAllListsByBoard = async (boardId: string) => {
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

    const data = await List.find({
      boardId: boardId,
    }).populate({
      path: 'cards'
    }).sort({ position: 1 });

    return {
      data: data.map(serializeList),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get lists",
    };
  }
};

export const getAllLists = async () => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const userBoards = await Board.find({
      userId: session?.user?.id,
    });

    const boardIds = userBoards.map(board => board._id);

    const data = await List.find({
      boardId: { $in: boardIds }
    }).populate('cards').sort({ position: 1 });

    return {
      data: data.map(serializeList),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get lists",
    };
  }
};

export const deleteList = async (listId: string) => {
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
      userId: session?.user?.id,
    });

    if (!board) {
      return {
        data: null,
        error: "Unauthorized to delete this list",
      };
    }

    await Card.deleteMany({
      list: listId
    });

    await Board.findByIdAndUpdate(
      list.boardId,
      { $pull: { lists: listId } }
    );

    const data = await List.findByIdAndDelete(listId);

    revalidatePath(`/dashboard/board/${list.boardId}`);

    return {
      data: serializeList(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to delete list",
    };
  }
};

export const moveList = async (listId: string, newPosition: number) => {
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
      userId: session?.user?.id,
    });

    if (!board) {
      return {
        data: null,
        error: "Unauthorized to move this list",
      };
    }

    const boardLists = await List.find({ boardId: list.boardId }).sort({ position: 1 });
    
    const movedListIndex = boardLists.findIndex(l => l._id.toString() === listId);
    if (movedListIndex === -1) {
      return { data: null, error: "List not found in board" };
    }
    
    const [movedList] = boardLists.splice(movedListIndex, 1);
    
    const insertPosition = Math.min(Math.max(0, newPosition), boardLists.length);
    boardLists.splice(insertPosition, 0, movedList);
    
    for (let i = 0; i < boardLists.length; i++) {
      await List.findByIdAndUpdate(boardLists[i]._id, { position: i });
    }

    const updatedList = await List.findById(listId);

    revalidatePath(`/dashboard/board/${list.boardId}`);

    return {
      data: serializeList(updatedList),
      error: null,
    };
  } catch (error) {
    console.error('Error moving list:', error);
    return {
      data: null,
      error: "Failed to move list",
    };
  }
};