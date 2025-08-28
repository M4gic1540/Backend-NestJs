import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma.service';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('User Microservice End-to-End Flow', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'e2e-test',
        },
      },
    });
  });

  afterAll(async () => {
    // Final cleanup
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'e2e-test',
        },
      },
    });
    await app.close();
  });

  describe('Complete User Lifecycle', () => {
    it('should perform complete CRUD operations on a user', async () => {
      const userData = {
        email: 'e2e-test-complete@example.com',
        username: 'e2ecomplete',
        password: 'SecurePassword123!',
        firstName: 'E2E',
        lastName: 'Complete',
      };

      // 1. Create User
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      expect(createResponse.body).toHaveProperty('id');
      expect(createResponse.body.email).toBe(userData.email);
      expect(createResponse.body.username).toBe(userData.username);
      expect(createResponse.body.firstName).toBe(userData.firstName);
      expect(createResponse.body.lastName).toBe(userData.lastName);
      expect(createResponse.body).not.toHaveProperty('password'); // Password should be excluded

      const userId = createResponse.body.id;

      // 2. Get User by ID
      const getUserResponse = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(getUserResponse.body.id).toBe(userId);
      expect(getUserResponse.body.email).toBe(userData.email);

      // 3. Get All Users (should include our created user)
      const getAllResponse = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(getAllResponse.body)).toBe(true);
      const createdUser = getAllResponse.body.find((user: any) => user.id === userId);
      expect(createdUser).toBeDefined();

      // 4. Update User
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updateResponse = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.firstName).toBe(updateData.firstName);
      expect(updateResponse.body.lastName).toBe(updateData.lastName);
      expect(updateResponse.body.email).toBe(userData.email); // Should remain unchanged

      // 5. Soft Delete User
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(204);

      // 6. Verify user is soft deleted (should not appear in general listing)
      const getAllAfterSoftDeleteResponse = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      const softDeletedUser = getAllAfterSoftDeleteResponse.body.find((user: any) => user.id === userId);
      expect(softDeletedUser).toBeUndefined(); // Should not be in active users list
    });

    it('should handle validation errors properly', async () => {
      // Test invalid email
      const invalidEmailData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'Password123!',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidEmailData)
        .expect(400);

      // Test short password
      const shortPasswordData = {
        email: 'e2e-test-short@example.com',
        username: 'testuser2',
        password: '123', // Too short
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(shortPasswordData)
        .expect(400);

      // Test missing required fields
      const incompleteData = {
        email: 'e2e-test-incomplete@example.com',
        // Missing username and password
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(incompleteData)
        .expect(400);
    });

    it('should handle unique constraint violations', async () => {
      const userData = {
        email: 'e2e-test-unique@example.com',
        username: 'e2eunique',
        password: 'Password123!',
        firstName: 'Unique',
        lastName: 'Test',
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      // Try to create user with same email
      const duplicateEmailData = {
        ...userData,
        username: 'differentusername',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(duplicateEmailData)
        .expect(409); // Conflict

      // Try to create user with same username
      const duplicateUsernameData = {
        ...userData,
        email: 'different@example.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(duplicateUsernameData)
        .expect(409); // Conflict
    });

    it('should handle non-existent user operations', async () => {
      const nonExistentId = 99999;

      // Try to get non-existent user
      await request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .expect(404);

      // Try to update non-existent user
      await request(app.getHttpServer())
        .patch(`/users/${nonExistentId}`)
        .send({ firstName: 'Test' })
        .expect(404);

      // Try to delete non-existent user
      await request(app.getHttpServer())
        .delete(`/users/${nonExistentId}`)
        .expect(404);
    });

    it('should handle password updates with proper hashing', async () => {
      const userData = {
        email: 'e2e-test-password@example.com',
        username: 'e2epassword',
        password: 'OriginalPassword123!',
        firstName: 'Password',
        lastName: 'Test',
      };

      // Create user
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.id;

      // Update password
      const newPasswordData = {
        password: 'NewSecurePassword456!',
      };

      const updateResponse = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(newPasswordData)
        .expect(200);

      // Verify password is not returned in response
      expect(updateResponse.body).not.toHaveProperty('password');

      // Verify user data in database (password should be hashed)
      const userInDb = await prismaService.user.findUnique({
        where: { id: userId },
      });

      expect(userInDb?.password).toBeDefined();
      expect(userInDb?.password).not.toBe(newPasswordData.password); // Should be hashed
      expect(userInDb?.password).not.toBe(userData.password); // Should be different from original
    });
  });
});
