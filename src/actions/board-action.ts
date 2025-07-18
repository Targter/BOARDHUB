"use server";

import { auth } from "src/auth";
import { connectDB } from "@libs/db/mongoose";
import { boardType } from "src/types/board";
import Board from "@libs/db/models/board-model";
import { revalidatePath } from "next/cache";
import { serializeBoard } from "@libs/serializers";

export const createBoard = async (board: boardType) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const data = await Board.create({
      ...board,
      userId: session?.user?.id,
      visibility:board.visibility || "private"
    });

    if (!data) {
      return {
        data: null,
        error: "Failed to create board",
      };
    }

    revalidatePath("/dashboard");
    
    return {
      data: serializeBoard(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to create board",
    };
  }
};

export const updateBoard = async (boardId: string, updates: Partial<boardType>) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const data = await Board.findOneAndUpdate(
      { _id: boardId, userId: session?.user?.id },
      updates,
      { new: true }
    );


       
    if (!data) {
      return {
        data: null,
        error: "Board not found or unauthorized",
      };
    }

    revalidatePath("/dashboard");
    
    return {
      data: serializeBoard(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to update board",
    };
  }
};

export const getAllBoards = async (includePublic: boolean = false) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    
    const query = includePublic 
      ? {
          $or: [  // Use $or instead of $and
            { userId: session?.user?.id },  // User's own boards (private or public)
            { visibility: 'public' }        // Plus all public boards from others
          ]
        }
      : { userId: session?.user?.id };  // Just user's own boards when includePublic is false

    const data = await Board.find(query).sort({ createdAt: -1 });

    return {
      data: data.map(serializeBoard).filter((board): board is NonNullable<typeof board> => board !== null),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get boards",
    };
  }
};
export const getBoardById = async (boardId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const data = await Board.findOne({
      _id: boardId,
        $or: [
        { userId: session?.user?.id },
        { visibility: 'public' }
      ]
    });

    if (!data) {
      return {
        data: null,
        error: "Board not found or unauthorized",
      };
    }

    return {
      data: serializeBoard(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to get board",
    };
  }
};

export const deleteBoard = async (boardId: string) => {
  const session = await auth();

  if (!session) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const data = await Board.findOneAndDelete({
      _id: boardId,
      userId: session?.user?.id,
    });

    if (!data) {
      return {
        data: null,
        error: "Board not found or unauthorized",
      };
    }

    revalidatePath("/dashboard");
    
    return {
      data: serializeBoard(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to delete board",
    };
  }
};