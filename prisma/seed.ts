import { Role } from '../lib/generated/prisma';
import * as bcrypt from 'bcryptjs';
import prisma from '../lib/db';

async function main() {
  console.log('Start seeding...');

  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the admin user
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: Role.ADMIN,
      },
    });
    console.log(`Admin user created with email: ${adminEmail} and password: ${adminPassword}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
