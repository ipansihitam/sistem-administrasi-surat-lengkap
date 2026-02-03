'use server';

import { db } from '../../lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// Fungsi ini hanya akan menghapus semua dokumen di koleksi 'surat' (Surat Warga)
export async function deleteAllSuratWarga() {
    try {
        const suratCollectionRef = collection(db, 'surat');
        const querySnapshot = await getDocs(suratCollectionRef);
        
        if (querySnapshot.empty) {
            revalidatePath('/surat-warga');
            return { message: 'Tidak ada surat warga untuk dihapus.' };
        }

        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        
        revalidatePath('/surat-warga');
        return { message: 'Semua surat warga berhasil dihapus!' };
    } catch (error) {
        console.error("Error deleting surat warga documents: ", error);
        return { message: `Gagal menghapus surat warga: ${error.message}` };
    }
}
