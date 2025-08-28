import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UserResponseDto {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
