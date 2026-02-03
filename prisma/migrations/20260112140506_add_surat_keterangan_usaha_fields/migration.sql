-- CreateTable
CREATE TABLE "Surat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jenisSurat" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "nomorSurat" TEXT NOT NULL,
    "tanggalSurat" DATETIME NOT NULL,
    "perihal" TEXT NOT NULL,
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
