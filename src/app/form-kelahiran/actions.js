
'use server';

import { z } from 'zod';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const KelahiranSchema = z.object({
    suratId: z.string().optional(),

    // NOMOR SURAT
    nomorSurat_kode: z.string().min(1, { message: 'Kode surat harus diisi.' }),
    nomorSurat_bulan: z.string().min(1, { message: 'Bulan surat harus diisi.' }),
    nomorSurat_tahun: z.string().min(1, { message: 'Tahun surat harus diisi.' }),

    // DATA KEPALA KELUARGA
    kk_nama: z.string().optional(),
    kk_no: z.string().optional(),

    // BAYI / ANAK
    anak_nama: z.string().min(1, { message: 'Nama bayi harus diisi.' }),
    anak_jk: z.string().optional(),
    anak_tempat_dilahirkan: z.string().optional(),
    anak_tempat_kelahiran: z.string().optional(),
    anak_tgllahir_tgl: z.string().optional(),
    anak_tgllahir_bln: z.string().optional(),
    anak_tgllahir_thn: z.string().optional(),
    anak_pukul: z.string().optional(),
    anak_jenis_kelahiran: z.string().optional(),
    anak_kelahiran_ke: z.string().optional(),
    anak_penolong: z.string().optional(),
    anak_berat: z.string().optional(),
    anak_panjang: z.string().optional(),

    // IBU
    ibu_nik: z.string().optional(),
    ibu_nama: z.string().min(1, { message: 'Nama ibu harus diisi.' }),
    ibu_tgllahir_tgl: z.string().optional(),
    ibu_tgllahir_bln: z.string().optional(),
    ibu_tgllahir_thn: z.string().optional(),
    ibu_umur: z.string().optional(),
    ibu_pekerjaan: z.string().optional(),
    ibu_alamat_alamat: z.string().optional(),
    ibu_alamat_desa: z.string().optional(),
    ibu_alamat_kecamatan: z.string().optional(),
    ibu_alamat_kabupaten: z.string().optional(),
    ibu_alamat_provinsi: z.string().optional(),
    ibu_kewarganegaraan: z.string().optional(),

    // AYAH
    ayah_nik: z.string().optional(),
    ayah_nama: z.string().min(1, { message: 'Nama ayah harus diisi.' }),
    ayah_tgllahir_tgl: z.string().optional(),
    ayah_tgllahir_bln: z.string().optional(),
    ayah_tgllahir_thn: z.string().optional(),
    ayah_umur: z.string().optional(),
    ayah_pekerjaan: z.string().optional(),
    ayah_alamat_alamat: z.string().optional(),
    ayah_alamat_desa: z.string().optional(),
    ayah_alamat_kecamatan: z.string().optional(),
    ayah_alamat_kabupaten: z.string().optional(),
    ayah_alamat_provinsi: z.string().optional(),
    ayah_kewarganegaraan: z.string().optional(),

    // TGL PERKAWINAN
    tgl_perkawinan_tgl: z.string().optional(),
    tgl_perkawinan_bln: z.string().optional(),
    tgl_perkawinan_thn: z.string().optional(),

    // PELAPOR
    pelapor_nik: z.string().optional(),
    pelapor_nama: z.string().optional(),

    // SAKSI
    saksi1_nik: z.string().optional(),
    saksi1_nama: z.string().optional(),
    saksi2_nik: z.string().optional(),
    saksi2_nama: z.string().optional(),
});

export async function saveKelahiran(prevState, formData) {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = KelahiranSchema.safeParse(rawData);

  if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Gagal: Mohon periksa kembali isian Anda.',
      };
  }
  
  const {
    suratId,
    nomorSurat_kode,
    nomorSurat_bulan,
    nomorSurat_tahun,
    ...formDataClean
  } = validatedFields.data;

  const nomorSurat = `474.1/${nomorSurat_kode || '...'}/${nomorSurat_bulan || '...'}/${nomorSurat_tahun || '...'}`;

  try {
      const docData = {
          nomorSurat,
          formData: formDataClean,
          jenisSurat: 'Kelahiran',
          nama: formDataClean.anak_nama, 
          status: 'Diajukan',
      };

      if (suratId) {
          const docRef = doc(db, 'surat', suratId);
          await updateDoc(docRef, docData);
          revalidatePath('/arsip-surat');
          return { success: true, message: 'Data kelahiran berhasil diperbarui!' };
      } else {
          docData.createdAt = serverTimestamp();
          await addDoc(collection(db, 'surat'), docData);
          revalidatePath('/arsip-surat');
          return { success: true, message: 'Data kelahiran berhasil disimpan!' };
      }

  } catch (error) {
      console.error("Gagal memproses dokumen: ", error);
      return { success: false, message: `Terjadi kesalahan pada server: ${error.message}` };
  }
}
