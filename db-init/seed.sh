#!/bin/sh
set -e

echo "[db-seeder] Menunggu PostgreSQL siap..."
until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" >/dev/null 2>&1; do
  sleep 2
done

echo "[db-seeder] Menunggu tabel jenis_sampah dibuat oleh Prisma migrations..."
until psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  -c "SELECT 1 FROM jenis_sampah LIMIT 0" >/dev/null 2>&1; do
  sleep 2
done

echo "[db-seeder] Menjalankan seed kategori..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  -f /seed/seed-categories.sql

echo "[db-seeder] Seed kategori selesai."
