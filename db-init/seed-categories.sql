-- Seed 3 kategori sampah sesuai backend seed.js
-- Menggunakan lowercase agar cocok dengan output waste_classifier
-- ON CONFLICT DO NOTHING agar aman dijalankan berulang kali

INSERT INTO jenis_sampah (kategori, harga_per_kg) VALUES
  ('organik', 50),
  ('anorganik', 100),
  ('lainnya', 50)
ON CONFLICT (kategori) DO NOTHING;
