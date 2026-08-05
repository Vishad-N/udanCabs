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
  console.log('Seeding standard vehicle pricing rules...');

  const categories = await prisma.vehicleCategory.findMany();

  if (categories.length === 0) {
    console.error('No categories found! Please seed categories first.');
    return;
  }

  const pricingRules: Record<string, any> = {
    'Sedan': { basePrice: 400, includedKm: 10, pricePerKm: 12, minFare: 300, nightCharge: 150 },
    'SUV': { basePrice: 600, includedKm: 10, pricePerKm: 16, minFare: 500, nightCharge: 200 },
    'Luxury': { basePrice: 1000, includedKm: 10, pricePerKm: 25, minFare: 1000, nightCharge: 500 },
    'Traveller': { basePrice: 1500, includedKm: 10, pricePerKm: 30, minFare: 1500, nightCharge: 500 }
  };

  for (const cat of categories) {
    const rules = pricingRules[cat.name];
    if (rules) {
      await prisma.vehiclePricing.upsert({
        where: { categoryId: cat.id },
        update: rules,
        create: {
          categoryId: cat.id,
          ...rules,
          status: 'ACTIVE'
        },
      });
    }
  }

  console.log('Pricing rules seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
