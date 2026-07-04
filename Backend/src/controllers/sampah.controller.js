const sampahService = require('../services/sampah.service');
const { success, error } = require('../utils/apiResponse');

exports.klasifikasiSampah = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'Gambar wajib diupload', 400);
    }

    const { beratKg } = req.body;
    const userId = req.user.id;

    if (!beratKg) {
      return error(res, 'beratKg wajib diisi', 400);
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