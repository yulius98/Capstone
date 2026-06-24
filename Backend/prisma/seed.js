require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.jenisSampah.createMany({
    data: [
      { kategori: 'plastik', hargaPerKg: 2000 },
      { kategori: 'kertas', hargaPerKg: 1500 },
      { kategori: 'logam', hargaPerKg: 5000 },
      { kategori: 'organik', hargaPerKg: 8000},
      { kategori: 'kaca', hargaPerKg: 6000}
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());