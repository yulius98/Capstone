const userRepository = require('../repositories/user.repository');

exports.getProfile = async (userId) => {
  const user = await userRepository.findByIdSafe(userId);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }
  return user;
};

exports.updateProfile = async (userId, data) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (data.email && data.email !== user.email) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email sudah digunakan');
    }
  }

  return userRepository.update(userId, data);
};

exports.deleteUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  return userRepository.delete(userId);
};