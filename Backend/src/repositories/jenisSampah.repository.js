const prisma = require("../config/prisma");

exports.findByKategori = (kategori) => {
  return prisma.jenisSampah.findUnique({ where: { kategori } });
};

exports.findAll = () => {
  return prisma.jenisSampah.findMany();
};

exports.findById = (id) => {
  return prisma.jenisSampah.findUnique({ where: { id } });
};

exports.create = (data) => {
  return prisma.jenisSampah.create({ data });
};

exports.update = (id, data) => {
  return prisma.jenisSampah.update({ where: { id }, data });
};

exports.delete = (id) => {
  return prisma.jenisSampah.delete({ where: { id } });
};
