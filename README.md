# Pilah Pintar — Backend API & AI Service

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
| Python / FastAPI | AI inference server |
| TensorFlow / Keras | Model klasifikasi sampah |
| Docker Compose | Orchestration seluruh service |

## Arsitektur

```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐
│ Frontend │────▶│ Backend API  │────▶│ Waste Classifier │
│          │◀────│  (Express)   │◀────│   (FastAPI)      │
└──────────┘     └──────┬───────┘     └──────────────────┘
                        │
                  ┌─────▼─────┐
                  │ PostgreSQL │
                  └───────────┘
```

### Backend (Express.js)

```
Routes → Controllers → Services → Repositories → Prisma → PostgreSQL
```

| Layer | Lokasi | Tanggung Jawab |
|-------|--------|----------------|
| Routes | `Backend/src/routes/` | Definisi endpoint & middleware |
| Controllers | `Backend/src/controllers/` | Parse request, panggil service, kirim response |
| Services | `Backend/src/services/` | Business logic & validasi |
| Repositories | `Backend/src/repositories/` | Query database via Prisma |
| Middlewares | `Backend/src/middlewares/` | JWT auth guard & global error handler |
| Config | `Backend/src/config/` | Prisma client, Multer upload |

### AI Service (FastAPI)

| Layer | File | Tanggung Jawab |
|-------|------|----------------|
| API | `waste_classifier/main.py` | Endpoint `/predict` dan `/health` |
| Preprocessing | `waste_classifier/main.py` | Decode gambar, resize, normalisasi |
| Model | `waste_classifier/models/waste_classifier.keras` | TensorFlow/Keras model (8 class → 3 kategori) |

## Kategori Sampah

Model AI mengklasifikasikan gambar ke dalam **3 kategori**:

| Kategori | Harga/Kg | Contoh Item |
|----------|----------|-------------|
| `organik` | Rp 50 | Sisa makanan, daun, kulit buah |
| `anorganik` | Rp 100 | Plastik, kertas, logam, kaca, tekstil, elektronik |
| `lainnya` | Rp 50 | Sampah campur yang tidak termasuk di atas |

> **Catatan:** Model internal memiliki 8 class (Elektronik, Kaca, Kertas, Lainnya, Logam, Organik, Plastik, Tekstil) yang di-mapping ke 3 kategori di atas melalui `CATEGORY_MAP` di `waste_classifier/main.py`.

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

### AI Service (`/predict`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/predict` | - | Upload gambar → klasifikasi (internal) |
| GET | `/health` | - | Health check (model loaded?) |

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

## Struktur Folder

```
Capstone/
├── Backend/                  # Express.js API server
│   ├── src/
│   │   ├── server.js         # Entry point
│   │   ├── app.js            # Express setup & routes
│   │   ├── config/           # Prisma, Multer
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Database queries
│   │   ├── middlewares/       # Auth, roles, error handler
│   │   ├── routes/           # Route definitions
│   │   └── utils/            # Helpers
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Seed data
│   └── Dockerfile
├── waste_classifier/         # FastAPI AI inference server
│   ├── main.py               # API & prediction logic
│   ├── requirements.txt      # Python dependencies
│   ├── models/
│   │   ├── waste_classifier.keras  # Trained model
│   │   ├── class_names.json        # 3 kategori output
│   │   └── model_config.json       # Preprocessing config
│   └── Dockerfile
├── db-init/                  # Database seeding via SQL
│   ├── seed-categories.sql   # Insert 3 kategori sampah
│   └── seed.sh               # Wait for table + run SQL
├── docker-compose.yml        # Orchestration 4 services
└── README.md
```

## Instalasi

### Prasyarat

- Docker & Docker Compose (recommended)
- Node.js >= 18 (untuk development lokal)
- Python 3.11+ & pip (untuk development lokal AI service)
- PostgreSQL 16+ (untuk development lokal)

---

### Cara 1: Jalankan dengan Docker Compose (Recommended)

Seluruh service akan berjalan otomatis — PostgreSQL, Backend API, AI Service, dan Database Seeder.

```bash
# 1. Clone repositori
git clone <repo-url>
cd Capstone

# 2. Build & jalankan semua service
docker compose up --build
```

Service yang berjalan:

| Service | Port | Keterangan |
|---------|------|------------|
| `postgres` | 5432 | PostgreSQL database |
| `waste-classifier` | 8000 | AI inference server (FastAPI) |
| `backend` | 5000 | REST API (Express.js) |
| `db-seeder` | - | One-shot: seed 3 kategori ke database |

Backend API tersedia di `http://localhost:5000`.

---

### Cara 2: Jalankan Manual (Development)

#### A. PostgreSQL

Pastikan PostgreSQL berjalan dan database `bank_sampah` sudah dibuat:

```bash
# Buat database (psql atau tool lain)
createdb bank_sampah
```

#### B. Backend (Express.js)

```bash
cd Backend

# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
```

Edit file `Backend/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/bank_sampah?schema=public"
JWT_SECRET=your-random-secret
JWT_REFRESH_SECRET=your-random-refresh-secret
AI_SERVICE_URL=http://localhost:8000/predict
AI_SERVICE_TIMEOUT=15000
```

```bash
# 3. Migrasi database
npx prisma migrate dev

# 4. Seed data awal (role, kategori, admin)
npm run seed

# 5. Jalankan server
npm run start:dev
```

Backend berjalan di `http://localhost:5000`.

#### C. Waste Classifier (FastAPI)

```bash
cd waste_classifier

# 1. Buat virtual environment
python -m venv venv

# 2. Aktifkan virtual environment
# Windows (CMD / PowerShell):
venv\Scripts\activate
# Windows (Git Bash):
source venv/Scripts/activate
# macOS / Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

AI Service berjalan di `http://localhost:8000`.

---

## Migrasi Database

### Menggunakan Prisma

```bash
cd Backend

# Buat migrasi baru (development) — generate SQL dari perubahan schema.prisma
npx prisma migrate dev --name <nama-migrasi>

# Terapkan migrasi yang sudah ada ke database (production)
npx prisma migrate deploy

# Lihat status migrasi
npx prisma migrate status

# Reset semua migrasi (HAPUS semua data!)
npx prisma migrate reset

# Generate ulang Prisma Client setelah perubahan schema
npx prisma generate
```

### Seed Data

Seed dilakukan otomatis saat menjalankan Docker Compose (oleh service `backend` dan `db-seeder`).

Untuk menjalankan manual:

```bash
cd Backend
npm run seed
```

Data yang di-seed:

**User Role:**
| Role | ID |
|------|----|
| User | 1 |
| Admin | 2 |

**Jenis Sampah:**
| Kategori | Harga/Kg |
|----------|----------|
| organik | Rp 50 |
| anorganik | Rp 100 |
| lainnya | Rp 50 |

### Database Seeder (Docker)

Service `db-seeder` berjalan satu kali saat pertama kali `docker compose up` dijalankan:

1. Menunggu PostgreSQL siap (healthcheck)
2. Menunggu tabel `jenis_sampah` dibuat oleh Prisma migrations
3. Menjalankan `db-init/seed-categories.sql` untuk insert 3 kategori
4. Menggunakan `ON CONFLICT DO NOTHING` — aman dijalankan berulang kali

Jika ingin menjalankan ulang seed:

```bash
docker compose up --build db-seeder
```

## Soft Delete

Penghapusan user bersifat **soft delete** — data tidak dihapus dari database, hanya kolom `deletedAt` yang diisi timestamp. User yang di-soft-delete:
- Tidak bisa login
- Tidak bisa diakses via endpoint
- Data transaksinya tetap tersimpan
