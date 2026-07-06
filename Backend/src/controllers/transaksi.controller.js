const transaksiService = require('../services/transaksi.service');
const { success } = require('../utils/apiResponse');

exports.getAllTransaksi = async (req, res, next) => {
  try {
    const transaksi = await transaksiService.getAllTransaksi();
    return success(res, transaksi);
  } catch (err) {
    next(err);
  }
};

exports.getTransaksiByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const transaksi = await transaksiService.getTransaksiByUser(userId);
    return success(res, transaksi);
  } catch (err) {
    next(err);
  }
};