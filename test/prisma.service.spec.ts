import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/common/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up any test data
    try {
      await service.user.deleteMany({
        where: {
          email: {
            contains: 'test',
          },
        },
      });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  afterAll(async () => {
    await service.$disconnect();
  });

  describe('Database Connection', () => {
    it('should connect to database', async () => {
      await expect(service.$connect()).resolves.not.toThrow();
    });

    it('should execute a simple query', async () => {
      const result = await service.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('User Operations', () => {
    it('should create a user', async () => {
      const userData = {
        email: 'prisma-test@example.com',
        username: 'prismatest',
        password: 'hashedPassword123',
        firstName: 'Prisma',
        lastName: 'Test',
      };

      const user = await service.user.create({
        data: userData,
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should find a user by id', async () => {
      // First create a user
      const userData = {
        email: 'find-test@example.com',
        username: 'findtest',
        password: 'hashedPassword123',
        firstName: 'Find',
        lastName: 'Test',
      };

      const createdUser = await service.user.create({
        data: userData,
      });

      // Then find it
      const foundUser = await service.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe(userData.email);
    });

    it('should find a user by email', async () => {
      const userData = {
        email: 'email-test@example.com',
        username: 'emailtest',
        password: 'hashedPassword123',
        firstName: 'Email',
        lastName: 'Test',
      };

      const createdUser = await service.user.create({
        data: userData,
      });

      const foundUser = await service.user.findUnique({
        where: { email: userData.email },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe(userData.email);
    });

    it('should find a user by username', async () => {
      const userData = {
        email: 'username-test@example.com',
        username: 'usernametest',
        password: 'hashedPassword123',
        firstName: 'Username',
        lastName: 'Test',
      };

      const createdUser = await service.user.create({
        data: userData,
      });

      const foundUser = await service.user.findUnique({
        where: { username: userData.username },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.username).toBe(userData.username);
    });

    it('should update a user', async () => {
      const userData = {
        email: 'update-test@example.com',
        username: 'updatetest',
        password: 'hashedPassword123',
        firstName: 'Update',
        lastName: 'Test',
      };

      const createdUser = await service.user.create({
        data: userData,
      });

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedUser = await service.user.update({
        where: { id: createdUser.id },
        data: updateData,
      });

      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
      expect(updatedUser.email).toBe(userData.email); // Should remain unchanged
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        updatedUser.createdAt.getTime()
      );
    });

    it('should soft delete a user (set isActive to false)', async () => {
      const userData = {
        email: 'soft-delete-test@example.com',
        username: 'softdeletetest',
        password: 'hashedPassword123',
        firstName: 'Soft',
        lastName: 'Delete',
      };

      const createdUser = await service.user.create({
        data: userData,
      });

      const updatedUser = await service.user.update({
        where: { id: createdUser.id },
        data: { isActive: false },
      });

      expect(updatedUser.isActive).toBe(false);
    });

    it('should hard delete a user', async () => {
      const userData = {
        email: 'hard-delete-test@example.com',
        username: 'harddeletetest',
        password: 'hashedPassword123',
        firstName: 'Hard',
        lastName: 'Delete',
      };

      const createdUser = await service.user.create({
        data: userData,
      });

      await service.user.delete({
        where: { id: createdUser.id },
      });

      const deletedUser = await service.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(deletedUser).toBeNull();
    });

    it('should find multiple users', async () => {
      const users = [
        {
          email: 'multi1-test@example.com',
          username: 'multi1test',
          password: 'hashedPassword123',
          firstName: 'Multi',
          lastName: 'One',
        },
        {
          email: 'multi2-test@example.com',
          username: 'multi2test',
          password: 'hashedPassword123',
          firstName: 'Multi',
          lastName: 'Two',
        },
      ];

      // Create multiple users
      await Promise.all(
        users.map(userData => 
          service.user.create({ data: userData })
        )
      );

      const foundUsers = await service.user.findMany({
        where: {
          firstName: 'Multi',
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      expect(foundUsers.length).toBeGreaterThanOrEqual(2);
      expect(foundUsers.every(user => user.firstName === 'Multi')).toBe(true);
      expect(foundUsers.every(user => user.isActive === true)).toBe(true);
    });

    it('should enforce unique email constraint', async () => {
      const userData = {
        email: 'unique-email-test@example.com',
        username: 'uniqueemailtest1',
        password: 'hashedPassword123',
        firstName: 'Unique',
        lastName: 'Email',
      };

      // Create first user
      await service.user.create({
        data: userData,
      });

      // Try to create second user with same email
      const duplicateUser = {
        ...userData,
        username: 'uniqueemailtest2', // Different username
      };

      await expect(
        service.user.create({
          data: duplicateUser,
        })
      ).rejects.toThrow();
    });

    it('should enforce unique username constraint', async () => {
      const userData = {
        email: 'unique-username-test1@example.com',
        username: 'uniqueusernametest',
        password: 'hashedPassword123',
        firstName: 'Unique',
        lastName: 'Username',
      };

      // Create first user
      await service.user.create({
        data: userData,
      });

      // Try to create second user with same username
      const duplicateUser = {
        ...userData,
        email: 'unique-username-test2@example.com', // Different email
      };

      await expect(
        service.user.create({
          data: duplicateUser,
        })
      ).rejects.toThrow();
    });
  });
});
