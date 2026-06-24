const sampahService = require('../services/sampah.service');
const { success, error } = require('../utils/apiResponse');

exports.klasifikasiSampah = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'Gambar wajib diupload', 400);
    }

    const { beratKg, userId } = req.body;

    if (!beratKg || !userId) {
      return error(res, 'beratKg dan userId wajib diisi', 400);
    }

    const hasil = await sampahService.prosesKlasifikasi({
      filePath: req.file.path,
      fileName: req.file.filename,
      beratKg,
      userId,
    });

    return success(res, hasil, 'Klasifikasi berhasil');
  } catch (err) {
    next(err);
  }
};