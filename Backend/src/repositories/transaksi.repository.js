const prisma = require('../config/prisma');

exports.create = (data) => {
  return prisma.transaksi.create({ data });
};

exports.findAll = (skip, take) => {
  return prisma.transaksi.findMany({
    skip,
    take,
    include: { user: true, jenisSampah: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.countAll = () => {
  return prisma.transaksi.count();
};

exports.findById = (id) => {
  return prisma.transaksi.findUnique({
    where: { id },
    include: { jenisSampah: true },
  });
};

exports.findByUserId = (userId, skip, take) => {
  return prisma.transaksi.findMany({
    where: { userId },
    skip,
    take,
    include: { jenisSampah: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.countByUserId = (userId) => {
  return prisma.transaksi.count({ where: { userId } });
};