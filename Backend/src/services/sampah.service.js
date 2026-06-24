const aiService = require('./ai.service');
const jenisSampahRepository = require('../repositories/jenisSampah.repository');
const transaksiRepository = require('../repositories/transaksi.repository');

exports.prosesKlasifikasi = async ({ filePath, fileName, beratKg, userId }) => {
  // 1. Kirim gambar ke AI service
  const hasilAI = await aiService.klasifikasiGambar(filePath);

  // 2. Ambil data harga sesuai kategori hasil AI
  const jenis = await jenisSampahRepository.findByKategori(hasilAI.kategori);
  if (!jenis) {
    throw new Error(`Harga untuk kategori "${hasilAI.kategori}" belum terdaftar`);
  }

  // 3. Hitung nominal
  const nominal = jenis.hargaPerKg * Number(beratKg);

  // 4. Simpan transaksi
  const transaksi = await transaksiRepository.create({
    userId: Number(userId),
    jenisSampahId: jenis.id,
    kategori: hasilAI.kategori,
    confidence: hasilAI.confidence,
    beratKg: Number(beratKg),
    hargaPerKg: jenis.hargaPerKg,
    nominal,
    gambarPath: fileName,
  });

  return {
    transaksiId: transaksi.id,
    kategori: hasilAI.kategori,
    confidence: hasilAI.confidence,
    beratKg: Number(beratKg),
    hargaPerKg: jenis.hargaPerKg,
    nominal,
  };
};