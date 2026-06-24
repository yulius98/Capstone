const userService = require('../services/user.service');
const { success, error } = require('../utils/apiResponse');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return success(res, user);
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { nama, email, alamat } = req.body;

    if (!nama && !email && !alamat) {
      return error(res, 'Tidak ada data yang diubah', 400);
    }

    const data = {};
    if (nama) data.nama = nama;
    if (email) data.email = email;
    if (alamat !== undefined) data.alamat = alamat;

    const user = await userService.updateProfile(req.user.id, data);
    return success(res, user, 'Profil berhasil diperbarui');
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.user.id);
    return success(res, null, 'Akun berhasil dihapus');
  } catch (err) {
    err.status = 400;
    next(err);
  }
};