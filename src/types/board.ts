export interface boardType {
  _id?: string;
  userId?: string;
  title: string;

  backgroundColor: string;
  visibility: 'public' | 'private';
  lists: string[];
  createdAt?: Date;
  updatedAt?: Date;
  owner?:{
    name:string,
    email:string,
  }
  
} 