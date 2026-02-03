
'use server';

import { z } from 'zod';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const KematianSchema = z.object({
    suratId: z.string().optional(),

    // NOMOR SURAT
    nomorSurat_kode: z.string().min(1, { message: 'Kode surat harus diisi.' }),
    nomorSurat_bulan: z.string().min(1, { message: 'Bulan surat harus diisi.' }),
    nomorSurat_tahun: z.string().min(1, { message: 'Tahun surat harus diisi.' }),

    // DATA KEPALA KELUARGA
    kk_nama: z.string().optional(),
    kk_no: z.string().optional(),

    // JENAZAH
    jenazah_nik: z.string().optional(),
    jenazah_nama: z.string().min(1, { message: 'Nama jenazah harus diisi.' }),
    jenazah_jk: z.string().optional(),
    jenazah_tgllahir_tgl: z.string().optional(),
    jenazah_tgllahir_bln: z.string().optional(),
    jenazah_tgllahir_thn: z.string().optional(),
    jenazah_umur: z.string().optional(),
    jenazah_tempat_lahir: z.string().optional(),
    jenazah_agama: z.string().optional(),
    jenazah_pekerjaan: z.string().optional(),
    jenazah_alamat_alamat: z.string().optional(),
    jenazah_alamat_desa: z.string().optional(),
    jenazah_alamat_kecamatan: z.string().optional(),
    jenazah_alamat_kabkota: z.string().optional(),
    jenazah_alamat_provinsi: z.string().optional(),
    jenazah_anak_ke: z.string().optional(),
    jenazah_tglkematian_tgl: z.string().optional(),
    jenazah_tglkematian_bln: z.string().optional(),
    jenazah_tglkematian_thn: z.string().optional(),
    jenazah_pukul: z.string().optional(),
    jenazah_sebab_kematian: z.string().optional(),
    jenazah_tempat_kematian: z.string().optional(),
    jenazah_yang_menerangkan: z.string().optional(),

    // AYAH
    ayah_nik: z.string().optional(),
    ayah_nama: z.string().optional(),
    ayah_umur: z.string().optional(),
    ayah_pekerjaan: z.string().optional(),
    ayah_alamat_alamat: z.string().optional(),
    ayah_alamat_desa: z.string().optional(),
    ayah_alamat_kecamatan: z.string().optional(),
    ayah_alamat_kabkota: z.string().optional(),
    ayah_alamat_provinsi: z.string().optional(),

    // IBU
    ibu_nik: z.string().optional(),
    ibu_nama: z.string().optional(),
    ibu_umur: z.string().optional(),
    ibu_pekerjaan: z.string().optional(),
    ibu_alamat_alamat: z.string().optional(),
    ibu_alamat_desa: z.string().optional(),
    ibu_alamat_kecamatan: z.string().optional(),
    ibu_alamat_kabkota: z.string().optional(),
    ibu_alamat_provinsi: z.string().optional(),

    // PELAPOR
    pelapor_nik: z.string().optional(),
    pelapor_nama: z.string().optional(),
    pelapor_umur: z.string().optional(),
    pelapor_pekerjaan: z.string().optional(),
    pelapor_tgllahir_tgl: z.string().optional(),
    pelapor_tgllahir_bln: z.string().optional(),
    pelapor_tgllahir_thn: z.string().optional(),
    pelapor_alamat_alamat: z.string().optional(),
    pelapor_alamat_desa: z.string().optional(),
    pelapor_alamat_kecamatan: z.string().optional(),
    pelapor_alamat_kabkota: z.string().optional(),
    pelapor_alamat_provinsi: z.string().optional(),

    // SAKSI 1
    saksi1_nik: z.string().optional(),
    saksi1_nama: z.string().optional(),
    saksi1_umur: z.string().optional(),
    saksi1_pekerjaan: z.string().optional(),
    saksi1_alamat_alamat: z.string().optional(),
    saksi1_alamat_desa: z.string().optional(),
    saksi1_alamat_kecamatan: z.string().optional(),
    saksi1_alamat_kabkota: z.string().optional(),
    saksi1_alamat_provinsi: z.string().optional(),

    // SAKSI 2
    saksi2_nik: z.string().optional(),
    saksi2_nama: z.string().optional(),
    saksi2_umur: z.string().optional(),
    saksi2_pekerjaan: z.string().optional(),
    saksi2_alamat_alamat: z.string().optional(),
    saksi2_alamat_desa: z.string().optional(),
    saksi2_alamat_kecamatan: z.string().optional(),
    saksi2_alamat_kabkota: z.string().optional(),
    saksi2_alamat_provinsi: z.string().optional(),
});

export async function saveKematian(prevState, formData) {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = KematianSchema.safeParse(rawData);

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

  const nomorSurat = `474.3/${nomorSurat_kode || '...'}/${nomorSurat_bulan || '...'}/${nomorSurat_tahun || '...'}`;

  try {
      const docData = {
          nomorSurat,
          formData: formDataClean,
          jenisSurat: 'Kematian',
          nama: formDataClean.jenazah_nama, 
          status: 'Diajukan',
      };

      if (suratId) {
          const docRef = doc(db, 'surat', suratId);
          await updateDoc(docRef, docData);
          revalidatePath('/arsip-surat');
          return { success: true, message: 'Data kematian berhasil diperbarui!' };
      } else {
          docData.createdAt = serverTimestamp();
          await addDoc(collection(db, 'surat'), docData);
          revalidatePath('/arsip-surat');
          return { success: true, message: 'Data kematian berhasil disimpan!' };
      }

  } catch (error) {
      console.error("Gagal memproses dokumen: ", error);
      return { success: false, message: `Terjadi kesalahan pada server: ${error.message}` };
  }
}
