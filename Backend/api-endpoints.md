# API Endpoints

Base path: `/api`

---

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | No | Registrasi user baru |
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

**Response:**
```json
{
  "status": "success",
  "message": "User berhasil dibuat",
  "data": { "id": "string", "nama": "string", "email": "string" }
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

**Response:**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": { "id": "string", "nama": "string", "email": "string" }
  }
}
```

### POST `/api/auth/refresh-token`

**Body (JSON):**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Token berhasil diperbarui",
  "data": { "accessToken": "string" }
}
```

### POST `/api/auth/logout`

**Body (JSON):**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

---

## User (`/api/user`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/user/profile` | JWT | Lihat profil sendiri |
| PUT | `/api/user/profile` | JWT | Update profil sendiri |
| DELETE | `/api/user/profile` | JWT | Hapus akun sendiri (soft delete) |

**Header:** `Authorization: Bearer <accessToken>`

### GET `/api/user/profile`

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "nama": "string",
    "email": "string",
    "alamat": "string | null",
    "createdAt": "datetime"
  }
}
```

### PUT `/api/user/profile`

**Body (JSON):**
```json
{
  "nama": "string (opsional)",
  "email": "string (opsional)",
  "alamat": "string (opsional)"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Profil berhasil diperbarui",
  "data": { "id": "string", "nama": "string", "email": "string", "alamat": "string | null" }
}
```

### DELETE `/api/user/profile`

**Response:**
```json
{
  "status": "success",
  "message": "Akun berhasil dihapus"
}
```

---

## Sampah (`/api/sampah`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/sampah/klasifikasi` | JWT | Upload gambar sampah untuk klasifikasi AI & buat transaksi |

**Header:** `Authorization: Bearer <accessToken>`  
**Content-Type:** `multipart/form-data`

### POST `/api/sampah/klasifikasi`

**Fields:**
| Field | Type | Keterangan |
|-------|------|------------|
| `gambar` | File (jpeg/jpg/png/webp, max 5MB) | Gambar sampah |
| `beratKg` | Number | Berat sampah dalam kg |

**Response:**
```json
{
  "status": "success",
  "message": "Klasifikasi berhasil",
  "data": {
    "transaksiId": "string",
    "kategori": "string",
    "confidence": "number",
    "beratKg": "number",
    "hargaPerKg": "number",
    "nominal": "number"
  }
}
```

---

## Transaksi (`/api/transaksi`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/transaksi` | JWT | Lihat semua transaksi |
| GET | `/api/transaksi/user/:userId` | JWT | Lihat transaksi berdasarkan user |

**Header:** `Authorization: Bearer <accessToken>`

### GET `/api/transaksi`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "jenisSampahId": "string",
      "kategori": "string",
      "confidence": "number",
      "beratKg": "number",
      "hargaPerKg": "number",
      "nominal": "number",
      "gambarPath": "string",
      "createdAt": "datetime",
      "user": { "id": "string", "nama": "string", "email": "string" },
      "jenisSampah": { "id": "string", "kategori": "string", "hargaPerKg": "number" }
    }
  ]
}
```

### GET `/api/transaksi/user/:userId`

**Response:** Sama seperti di atas, hanya difilter berdasarkan userId.

---

## Ringkasan

| # | Method | Endpoint | Auth | Deskripsi |
|---|--------|----------|------|-----------|
| 1 | POST | `/api/auth/register` | ✗ | Registrasi |
| 2 | POST | `/api/auth/login` | ✗ | Login |
| 3 | POST | `/api/auth/refresh-token` | ✗ | Refresh token |
| 4 | POST | `/api/auth/logout` | ✗ | Logout |
| 5 | GET | `/api/user/profile` | ✓ | Lihat profil |
| 6 | PUT | `/api/user/profile` | ✓ | Update profil |
| 7 | DELETE | `/api/user/profile` | ✓ | Hapus akun |
| 8 | POST | `/api/sampah/klasifikasi` | ✓ | Klasifikasi sampah |
| 9 | GET | `/api/transaksi` | ✓ | Semua transaksi |
| 10 | GET | `/api/transaksi/user/:userId` | ✓ | Transaksi per user |
