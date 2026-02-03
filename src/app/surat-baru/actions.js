
'use server';

import { db } from '../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function addSurat(formData) {
  const jenisSurat = formData.get('jenisSurat');
  const kategori = formData.get('kategori');
  const nomorSurat = formData.get('nomorSurat');

  if (!jenisSurat || !kategori || !nomorSurat) {
    return { success: false, message: 'Semua field harus diisi.' };
  }

  const collectionName = jenisSurat === 'masuk' ? 'suratMasuk' : 'suratKeluar';

  try {
    await addDoc(collection(db, collectionName), {
      kategori,
      nomorSurat,
      createdAt: Timestamp.now(),
    });

    revalidatePath('/surat-masuk-keluar');
    revalidatePath('/surat-baru');
    return { success: true, message: 'Surat berhasil ditambahkan.' };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, message: 'Gagal menambahkan surat.' };
  }
}
