const transaksiService = require('../services/transaksi.service');
const { success } = require('../utils/apiResponse');

exports.getAllTransaksi = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const result = await transaksiService.getAllTransaksi(page);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

exports.getTransaksiByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = Number.parseInt(req.query.page) || 1;
    const result = await transaksiService.getTransaksiByUser(Number(userId), page);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};