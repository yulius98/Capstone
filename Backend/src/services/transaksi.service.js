const path = require('node:path');
const transaksiRepository = require('../repositories/transaksi.repository');
const { validateId, createError } = require('../utils/error.util');

const LIMIT = 10;
const UPLOAD_DIR = path.resolve('src/uploads');

const getTransaksiById = async (id) => {
  validateId(id, 'ID transaksi tidak valid');

  const transaksi = await transaksiRepository.findById(id);
  if (!transaksi) {
    throw createError('Transaksi tidak ditemukan', 404);
  }

  return transaksi;
};

exports.getAllTransaksi = async (page = 1) => {
  const skip = (page - 1) * LIMIT;

  const [data, totalData] = await Promise.all([
    transaksiRepository.findAll(skip, LIMIT),
    transaksiRepository.countAll(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit: LIMIT,
      totalData,
      totalPages: Math.ceil(totalData / LIMIT),
    },
  };
};

exports.getGambarPath = (gambarPath) => {
  const fullPath = path.resolve(UPLOAD_DIR, gambarPath);

  if (!fullPath.startsWith(`${UPLOAD_DIR}${path.sep}`)) {
    throw createError('Path gambar tidak valid', 400);
  }

  return fullPath;
};

exports.getTransaksiById = async (id) => {
  return getTransaksiById(id);
};

exports.postSubmitTransaksi = async (transaksi) => {
  if (transaksi.sudahFinal) {
    throw createError('Transaksi sudah final', 400);
  }

  return transaksiRepository.submitTransaksi(transaksi.id);
};

exports.getTransaksiByUser = async (userId, page = 1) => {
  const skip = (page - 1) * LIMIT;

  const [data, totalData] = await Promise.all([
    transaksiRepository.findByUserId(userId, skip, LIMIT),
    transaksiRepository.countByUserId(userId),
  ]);

  return {
    data,
    pagination: {
      page,
      limit: LIMIT,
      totalData,
      totalPages: Math.ceil(totalData / LIMIT),
    },
  };
};
