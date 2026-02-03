'use server';

import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function updateSuratStatus(id, newStatus) {
  try {
    const suratRef = doc(db, 'surat', id);
    await updateDoc(suratRef, {
      status: newStatus
    });
    // Revalidate the path to show the updated data
    revalidatePath('/');
    revalidatePath('/surat-masuk-keluar'); 
    return { success: true, message: 'Status berhasil diperbarui.' };
  } catch (error) {
    console.error("Error updating status: ", error);
    return { success: false, message: 'Gagal memperbarui status.' };
  }
}
