const prisma = require('../config/prisma');

exports.findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email, deletedAt: null } });
};

exports.findById = (id) => {
  return prisma.user.findUnique({ where: { id, deletedAt: null } });
};

exports.findByIdSafe = (id) => {
  return prisma.user.findUnique({
    where: { id, deletedAt: null },
    select: { id: true, nama: true, email: true, alamat: true, createdAt: true },
  });
};

exports.create = (data) => {
  return prisma.user.create({ data });
};

exports.update = (id, data) => {
  return prisma.user.update({ where: { id, deletedAt: null }, data });
};

exports.delete = (id) => {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};