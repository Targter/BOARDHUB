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
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Crown,
} from "lucide-react";
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
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
            <div className="space-y-3">
              {/* Owner Info Section */}
              {board.owner && (
                <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    {/* <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {board.owner.name || "Owner"}
                    </span> */}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {board.owner.email}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {board.visibility === "public" ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="capitalize">{board.visibility}</span>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>Lists: {board.lists?.length || 0}</p>
                <p>Created: {formatDate(board.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Edit Dialog - unchanged */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {/* ... existing dialog code ... */}
      </Dialog>

      {/* Delete Dialog - unchanged */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/* ... existing dialog code ... */}
      </Dialog>
    </>
  );
};

export default BoardCard;
