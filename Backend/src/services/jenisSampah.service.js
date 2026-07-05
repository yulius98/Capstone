const jenisSampahRepository = require('../repositories/jenisSampah.repository');

exports.getAll = () => {
  return jenisSampahRepository.findAll();
};

exports.getById = async (id) => {
  const jenisSampah = await jenisSampahRepository.findById(Number(id));
  if (!jenisSampah) {
    throw new Error('Jenis sampah tidak ditemukan');
  }
  return jenisSampah;
};

exports.create = async (data) => {
  const existing = await jenisSampahRepository.findByKategori(data.kategori);
  if (existing) {
    throw new Error('Kategori sudah ada');
  }
  return jenisSampahRepository.create(data);
};

exports.update = async (id, data) => {
  const existing = await jenisSampahRepository.findById(Number(id));
  if (!existing) {
    throw new Error('Jenis sampah tidak ditemukan');
  }
  if (data.kategori && data.kategori !== existing.kategori) {
    const duplikat = await jenisSampahRepository.findByKategori(data.kategori);
    if (duplikat) {
      throw new Error('Kategori sudah digunakan');
    }
  }
  return jenisSampahRepository.update(Number(id), data);
};

exports.delete = async (id) => {
  const existing = await jenisSampahRepository.findById(Number(id));
  if (!existing) {
    throw new Error('Jenis sampah tidak ditemukan');
  }
  return jenisSampahRepository.delete(Number(id));
};
