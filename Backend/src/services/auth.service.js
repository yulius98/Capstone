const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const refreshTokenRepository = require('../repositories/refreshToken.repository');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/token.util');

exports.register = async ({ nama, email, password, alamat }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new Error('Email sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({ nama, email, password: hashedPassword, alamat });

  return { id: user.id, nama: user.nama, email: user.email };
};

exports.login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Email atau password salah');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Email atau password salah');
  }

  const payload = { id: user.id };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await refreshTokenRepository.create({
    token: refreshToken,
    userId: user.id,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    // user: { id: user.id, nama: user.nama, email: user.email },
  };
};

exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token wajib diisi');
  }

  const stored = await refreshTokenRepository.findByToken(refreshToken);
  if (!stored) {
    throw new Error('Refresh token tidak valid');
  }

  if (stored.expiresAt < new Date()) {
    await refreshTokenRepository.deleteById(stored.id);
    throw new Error('Refresh token sudah expired, silakan login ulang');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new Error('Refresh token tidak valid', {cause:err});
  }

  const newAccessToken = generateAccessToken({
    id: decoded.id,
    email: decoded.email,
  });

  return { accessToken: newAccessToken };
};

exports.logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token wajib diisi');
  }
  await refreshTokenRepository.deleteByToken(refreshToken);
};