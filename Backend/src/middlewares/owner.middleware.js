const transaksiService = require('../services/transaksi.service');

module.exports = async function owner(req, res, next) {
  try {
    const { id } = req.params;
    const transaksi = await transaksiService.getTransaksiById(Number(id));

    if (Number(transaksi.userId) !== Number(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }

    req.transaksi = transaksi;
    next();
  } catch (err) {
    next(err);
  }
};