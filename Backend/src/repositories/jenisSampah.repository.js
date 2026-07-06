const prisma = require('../config/prisma');

exports.findByKategori = (kategori) => {
  return prisma.jenisSampah.findUnique({ where: { kategori } });
};

exports.findAll = () => {
  return prisma.jenisSampah.findMany();
};