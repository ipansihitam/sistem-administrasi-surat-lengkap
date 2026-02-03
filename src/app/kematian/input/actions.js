'use server';

import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveSuratKematian(prevState, formData) {
    // Mengambil semua data dari form
    const data = Object.fromEntries(formData.entries());

    // Validasi sederhana: pastikan field yang wajib diisi tidak kosong
    const requiredFields = ['namaJenazah', 'nikJenazah', 'jenisKelamin', 'tanggalLahir', 'alamat', 'tanggalMeninggal', 'penyebabMeninggal', 'tempatMeninggal', 'namaPelapor', 'nikPelapor', 'hubunganPelapor'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return { message: `Validasi gagal: ${field} wajib diisi.`, status: 'error' };
        }
    }

    try {
        const dataToSave = {
            ...data,
            suratType: 'kematian', // Menambahkan tipe surat
            createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'surat_kematian'), dataToSave);

    } catch (error) {
        console.error("Error saat menyimpan surat kematian: ", error);
        return { message: `Terjadi error saat menyimpan ke database: ${error.message}`, status: 'error' };
    }
    
    // Revalidasi path untuk memastikan data baru tampil di arsip
    revalidatePath('/surat-masuk-keluar');
    // Redirect kembali ke halaman utama setelah sukses
    redirect('/surat-masuk-keluar');

    // State untuk sukses
    return { message: 'Surat Kematian berhasil disimpan!', status: 'success' };
}
