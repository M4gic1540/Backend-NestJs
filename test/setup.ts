// Test setup file
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://appuser:apppassword@localhost:3307/user_microservice_test',
    },
  },
});

// Global setup for tests
beforeAll(async () => {
  // Connect to database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup and disconnect
  await prisma.$disconnect();
});

// Export prisma for use in tests
global.prisma = prisma;
