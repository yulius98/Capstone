# API Endpoints

Base path: `/api`

Semua endpoint (kecuali Auth) memerlukan header:
```
Authorization: Bearer <accessToken>
```

Role yang dipakai di project ini:
- `1` = User
- `2` = Admin

---

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | No | Registrasi user baru (default role: User) |
| POST | `/api/auth/login` | No | Login, dapatkan access & refresh token |
| POST | `/api/auth/refresh-token` | No | Tukar refresh token dengan access token baru |
| POST | `/api/auth/logout` | No | Hapus refresh token (logout) |

### POST `/api/auth/register`

**Body (JSON):**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string",
  "alamat": "string (opsional)"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": { "id": 1, "nama": "string", "email": "string" },
  "message": "Registrasi berhasil"
}
```

### POST `/api/auth/login`

**Body (JSON):**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": { "id": 1, "nama": "string", "email": "string" }
  },
  "message": "Login berhasil"
}
```

### POST `/api/auth/refresh-token`

**Body (JSON):**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": { "accessToken": "string" },
  "message": "Access token berhasil diperbarui"
}
```

### POST `/api/auth/logout`

**Body (JSON):**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil",
  "data": null
}
```

---

## User (`/api/user`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/user/profile` | JWT | Lihat profil sendiri |
| PUT | `/api/user/profile` | JWT | Update profil sendiri |
| DELETE | `/api/user/profile` | JWT | Hapus akun sendiri (soft delete) |

### GET `/api/user/profile`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil",
  "data": {
    "id": 1,
    "nama": "string",
    "email": "string",
    "alamat": "string | null",
    "createdAt": "datetime"
  }
}
```

### PUT `/api/user/profile`

**Body (JSON) — minimal satu field:**
```json
{
  "nama": "string (opsional)",
  "email": "string (opsional)",
  "alamat": "string (opsional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "data": { "id": 1, "nama": "string", "email": "string", "alamat": "string | null" }
}
```

### DELETE `/api/user/profile`

**Response (200):**
```json
{
  "success": true,
  "message": "Akun berhasil dihapus",
  "data": null
}
```

---

## Jenis Sampah (`/api/jenis-sampah`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/jenis-sampah` | JWT (Admin) | Lihat semua jenis sampah |
| GET | `/api/jenis-sampah/:id` | JWT (Admin) | Detail jenis sampah |
| POST | `/api/jenis-sampah` | JWT (Admin) | Tambah jenis sampah baru |
| PUT | `/api/jenis-sampah/:id` | JWT (Admin) | Edit jenis sampah |
| DELETE | `/api/jenis-sampah/:id` | JWT (Admin) | Hapus jenis sampah |

### GET `/api/jenis-sampah`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil",
  "data": [
    { "id": 1, "kategori": "plastik", "hargaPerKg": 2000 },
    { "id": 2, "kategori": "kertas", "hargaPerKg": 1500 }
  ]
}
```

### GET `/api/jenis-sampah/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil",
  "data": { "id": 1, "kategori": "plastik", "hargaPerKg": 2000 }
}
```

### POST `/api/jenis-sampah`

**Body (JSON):**
```json
{
  "kategori": "string (wajib)",
  "hargaPerKg": "number (wajib)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Jenis sampah berhasil ditambahkan",
  "data": { "id": 6, "kategori": "kardus", "hargaPerKg": 1800 }
}
```

### PUT `/api/jenis-sampah/:id`

**Body (JSON) — minimal satu field:**
```json
{
  "kategori": "string (opsional)",
  "hargaPerKg": "number (opsional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Jenis sampah berhasil diperbarui",
  "data": { "id": 1, "kategori": "kardus", "hargaPerKg": 2000 }
}
```

### DELETE `/api/jenis-sampah/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Jenis sampah berhasil dihapus",
  "data": null
}
```

---

## Sampah (`/api/sampah`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/sampah/klasifikasi` | JWT | Upload gambar sampah untuk klasifikasi AI & buat transaksi |

**Content-Type:** `multipart/form-data`

### POST `/api/sampah/klasifikasi`

**Fields:**
| Field | Type | Keterangan |
|-------|------|------------|
| `gambar` | File (jpeg/jpg/png/webp, max 5MB) | Gambar sampah |

---

## Transaksi (`/api/transaksi`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/transaksi` | JWT | Lihat semua transaksi |
| GET | `/api/transaksi/:id` | JWT | Detail transaksi |
| GET | `/api/transaksi/user/:userId` | JWT | Lihat transaksi per user |
| GET | `/api/transaksi/:id/gambar` | JWT | Ambil file gambar transaksi |
| POST | `/api/transaksi/submit` | JWT | submit transaksi (set `sudahFinal = true`) |

### POST `/api/transaksi/submit`

**Content-Type:** `application/json`

**Body (JSON):**
```json
{
  "id": 1
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | Number (wajib) | ID transaksi yang akan disubmit |

**Response (200):**
```json
{
  "success": true,
  "message": "Transaksi berhasil disubmit!",
  "data": {
    "id": 1,
    "userId": 2,
    "jenisSampahId": 3,
    "kategori": "plastik",
    "confidence": 0.98,
    "beratKg": 1.5,
    "hargaPerKg": 2000,
    "nominal": 3000,
    "gambarPath": "filename.jpg",
    "sudahFinal": true,
    "createdAt": "datetime"
  }
}
```

**Error responses:**
| Status | Kondisi | Pesan |
|--------|---------|-------|
| 400 | `id` tidak dikirim di body | `Field "id" wajib dikirim di body request` |
| 404/500 | Transaksi tidak ditemukan | `Transaksi tidak ditemukan` |
| 400/500 | Transaksi sudah final | `Transaksi sudah final` |

### GET `/api/transaksi/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil",
  "data": {
    "id": 1,
    "userId": 2,
    "jenisSampahId": 3,
    "kategori": "plastik",
    "confidence": 0.98,
    "beratKg": 1.5,
    "hargaPerKg": 2000,
    "nominal": 3000,
    "gambarPath": "src/uploads/....",
    "createdAt": "datetime",
    "jenisSampah": { "id": 3, "kategori": "plastik", "hargaPerKg": 2000 }
  }
}
```
| `beratKg` | Number | Berat sampah dalam kg |

`userId` diambil otomatis dari token JWT.

**Response (200):**
```json
{
  "success": true,
  "message": "Klasifikasi berhasil",
  "data": {
    "transaksiId": 1,
    "kategori": "plastik",
    "confidence": 0.95,
    "beratKg": 2.5,
    "hargaPerKg": 3000,
    "nominal": 7500
  }
}
```

---

## Transaksi (`/api/transaksi`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/transaksi` | JWT | Lihat semua transaksi (pagination) |
| GET | `/api/transaksi/user/:userId` | JWT | Lihat transaksi berdasarkan user (pagination, hanya `sudahFinal = true`) |
| GET | `/api/transaksi/:id` | JWT | Detail transaksi milik sendiri |
| GET | `/api/transaksi/:id/gambar` | JWT | Ambil file gambar transaksi milik sendiri |
| POST | `/api/transaksi/:id/submit` | JWT | Finalisasi transaksi milik sendiri |

**Query params:**
| Param | Type | Default | Keterangan |
|-------|------|---------|------------|
| `page` | number | 1 | Halaman yang diminta (10 data per halaman) |

### GET `/api/transaksi?page=1`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil",
  "data": {
    "data": [
      {
        "id": 1,
        "userId": 3,
        "jenisSampahId": 3,
        "kategori": "logam",
        "confidence": 0.92,
        "beratKg": 2.5,
        "hargaPerKg": 5000,
        "nominal": 12500,
        "gambarPath": "filename.jpg",
        "sudahFinal": true,
        "createdAt": "2026-07-05T00:00:00.000Z",
        "user": { "id": 3, "nama": "string", "email": "string" },
        "jenisSampah": { "id": 3, "kategori": "logam", "hargaPerKg": 5000 }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalData": 45,
      "totalPages": 5
    }
  }
}
```

### GET `/api/transaksi/user/:userId?page=1`

**Response:** Sama seperti di atas, hanya difilter berdasarkan userId.

---

## Ringkasan

| # | Method | Endpoint | Auth | Deskripsi |
|---|--------|----------|------|-----------|
| 1 | POST | `/api/auth/register` | ✗ | Registrasi (default role: User) |
| 2 | POST | `/api/auth/login` | ✗ | Login |
| 3 | POST | `/api/auth/refresh-token` | ✗ | Refresh token |
| 4 | POST | `/api/auth/logout` | ✗ | Logout |
| 5 | GET | `/api/user/profile` | ✓ | Lihat profil |
| 6 | PUT | `/api/user/profile` | ✓ | Update profil |
| 7 | DELETE | `/api/user/profile` | ✓ | Hapus akun |
| 8 | GET | `/api/jenis-sampah` | ✓ (Admin) | Semua jenis sampah |
| 9 | GET | `/api/jenis-sampah/:id` | ✓ (Admin) | Detail jenis sampah |
| 10 | POST | `/api/jenis-sampah` | ✓ (Admin) | Tambah jenis sampah |
| 11 | PUT | `/api/jenis-sampah/:id` | ✓ (Admin) | Edit jenis sampah |
| 12 | DELETE | `/api/jenis-sampah/:id` | ✓ (Admin) | Hapus jenis sampah |
| 13 | POST | `/api/sampah/klasifikasi` | ✓ | Klasifikasi sampah |
| 14 | GET | `/api/transaksi` | ✓ | Semua transaksi (pagination) |
| 15 | GET | `/api/transaksi/:id` | ✓ | Detail transaksi |
| 16 | GET | `/api/transaksi/user/:userId` | ✓ | Transaksi per user (pagination) | 
| 17 | GET | `/api/transaksi/:id/gambar` | ✓ | Ambil file gambar transaksi |
| 18 | POST | `/api/transaksi/:id/submit` | ✓ | Submit/finalisasi transaksi |