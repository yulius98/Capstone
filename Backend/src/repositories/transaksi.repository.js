const prisma = require('../config/prisma');

exports.create = (data) => {
  return prisma.transaksi.create({ data });
};

exports.findAll = () => {
  return prisma.transaksi.findMany({
    include: { user: true, jenisSampah: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.findByUserId = (userId) => {
  return prisma.transaksi.findMany({
    where: { userId },
    include: { jenisSampah: true },
    orderBy: { createdAt: 'desc' },
  });
};