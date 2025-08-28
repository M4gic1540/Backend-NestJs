import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/common/prisma.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// Mock PrismaService
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),

      };

      const userResponse = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),

      };

      // Mock para verificar que no existen usuarios
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null); // username check

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'User',
        },
      });
      expect(result).toEqual(userResponse);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };

      const existingUser = { id: 1, email: 'test@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('Email already exists')
      );
    });

    it('should throw ConflictException when username already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };

      const existingUser = { id: 1, username: 'testuser' };
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(existingUser); // username check

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('Username already exists')
      );
    });
  });

  describe('findAll', () => {
    it('should return array of active users without passwords', async () => {
      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          username: 'user1',
          firstName: 'User',
          lastName: 'One',
          password: 'hashedPassword1',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
  
        },
        {
          id: 2,
          email: 'user2@example.com',
          username: 'user2',
          firstName: 'User',
          lastName: 'Two',
          password: 'hashedPassword2',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
  
        },
      ];

      const expectedResponse = [
        {
          id: 1,
          email: 'user1@example.com',
          username: 'user1',
          firstName: 'User',
          lastName: 'One',
          isActive: true,
          createdAt: users[0].createdAt,
          updatedAt: users[0].updatedAt,
  
        },
        {
          id: 2,
          email: 'user2@example.com',
          username: 'user2',
          firstName: 'User',
          lastName: 'Two',
          isActive: true,
          createdAt: users[1].createdAt,
          updatedAt: users[1].updatedAt,
  
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should return empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return user by id without password', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),

      };

      const expectedResponse = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,

      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found')
      );
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
      };

      const existingUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),

      };

      const updatedUser = {
        ...existingUser,
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
        updatedAt: new Date(),
      };

      const expectedResponse = {
        id: 1,
        email: 'updated@example.com',
        username: 'testuser',
        firstName: 'Updated',
        lastName: 'Name',
        isActive: true,
        createdAt: existingUser.createdAt,
        updatedAt: updatedUser.updatedAt,

      };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(existingUser) // Check if user exists
        .mockResolvedValueOnce(null); // Check if email already exists

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should update password with hashing', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'NewPassword123!',
      };

      const existingUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'oldHashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),

      };

      const hashedPassword = 'newHashedPassword';
      const updatedUser = {
        ...existingUser,
        password: hashedPassword,
        updatedAt: new Date(),
      };

      const expectedResponse = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: existingUser.createdAt,
        updatedAt: updatedUser.updatedAt,

      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: hashedPassword },
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found')
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const userWithEmail = {
        id: 2,
        email: 'existing@example.com',
      };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(existingUser) // Check if user exists
        .mockResolvedValueOnce(userWithEmail); // Check if email already exists

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        new ConflictException('Email already exists')
      );
    });
  });

  describe('remove', () => {
    it('should soft delete user', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),

      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...existingUser,
        isActive: false,
      });

      await service.remove(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found')
      );
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete user', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),

      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.delete.mockResolvedValue(existingUser);

      await service.hardDelete(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.hardDelete(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found')
      );
    });
  });
});
