import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/common/prisma.service';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    hardDelete: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configure global pipes and filters
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();
    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const createdUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

      };

      mockUsersService.create.mockResolvedValue(createdUser);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toEqual(createdUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        email: 'invalid-email',
        username: 'te', // Too short
        password: '123', // Too short
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteDto = {
        email: 'test@example.com',
        // Missing username and password
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(incompleteDto)
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('should return array of users', async () => {
      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          username: 'user1',
          firstName: 'User',
          lastName: 'One',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
  
        },
        {
          id: 2,
          email: 'user2@example.com',
          username: 'user2',
          firstName: 'User',
          lastName: 'Two',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
  
        },
      ];

      mockUsersService.findAll.mockResolvedValue(users);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return user by id', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

      };

      mockUsersService.findOne.mockResolvedValue(user);

      const response = await request(app.getHttpServer())
        .get('/users/1')
        .expect(200);

      expect(response.body).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer())
        .get('/users/invalid-id')
        .expect(400);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should update user successfully', async () => {
      const updateDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Updated',
        lastName: 'Name',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const response = await request(app.getHttpServer())
        .patch('/users/1')
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        email: 'invalid-email',
      };

      await request(app.getHttpServer())
        .patch('/users/1')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should soft delete user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete('/users/1')
        .expect(204);

      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('/users/:id/hard (DELETE)', () => {
    it('should hard delete user', async () => {
      mockUsersService.hardDelete.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete('/users/1/hard')
        .expect(204);

      expect(mockUsersService.hardDelete).toHaveBeenCalledWith(1);
    });
  });
});
