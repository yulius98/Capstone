const path = require('node:path');
const transaksiRepository = require('../repositories/transaksi.repository');

const LIMIT = 10;
const UPLOAD_DIR = path.resolve('src/uploads');

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

exports.getGambarPath = async (id) => {
  const transaksi = await transaksiRepository.findById(id);
  if (!transaksi) {
    throw new Error('Transaksi tidak ditemukan');
  }

  return path.join(UPLOAD_DIR, transaksi.gambarPath);
};

exports.getTransaksiById = async (id) => {
  const transaksi = await transaksiRepository.findById(Number(id));
  if (!transaksi) {
    throw new Error('Transaksi tidak ditemukan');
  }

  return transaksi;
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