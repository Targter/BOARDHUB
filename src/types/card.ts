export interface cardType {
  _id?: string;
  title: string;
  description: string;
  isCompleted: boolean;
  list: any;
  position?: number;
  createdAt?: Date;
  updatedAt?: Date;
} 