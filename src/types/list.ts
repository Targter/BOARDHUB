export interface listType {
  _id?: string;
  title: string;
  boardId: string;
  position: number;
  cards: string[];
  createdAt?: Date;
  updatedAt?: Date;
} 