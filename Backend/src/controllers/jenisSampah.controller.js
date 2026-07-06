const jenisSampahService = require('../services/jenisSampah.service');
const { success, error } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try {
    const data = await jenisSampahService.getAll();
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await jenisSampahService.getById(req.params.id);
    return success(res, data);
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { kategori, hargaPerKg } = req.body;
    if (!kategori || !hargaPerKg) {
      return error(res, 'Kategori dan harga per kg wajib diisi', 400);
    }
    const data = await jenisSampahService.create({ kategori, hargaPerKg });
    return success(res, data, 'Jenis sampah berhasil ditambahkan', 201);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { kategori, hargaPerKg } = req.body;
    if (!kategori && !hargaPerKg) {
      return error(res, 'Tidak ada data yang diubah', 400);
    }
    const data = {};
    if (kategori) data.kategori = kategori;
    if (hargaPerKg !== undefined) data.hargaPerKg = hargaPerKg;
    const result = await jenisSampahService.update(req.params.id, data);
    return success(res, result, 'Jenis sampah berhasil diperbarui');
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await jenisSampahService.delete(req.params.id);
    return success(res, null, 'Jenis sampah berhasil dihapus');
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
