export class User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
