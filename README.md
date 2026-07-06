# Pilah Pintar — Backend API

Backend untuk aplikasi **Bank Sampah Pilah Pintar**. Mengelola autentikasi user, klasifikasi sampah berbasis AI, pencatatan transaksi, serta manajemen jenis sampah dan role user.

## Fitur

- **Autentikasi** — Register, login, refresh token, logout (JWT access + refresh token)
- **User Role** — Role-based user (`User` / `Admin`), default `User` saat register
- **Manajemen Profil** — Lihat, edit, dan hapus akun (soft delete)
- **Klasifikasi Sampah** — Upload gambar sampah, AI mengklasifikasikan kategori, otomatis menghitung nominal
- **Riwayat Transaksi** — Lihat semua transaksi atau filter per user, dengan **pagination** (10 data/halaman)
- **CRUD Jenis Sampah** — Kelola data kategori sampah beserta harga per kg

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

Semua endpoint (kecuali Auth) memerlukan header:
```
Authorization: Bearer <accessToken>
```

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

### Jenis Sampah (`/api/jenis-sampah`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | ✅ | Lihat semua jenis sampah |
| GET | `/:id` | ✅ | Detail jenis sampah |
| POST | `/` | ✅ | Tambah jenis sampah baru |
| PUT | `/:id` | ✅ | Edit jenis sampah |
| DELETE | `/:id` | ✅ | Hapus jenis sampah |

### Sampah (`/api/sampah`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/klasifikasi` | ✅ | Upload gambar + berat → klasifikasi AI + simpan transaksi |

### Transaksi (`/api/transaksi`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | ✅ | Semua transaksi (pagination: `?page=1`) |
| GET | `/user/:userId` | ✅ | Transaksi per user (pagination: `?page=1`) |

Response transaksi menyertakan metadata pagination:
```json
{
  "success": true,
  "message": "Berhasil",
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalData": 45,
      "totalPages": 5
    }
  }
}
```

## Database Schema

### Tables

| Table | Keterangan |
|-------|------------|
| `users` | User (dengan role_id, soft delete) |
| `user_role` | Role user (User / Admin) |
| `jenis_sampah` | Kategori sampah & harga per kg |
| `transaksi` | Riwayat transaksi klasifikasi |
| `refresh_tokens` | Token refresh untuk JWT |

### Relasi

- `users` → `user_role` (many-to-one)
- `transaksi` → `users` (many-to-one)
- `transaksi` → `jenis_sampah` (many-to-one)

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

Menambahkan data awal setelah migrasi:

**User Role:**
| Role | ID |
|------|----|
| User | 1 |
| Admin | 2 |

**Admin User:**
| Field | Value |
|-------|-------|
| Email | admin@pilahpinter.com |
| Password | Capstone123 |
| Role | Admin |

**Jenis Sampah:**
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
