export type RoleType = 'user' | 'admin';

export interface userType {
  _id?: string;
  name: string;
  email: string;
  image: string;
  password?: string;
  role?: RoleType;
  createdAt?: Date;
  updatedAt?: Date;
}
