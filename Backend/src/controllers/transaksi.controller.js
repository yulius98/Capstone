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

exports.getTransaksiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await transaksiService.getTransaksiById(Number(id));
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

exports.getGambar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gambarPath = await transaksiService.getGambarPath(Number(id));
    return res.sendFile(gambarPath);
  } catch (err) {
    next(err);
  }
};

exports.postSubmitTransaksi = async (req, res, next) => {
  try {
    const { id } = req.body;
    const result = await transaksiService.postSubmitTransaksi(id);
    return success(res, result, 'Transaksi berhasil disubmit!');
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