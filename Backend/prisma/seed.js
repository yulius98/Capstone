require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.userRole.createMany({
    data: [{ role: "User" }, { role: "Admin" }],
    skipDuplicates: true,
  });

  await prisma.jenisSampah.createMany({
    data: [
      { kategori: "organik", hargaPerKg: 50 },
      { kategori: "anorganik", hargaPerKg: 100 },
      { kategori: "lainnya", hargaPerKg: 50 },
    ],
    skipDuplicates: true,
  });

  
  
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
