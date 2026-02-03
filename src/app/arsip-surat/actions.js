'use server';

import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { revalidatePath } from 'next/cache';

export async function deleteAllSurat() {
    try {
        const suratCollectionRef = collection(db, 'surat');
        const querySnapshot = await getDocs(suratCollectionRef);
        
        if (querySnapshot.empty) {
            return { success: true, message: 'Tidak ada surat untuk dihapus.' };
        }

        const batch = writeBatch(db);
        querySnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        revalidatePath('/arsip-surat');

        return { success: true, message: 'Semua arsip surat berhasil dihapus.' };

    } catch (error) {
        console.error("Error deleting all surat:", error);
        return { success: false, message: 'Terjadi kesalahan saat menghapus arsip surat.' };
    }
}
