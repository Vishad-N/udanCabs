import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding standard vehicle categories...');

  const categories = [
    {
      name: 'Sedan',
      description: 'Comfortable rides for small families. Ideal for airport transfers and local sightseeing.',
    },
    {
      name: 'SUV',
      description: 'Perfect for group darshans and outstation trips with extra luggage space.',
    },
    {
      name: 'Luxury',
      description: 'Arrive in style. Premium vehicles for corporate travels and special occasions.',
    },
    {
      name: 'Traveller',
      description: 'Spacious Tempo Travellers for large family trips and tours.',
    }
  ];

  for (const cat of categories) {
    await prisma.vehicleCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
