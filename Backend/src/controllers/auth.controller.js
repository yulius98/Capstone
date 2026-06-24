const authService = require('../services/auth.service');
const { success, error } = require('../utils/apiResponse');

exports.register = async (req, res, next) => {
  try {
    const { nama, email, password, alamat } = req.body;

    if (!nama || !email || !password) {
      return error(res, 'Semua field wajib diisi', 400);
    }

    const user = await authService.register({ nama, email, password, alamat });
    return res.status(201).json({
      status: 'success',
      data: user,
      message: 'Registrasi berhasil'
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email dan password wajib diisi', 400);
    }

    const result = await authService.login({ email, password });
    return res.status(200).json({
      status: 'success',
      data: result,
      message: 'Login berhasil'
    });
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    return res.status(200).json({
      status: 'success',
      data: result,
      message: 'Access token berhasil diperbarui'
    });

  } catch (err) {
    err.status = 401;
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return success(res, null, 'Logout berhasil');
  } catch (err) {
    err.status = 400;
    next(err);
  }
};