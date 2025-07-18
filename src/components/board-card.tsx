"use client";

import React, { useState } from "react";
import { boardType } from "src/types/board";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface BoardCardProps {
  board: boardType;
  onEdit: (board: boardType) => void;
  onDelete: (boardId: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onEdit, onDelete }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: board.title,
    backgroundColor: board.backgroundColor,
    visibility: board.visibility,
  });

  const handleEditSubmit = () => {
    onEdit({
      ...board,
      ...editForm,
    });
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (board._id) {
      onDelete(board._id);
    }
    setIsDeleteOpen(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    // Use explicit formatting to ensure consistency
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // DD/MM/YYYY format
  };

  return (
    <>
      <Link href={`/dashboard/board/${board._id}`} className="block">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
          <CardHeader
            className="pb-2"
            style={{ backgroundColor: board.backgroundColor }}
          >
            <div className="flex justify-between items-start">
              <CardTitle className="text-white text-lg font-semibold truncate">
                {board.title}
              </CardTitle>
              <div onClick={(e) => e.preventDefault()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {board.visibility === "public" ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="capitalize">{board.visibility}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Lists: {board.lists?.length || 0}</p>
                <p>Created: {formatDate(board.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>
              Make changes to your board here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Board title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="backgroundColor" className="text-sm font-medium">
                Background Color
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={editForm.backgroundColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditForm((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={editForm.backgroundColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditForm((prev) => ({
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
              <label htmlFor="visibility" className="text-sm font-medium">
                Visibility
              </label>
              <Select
                value={editForm.visibility}
                onValueChange={(value: "public" | "private") =>
                  setEditForm((prev) => ({ ...prev, visibility: value }))
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
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{board.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoardCard;
