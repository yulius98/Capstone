# Pilah Pintar — Backend API

Backend untuk aplikasi **Bank Sampah Pilah Pintar**. Mengelola autentikasi user, klasifikasi sampah berbasis AI, serta pencatatan transaksi.

## Fitur

- **Autentikasi** — Register, login, refresh token, logout (JWT access + refresh token)
- **Klasifikasi Sampah** — Upload gambar sampah, AI mengklasifikasikan kategori (plastik/kertas/logam/organik/kaca), otomatis menghitung nominal berdasarkan harga per kg
- **Manajemen Profil** — Lihat, edit, dan hapus akun (soft delete)
- **Riwayat Transaksi** — Lihat semua transaksi atau filter per user

## Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| Node.js / Express 5 | REST API framework |
| PostgreSQL | Database relasional |
| Prisma ORM | Database access & migration |
| JWT (jsonwebtoken) | Access & refresh token auth |
| bcrypt | Hashing password |
| Multer | Upload file gambar |
| Axios + FormData | HTTP client ke AI service |
| Helmet, CORS, Morgan | Security, CORS, logging |

## Arsitektur

Aplikasi menggunakan **Layered Architecture**:

```
Routes → Controllers → Services → Repositories → Prisma → PostgreSQL
```

| Layer | Lokasi | Tanggung Jawab |
|-------|--------|----------------|
| Routes | `src/routes/` | Definisi endpoint & middleware |
| Controllers | `src/controllers/` | Parse request, panggil service, kirim response |
| Services | `src/services/` | Business logic & validasi |
| Repositories | `src/repositories/` | Query database via Prisma |
| Middlewares | `src/middlewares/` | JWT auth guard & global error handler |
| Config | `src/config/` | Prisma client, Multer upload |

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/register` | - | Register user baru |
| POST | `/login` | - | Login, dapatkan access + refresh token |
| POST | `/refresh-token` | - | Perbarui access token |
| POST | `/logout` | - | Hapus refresh token |

### User (`/api/user`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/profile` | ✅ | Lihat profil sendiri |
| PUT | `/profile` | ✅ | Edit profil (nama/email/alamat) |
| DELETE | `/profile` | ✅ | Hapus akun (soft delete) |

### Sampah (`/api/sampah`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/klasifikasi` | ✅ | Upload gambar + berat → klasifikasi AI + simpan transaksi |

### Transaksi (`/api/transaksi`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | ✅ | Semua transaksi |
| GET | `/user/:userId` | ✅ | Transaksi per user |

## Instalasi

### Prasyarat

- Node.js >= 18
- PostgreSQL
- AI service (opsional, untuk fitur klasifikasi)

### Langkah-langkah

```bash
# 1. Clone repositori
git clone <repo-url>
cd Backend

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
```

Edit file `.env` dan sesuaikan:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/bank_sampah?schema=public"
JWT_SECRET=your-random-secret
JWT_REFRESH_SECRET=your-random-refresh-secret
```

```bash
# 4. Setup database (migrate + seed)
npx prisma migrate dev
npm run seed

# 5. Jalankan server
npm run start:dev
```

Server akan berjalan di `http://localhost:5000`.

### Seed Data

Menambahkan data awal jenis sampah beserta harga per kg:

| Kategori | Harga/Kg |
|----------|----------|
| Plastik | Rp 2.000 |
| Kertas | Rp 1.500 |
| Logam | Rp 5.000 |
| Organik | Rp 8.000 |
| Kaca | Rp 6.000 |

## Soft Delete

Penghapusan user bersifat **soft delete** — data tidak dihapus dari database, hanya kolom `deletedAt` yang diisi timestamp. User yang di-soft-delete:
- Tidak bisa login
- Tidak bisa diakses via endpoint
- Data transaksinya tetap tersimpan
