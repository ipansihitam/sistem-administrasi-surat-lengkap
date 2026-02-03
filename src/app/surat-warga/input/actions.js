'use server';

import { db } from '../../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function createSuratWarga(prevState, formData) {
  const rawData = Object.fromEntries(formData.entries());

  // Basic validation
  if (!rawData.jenisSurat || !rawData.nama) {
    return { success: false, message: 'Jenis surat dan nama pemohon harus diisi.' };
  }

  try {
    const docData = {
      ...rawData,
      createdAt: Timestamp.now(),
      status: 'Diajukan', // Status awal untuk surat warga
    };

    // Konversi tanggal ke format yang benar untuk database
    if(docData.tanggalSurat) {
        docData.tanggalSurat = new Date(docData.tanggalSurat);
    }
    if(docData.berlaku) {
        docData.berlaku = new Date(docData.berlaku);
    }

    await addDoc(collection(db, 'surat'), docData);
    revalidatePath('/surat-warga'); // Memperbarui data di halaman surat warga

    return { success: true, message: 'Surat warga berhasil diajukan!' };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, message: `Gagal mengajukan surat: ${error.message}` };
  }
}
