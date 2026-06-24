const prisma = require('../config/prisma');

exports.create = (data) => {
  return prisma.refreshToken.create({ data });
};

exports.findByToken = (token) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

exports.deleteById = (id) => {
  return prisma.refreshToken.delete({ where: { id } });
};

exports.deleteByToken = (token) => {
  return prisma.refreshToken.deleteMany({ where: { token } });
};