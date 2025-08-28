import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.user.deleteMany();

  // Datos de usuarios de prueba
  const users = [
    {
      email: 'admin@example.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      password: await bcrypt.hash('admin123', 10),
      isActive: true,
    },
    {
      email: 'john.doe@example.com',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      password: await bcrypt.hash('password123', 10),
      isActive: true,
    },
    {
      email: 'jane.smith@example.com',
      username: 'janesmith',
      firstName: 'Jane',
      lastName: 'Smith',
      password: await bcrypt.hash('password123', 10),
      isActive: true,
    },
    {
      email: 'bob.wilson@example.com',
      username: 'bobwilson',
      firstName: 'Bob',
      lastName: 'Wilson',
      password: await bcrypt.hash('password123', 10),
      isActive: false, // Usuario inactivo para pruebas
    },
  ];

  // Crear usuarios
  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    });
    console.log(`✅ Usuario creado: ${user.email} (ID: ${user.id})`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
