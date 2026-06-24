const transaksiRepository = require('../repositories/transaksi.repository');

exports.getAllTransaksi = () => {
  return transaksiRepository.findAll();
};

exports.getTransaksiByUser = (userId) => {
  return transaksiRepository.findByUserId(Number(userId));
};