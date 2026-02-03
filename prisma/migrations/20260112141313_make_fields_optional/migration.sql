-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Surat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jenisSurat" TEXT NOT NULL,
    "kategori" TEXT,
    "nomorSurat" TEXT,
    "tanggalSurat" DATETIME,
    "perihal" TEXT,
    "pengirim" TEXT,
    "tujuan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nama" TEXT,
    "nik" TEXT,
    "ttl" TEXT,
    "jenisKelamin" TEXT,
    "agama" TEXT,
    "kewarganegaraan" TEXT,
    "alamat" TEXT,
    "namaUsaha" TEXT,
    "jenisUsaha" TEXT
);
INSERT INTO "new_Surat" ("agama", "alamat", "createdAt", "id", "jenisKelamin", "jenisSurat", "jenisUsaha", "kategori", "kewarganegaraan", "nama", "namaUsaha", "nik", "nomorSurat", "pengirim", "perihal", "tanggalSurat", "ttl", "tujuan", "updatedAt") SELECT "agama", "alamat", "createdAt", "id", "jenisKelamin", "jenisSurat", "jenisUsaha", "kategori", "kewarganegaraan", "nama", "namaUsaha", "nik", "nomorSurat", "pengirim", "perihal", "tanggalSurat", "ttl", "tujuan", "updatedAt" FROM "Surat";
DROP TABLE "Surat";
ALTER TABLE "new_Surat" RENAME TO "Surat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
