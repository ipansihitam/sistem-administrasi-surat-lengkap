'use server';

import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveSuratUmum(prevState, formData) {
    const jenisSurat = formData.get('jenisSurat');
    const kategori = formData.get('kategori');
    const nomorSurat = formData.get('nomorSurat');
    const tanggalSurat = formData.get('tanggalSurat');
    const perihal = formData.get('perihal');
    const pengirim = formData.get('pengirim');
    const tujuan = formData.get('tujuan');

    if (!jenisSurat || !nomorSurat || !tanggalSurat || !perihal) {
        return { message: 'Validasi gagal: Semua field umum wajib diisi.', status: 'error' };
    }
    if (jenisSurat === 'Surat Masuk' && !pengirim) {
        return { message: 'Validasi gagal: Field Pengirim wajib diisi untuk Surat Masuk.', status: 'error' };
    }
    if (jenisSurat === 'Surat Keluar' && !tujuan) {
        return { message: 'Validasi gagal: Field Tujuan wajib diisi untuk Surat Keluar.', status: 'error' };
    }

    try {
        const dataToSave = {
            jenisSurat,
            kategori,
            nomorSurat,
            tanggalSurat,
            perihal,
            pengirim: pengirim || '', 
            tujuan: tujuan || '',
            createdAt: serverTimestamp(),
            suratType: 'umum' // Tandai sebagai surat umum
        };

        await addDoc(collection(db, 'surat'), dataToSave);

    } catch (error) {
        console.error("Error saat menyimpan surat umum: ", error);
        return { message: `Terjadi error saat menyimpan ke database: ${error.message}`, status: 'error' };
    }
    
    // --- PERBAIKAN: Arahkan revalidasi dan redirect ke halaman arsip surat umum yang baru ---
    revalidatePath('/surat-umum');
    redirect('/surat-umum');

    return { message: 'Surat berhasil disimpan!', status: 'success' };
}
