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
      { kategori: "plastik", hargaPerKg: 2000 },
      { kategori: "kertas", hargaPerKg: 1500 },
      { kategori: "logam", hargaPerKg: 5000 },
      { kategori: "organik", hargaPerKg: 8000 },
      { kategori: "kaca", hargaPerKg: 6000 },
      { kategori: "elektronik", hargaPerKg: 1000 },
      { kategori: "tekstil", hargaPerKg: 500 },
      { kategori: "lainnya", hargaPerKg: 300 },
    ],
    skipDuplicates: true,
  });

  const hashedPassword = await bcrypt.hash("Capstone123", 10);

  await prisma.user.upsert({
    where: { email: 'admin@pilahpinter.com' },
    update: {},
    create: {
      nama: 'Admin',
      email: 'admin@pilahpinter.com',
      password: hashedPassword,
      roleId: 2,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());