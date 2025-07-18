"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { boardType } from "src/types/board";
import {
  createBoard,
  updateBoard,
  deleteBoard,
} from "src/actions/board-action";
import BoardCard from "src/components/board-card";
import { Button } from "src/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

interface DashboardBoardsProps {
  initialBoards: boardType[];
  error: string | null;
}

const DashboardBoards = ({ initialBoards, error }: DashboardBoardsProps) => {
  console.log("initialBOard:", initialBoards);
  const router = useRouter();
  const [boards, setBoards] = useState<boardType[]>(initialBoards);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    backgroundColor: "#3b82f6",
    visibility: "private" as "public" | "private",
  });

  useEffect(() => {
    setBoards(initialBoards);
  }, [initialBoards]);

  const handleEditBoard = async (updatedBoard: boardType) => {
    try {
      if (!updatedBoard._id) return;

      const { data, error } = await updateBoard(updatedBoard._id, {
        title: updatedBoard.title,
        backgroundColor: updatedBoard.backgroundColor,
        visibility: updatedBoard.visibility,
      });

      if (error) {
        console.error("Error updating board:", error);
        return;
      }

      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board._id === updatedBoard._id ? { ...board, ...data } : board
        )
      );
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const { error } = await deleteBoard(boardId);

      if (error) {
        console.error("Error deleting board:", error);
        return;
      }

      setBoards((prevBoards) =>
        prevBoards.filter((board) => board._id !== boardId)
      );
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const handleCreateBoard = () => {
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      setLoading(true);

      const { data, error } = await createBoard({
        title: createForm.title,
        backgroundColor: createForm.backgroundColor,
        visibility: createForm.visibility,
        lists: [],
      });

      console.log("data, error", data);

      if (error) {
        console.error("Error creating board:", error);
        return;
      }

      if (data) {
        setBoards((prevBoards) => [data, ...prevBoards]);
      }

      setCreateForm({
        title: "",
        backgroundColor: "#3b82f6",
        visibility: "private",
      });
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
    } finally {
      setLoading(false);
    }
  };

  if (error && boards.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-end items-center mb-10">
          <Button onClick={handleCreateBoard}>
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Error loading boards
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end items-center mb-10">
        <Button onClick={handleCreateBoard} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            No boards found
          </h2>
          <p className="text-muted-foreground mb-4">
            Create your first board to get started
          </p>
          <Button onClick={handleCreateBoard} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onEdit={handleEditBoard}
              onDelete={handleDeleteBoard}
            />
          ))}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>
              Create a new board to organize your tasks and projects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="create-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="create-title"
                value={createForm.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCreateForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter board title"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="create-backgroundColor"
                className="text-sm font-medium"
              >
                Background Color
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  id="create-backgroundColor"
                  type="color"
                  value={createForm.backgroundColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={createForm.backgroundColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="create-visibility"
                className="text-sm font-medium"
              >
                Visibility
              </label>
              <Select
                value={createForm.visibility}
                onValueChange={(value: "public" | "private") =>
                  setCreateForm((prev) => ({ ...prev, visibility: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={!createForm.title.trim() || loading}
            >
              {loading ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardBoards;
